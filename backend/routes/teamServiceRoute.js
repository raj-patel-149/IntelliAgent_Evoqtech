const express = require("express");
const TeamService = require("../models/TeamService");
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
const Case = require("../models/Case");
const User = require("../models/User");
const Notification = require("../models/Notification");
const FIXED_GST = 0.18;
const router = express.Router();

const validStatuses = [
  "pending",
  "expired",
  "accepted",
  "assigned",
  "scheduled",
  "inProgress",
  "waitingForCustomer",
  "waitingForParts",
  "completed",
  "missed",
  "waitingForApproval",
  "reopened",
  "halted",
  "rejected",
  "cancelled",
  "closed",
];

router.post("/assign", async (req, res) => {
  try {
    const { caseId, employees, employees_name } = req.body;

    if (!caseId || !employees || employees.length === 0) {
      return res
        .status(400)
        .json({ message: "Case ID and employees are required" });
    }

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    const template = await TeamServiceTemplate.findById(
      caseData.teamServiceTemplateId
    );
    if (!template) {
      return res
        .status(404)
        .json({ message: "Team Service Template not found" });
    }

    // Find existing team service record
    let teamService = await TeamService.findOne({ caseId });

    if (teamService) {
      // Filter out employees that are already assigned
      const newEmployees = employees.filter(
        (empId) => !teamService.employees.includes(empId)
      );

      const newEmployeeNames = employees_name.filter(
        (name, index) =>
          !teamService.employees_name.includes(name) &&
          newEmployees.includes(employees[index])
      );

      if (newEmployees.length === 0) {
        return res.status(400).json({
          message: "All selected employees are already assigned to this case",
        });
      }

      // Only add the new employees
      teamService.employees = [...teamService.employees, ...newEmployees];
      teamService.employees_name = [
        ...teamService.employees_name,
        ...newEmployeeNames,
      ];
    } else {
      // Create new record if it doesn't exist
      teamService = new TeamService({
        caseId,
        employees,
        employees_name,
      });
    }

    const fullEmployeeData = await User.find({
      _id: { $in: teamService.employees },
    });

    const deptMap = {};
    fullEmployeeData.forEach((emp) => {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = [];
      }
      deptMap[emp.department].push({
        _id: emp._id,
      });
    });

    const departmentProgressData = Object.entries(deptMap).map(
      ([department, employees]) => ({
        name: department,
        employees, // array of enriched employee objects
        status: "accepted",
        startedAt: null,
        completedAt: null,
      })
    );

    // Step 1: Build a map from dept name to the existing departmentProgressData object
    const progressMap = {};
    departmentProgressData.forEach((item) => {
      progressMap[item.name.toLowerCase()] = item; // normalize for safety
    });

    // Step 2: Reorder based on template
    const newDepartmentProgressData = template.requirements.map((req) => {
      const deptName = req.department.trim().toLowerCase();
      return (
        progressMap[deptName] || {
          name: req.department,
          employees: [],
          status: "accepted",
          startedAt: null,
          completedAt: null,
        }
      );
    });

    caseData.departmentProgress = newDepartmentProgressData;

    // Update case status if needed
    if (employees.length > 0 && caseData.receiver === "NA") {
      caseData.case_status = "accepted";
      caseData.service_status = "accepted";
      caseData.receiver = "manager123";
      caseData.teamServiceDetailsId = teamService._id;
    }
    await caseData.save();
    await teamService.save();

    // Notification logic remains the same
    if (caseData.case_status === "accepted" && caseData.receiver !== "NA") {
      let content_notify = `Team Service : ${caseData.header}`;

      const newNotification = new Notification({
        receiver: employees_name,
        sender: "Manager",
        content: content_notify,
        status: "unread",
        case_status: caseData.case_status,
        department: caseData.header,
        service: caseData.service,
        date: caseData.date,
        time: caseData.time,
        case_id: caseData._id,
      });

      await newNotification.save();
    }

    res.status(201).json({
      message: "Employees assigned successfully",
      teamService,
    });
  } catch (error) {
    console.error("Error assigning employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/team-remove-employee", async (req, res) => {
  try {
    const { caseId, employeeId } = req.body;

    if (!caseId || !employeeId) {
      return res
        .status(400)
        .json({ message: "Both caseId and employeeId are required." });
    }

    const teamService = await TeamService.findOne({ caseId });

    if (!teamService) {
      return res.status(404).json({ message: "TeamService not found." });
    }

    const empIndex = teamService.employees.findIndex(
      (emp) => emp.toString() === employeeId
    );

    if (empIndex === -1) {
      return res.status(404).json({ message: "Employee not found in team." });
    }

    // Remove employee and corresponding name
    teamService.employees.splice(empIndex, 1);
    teamService.employees_name.splice(empIndex, 1);

    await teamService.save();

    res.status(200).json({
      message: "Employee removed successfully.",
      teamService,
    });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to fetch all data from TeamService based on caseId
router.get("/:caseId", async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId) {
      return res.status(400).json({ message: "Case ID is required" });
    }

    const teamService = await TeamService.findOne({ caseId });

    if (!teamService) {
      return res
        .status(404)
        .json({ message: "No data found for this case ID" });
    }

    res.status(200).json(teamService);
  } catch (error) {
    console.error("Error fetching team service data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//fetch data based on employeeid
router.get("/data/:EmployeeId", async (req, res) => {
  try {
    const { EmployeeId } = req.params;

    if (!EmployeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Query the database to find all records where the EmployeeId exists in the employees array
    const teamService = await TeamService.find({ employees: EmployeeId });

    // Check if the array is empty
    if (teamService.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for this employee ID" });
    }

    res.status(200).json(teamService);
  } catch (error) {
    console.error("Error fetching team service data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Updata status

router.patch("/update-team-service-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { service_status, receiver_id } = req.body;

    const user = await User.findById(receiver_id);
    const caseData = await Case.findById(id);

    if (!user || !caseData) {
      return res
        .status(404)
        .json({ success: false, message: "User or Case not found" });
    }

    const departments = caseData.departmentProgress;

    console.log(departments);

    // 1. Find the current active or next pending department
    const activeIndex = departments.findIndex(
      (dep) => dep.status === "inProgress" || dep.status === "halted"
    );
    const nextIndex =
      activeIndex === -1
        ? departments.findIndex((dep) => dep.status === "accepted")
        : activeIndex;

    if (nextIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "All departments already completed.",
      });
    }

    const currentDepartment = departments[nextIndex];

    console.log(activeIndex);

    // 2. Ensure user is in this department
    const isEmployeeAuthorized = currentDepartment.employees.some((emp) =>
      emp._id.equals(user._id)
    );

    if (!isEmployeeAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this department's status.",
      });
    }

    // 3. Update department status
    if (service_status === "inProgress") {
      currentDepartment.status = "inProgress";
      currentDepartment.startedAt = new Date();
      caseData.receiver = user.name;
      caseData.actual_start_time = new Date();
    }

    if (service_status === "halted") {
      currentDepartment.status = "halted";
      caseData.receiver = user.name;
      caseData.halted_time = new Date();
    }

    if (service_status === "completed") {
      currentDepartment.status = "completed";
      currentDepartment.completedAt = new Date();

      // Check if this was the last department
      const isLast = nextIndex === departments.length - 1;
      if (isLast) {
        caseData.service_status = "completed";
        caseData.actual_end_time = new Date();
      } else {
        // Move next department to inProgress
        departments[nextIndex + 1].status = "accepted";
        departments[nextIndex + 1].startedAt = new Date();
        const nextDeptEmpIds = departments[nextIndex + 1].employees.map((emp) =>
          emp._id.toString()
        );

        // Optionally, notify next department
        const nextUsers = await User.find({ _id: { $in: nextDeptEmpIds } });
        const nextReceivers = nextUsers.map((u) => u.name);

        await new Notification({
          receiver: nextReceivers,
          sender: user.name,
          content: `Your department has been activated for case: ${caseData.header}`,
          status: "unread",
          case_status: "inProgress",
          department: departments[nextIndex + 1].name,
          service: caseData.service,
          date: caseData.date,
          time: caseData.time,
          case_id: caseData._id,
        }).save();
      }
    }

    await caseData.save();

    return res.status(200).json({
      success: true,
      message: "Service status updated successfully.",
      case: caseData,
    });
  } catch (error) {
    console.error("Error updating service status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/teamSerice-findById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await TeamServiceTemplate.findById(id);
    // console.log("skills", skill);
    const gstAmount = skill.basePrice * FIXED_GST;
    const totalPrice = skill.basePrice + gstAmount;
    const updatedSkills = {
      _id: skill._id,
      skill_Name: skill.service_name,
      department: "Custom Service",
      basePrice: skill.basePrice,
      currency: skill.currency,
      duration: skill.completion_time,
      totalPrice,
      gstAmount,
      description: skill.description,
    };

    res.json(updatedSkills);

    // res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
