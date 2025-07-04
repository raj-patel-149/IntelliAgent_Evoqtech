const express = require("express");
const router = express.Router();
const moment = require("moment");
const Case = require("../models/Case");
const User = require("../models/User");
const Skill = require("../models/Skill");

const TeamService = require("../models/TeamService");
const EmployeeScheduling = require("../models/EmployeeScheduling");
const Notification = require("../models/Notification");
const dayjs = require("dayjs"); // Ensure dayjs is installed
const customParseFormat = require("dayjs/plugin/customParseFormat");
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
dayjs.extend(customParseFormat);

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

function getHourSlot(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Round up if minutes > 30
  if (minutes > 30) {
    hours += 1;
  }

  return hours;
}

router.post("/add-case", async (req, res) => {
  const { formData, user, selectedTime, currentService, quantity } = req.body;
  console.log("req.body", req.body);

  try {
    // Ensure correct parsing of time with date
    // const localTime = new Date(selectedTime).toLocaleString();
    // const date = localTime.split(",")[0];
    // const time = localTime.split(",")[1];
    const fullDateTime = dayjs(selectedTime);

    // const fullDateTime = dayjs(`${date} ${time}`, "MM/DD/YYYY hh:mm:ss A");
    console.log("fullDateTime from add case", fullDateTime);

    if (!fullDateTime.isValid()) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    // Check if date parsing failed
    // if (!fullDateTime.isValid()) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid date or time format" });
    // }

    // Calculate times

    // const reminderTime = time.subtract(30, "minutes").format("hh:mm A"); // 30 mins before as string
    // const missTime = time.add(30, "minutes").format("hh:mm A"); // 30 mins after as

    const matchingService = await TeamServiceTemplate.findOne({
      service_name: currentService.skill_Name,
    });

    let teamWorkValue = null;
    let teamServiceTemplateId;
    if (matchingService) {
      teamWorkValue = "yes";
      teamServiceTemplateId = matchingService._id;
    } else {
      teamWorkValue = "no";
    }
    // console.log("date from add case",date);

    // Create new case entry
    const newCase = new Case({
      sender: user.name,
      header: currentService.department,
      service: currentService.skill_Name,
      quantity: quantity,
      date: fullDateTime.format("DD/MM/YYYY"),
      time: fullDateTime.format("hh:mm A"),
      location: `${formData.flat} ${formData.landmark} ${formData.location}`,
      description: currentService.description,
      //reminder_time: reminderTime, // Store reminder time as string
      //miss_time: missTime, // Store miss time as string// Store the updated time
      teamWork: teamWorkValue,
      teamServiceTemplateId: teamServiceTemplateId,
    });

    await newCase.save();

    // Find all users who match the service
    const matchingUsers = await User.find({
      service: currentService.skill_Name,
    });

    // Extract receiver names (or IDs if needed)
    const receivers = matchingUsers.map((user) => user.name);

    if (newCase.teamWork !== "yes") {
      const newNotification = new Notification({
        receiver: receivers, // Placeholder for now
        sender: user.name,
        content: `New case added: ${currentService.department} - ${currentService.skill_Name}`,
        status: "unread", // Default status
        department: currentService.department,
        service: currentService.skill_Name,
        date: fullDateTime.format("DD/MM/YYYY"),
        time: fullDateTime.format("hh:mm A"),
        case_id: newCase._id,
        case_status: "accepted-agent",
      });

      await newNotification.save();
    } else {
      const newNotification = new Notification({
        receiver: ["manager123"], // Placeholder for now
        sender: user.name,
        content: `New team service :${currentService.department} - ${currentService.skill_Name}`,
        status: "unread", // Default status
        department: currentService.department,
        service: currentService.skill_Name,
        date: fullDateTime.format("DD/MM/YYYY"),
        time: fullDateTime.format("hh:mm A"),
        case_id: newCase._id,
        case_status: "accepted-agent",
      });
      await newNotification.save();
    }

    res.status(201).json({
      success: true,
      message: "Case registered successfully!",
      case: newCase,
    });
  } catch (error) {
    console.error("Error adding case:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/filterCases", async (req, res) => {
  try {
    const { id, service_status } = req.query;
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let filter = {
      service: { $in: user.service },
      receiver: user.name,
    };

    // Apply status filter only if it's a valid status and not "all"
    if (service_status !== "all" && validStatuses.includes(service_status)) {
      filter.service_status = service_status;
    }

    const serviceCases = await Case.find(filter);
    const cases = [
      ...new Map(
        [...serviceCases].map((item) => [item._id.toString(), item])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.post("/cases-by-ids", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or empty ID array" });
    }

    const cases = await Case.find({ _id: { $in: ids } }); // Fetch all matching employees

    if (cases.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Cases found" });
    }

    res.json({ success: true, cases });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch case by id
router.get("/getCaseById/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    res.status(200).json(caseData);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
//fetch client cases

router.get("/client/cases", async (req, res) => {
  const { name } = req.query;
  console.log(name);

  try {
    const cases = await Case.find({
      sender: name,
    });
    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// ✅ Fetch All Cases
router.get("/:id/cases", async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const serviceCases = await Case.find({
      service: { $in: user.service },
      $and: [
        {
          $or: [
            { teamWork: "no" }, // Only include cases where teamWork is "no"
            { teamWork: { $exists: false } }, // OR cases where teamWork is not set
          ],
        },
        {
          $or: [
            { receiver: user.name },
            { receiver: "NA" },
            { case_status: { $in: ["not show", "rejected"] } },
          ],
        },
      ],
    });

    const cases = [
      ...new Map(
        [...serviceCases].map((item) => [item._id.toString(), item])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// ✅ Fetch All Team services
router.get("/team-cases", async (req, res) => {
  try {
    const StatusCases = await Case.find({
      teamWork: "yes",
    });

    const cases = [
      ...new Map(
        [...StatusCases].map((item) => [item._id.toString(), item])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// ✅ Fetch All Cases
router.get("/:id/accepted-cases", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("-backend---------------->",id);

    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const StatusCases = await Case.find({
      service_status: "accepted",
      receiver: user.name,
    });
    const userCases = await Case.find({
      receiver: user.name,
      service_status: "accepted",
    });
    const cases = [
      ...new Map(
        [...StatusCases, ...userCases].map((item) => [
          item._id.toString(),
          item,
        ])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.patch("/update-caseStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { case_status, receiver, receiver_id } = req.body;
    console.log("req body from update case", req.body);

    // let user = await User.findById(receiver_id);
    let caseData = await Case.findById(id);
    let user = receiver_id ? await User.findById(receiver_id) : null;

    if (!caseData) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }
    console.log("case status", case_status);

    if (!["accepted", "rejected", "pending"].includes(case_status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status update" });
    }

    let updatedCase;
    if (
      caseData.receiver === (user ? user.name : null) ||
      caseData.case_status === "rejected" ||
      caseData.receiver === "NA"
    ) {
      updatedCase = await Case.findByIdAndUpdate(
        id,
        {
          service_status: case_status,
          case_status,
          receiver,
        },
        { new: true }
      );

      if (!updatedCase) {
        return res
          .status(404)
          .json({ success: false, message: "Case not found" });
      }
      // ✅ Only create a notification if status is "accepted"
      if (case_status === "accepted" && updatedCase.receiver !== "NA") {
        let content_notify = `Case was accepted: ${updatedCase.header}`;

        const newNotification = new Notification({
          receiver: [updatedCase.sender], // Case sender becomes the receiver
          sender: updatedCase.receiver, // Case receiver becomes the sender
          content: content_notify,
          status: "unread",
          case_status: updatedCase.case_status,
          department: updatedCase.header,
          service: updatedCase.service,
          date: updatedCase.date,
          time: updatedCase.time,
          case_id: updatedCase._id,
        });

        await newNotification.save(); // ✅ Save notification

        const hourSlot = getHourSlot(caseData.time);

        const employeeScheduling = new EmployeeScheduling({
          employeeId: user._id,
          serviceId: caseData._id,
          start_time: hourSlot,
          end_time: hourSlot + 2,
          date: caseData.date,
          status: "accepted",
        });

        await employeeScheduling.save();
      }

      res.status(200).json({
        success: true,
        message: "Case status updated successfully!",
        case: updatedCase,
      });
    }
  } catch (error) {
    console.error("Error updating case:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.patch("/update-service-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { service_status, receiver, receiver_id } = req.body;

    let user = await User.findById(receiver_id);
    let caseData = await Case.findById(id);

    if (!user || !caseData) {
      return res
        .status(404)
        .json({ success: false, message: "User or Case not found" });
    }

    if (!validStatuses.includes(service_status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status update" });
    }

    let updatedCase;
    let teamServiceCase;

    if (
      caseData.receiver === user.name ||
      caseData.service_status === "pending" ||
      caseData.receiver === "NA"
    ) {
      switch (service_status) {
        case "inProgress":
          updatedCase = await Case.findByIdAndUpdate(
            id,
            { service_status, receiver, actual_start_time: new Date() },
            { new: true }
          );

          const inProgressSchedule = await EmployeeScheduling.findOne({
            employeeId: user._id,
            serviceId: caseData._id,
          });

          if (inProgressSchedule && inProgressSchedule.status === "accepted") {
            inProgressSchedule.status = "inProgress";
            await inProgressSchedule.save();
          }
          break;

        case "halted":
          updatedCase = await Case.findByIdAndUpdate(
            id,
            { service_status, receiver, halted_time: new Date() },
            { new: true }
          );
          break;

        case "completed":
          updatedCase = await Case.findByIdAndUpdate(
            id,
            { service_status, receiver, actual_end_time: new Date() },
            { new: true }
          );

          // Update EmployeeScheduling status
          const completedSchedule = await EmployeeScheduling.findOne({
            employeeId: user._id,
            serviceId: caseData._id,
          });

          if (completedSchedule && completedSchedule.status === "inProgress") {
            completedSchedule.status = "completed";
            await completedSchedule.save();
          }
          user.score += 5;
          const updatedUser = await user.save();

          break;

        default:
          updatedCase = await Case.findByIdAndUpdate(
            id,
            { service_status, receiver },
            { new: true }
          );
          break;
      }

      if (!updatedCase) {
        return res
          .status(404)
          .json({ success: false, message: "Service not found" });
      }

      let content_notify;
      let receiver_notify = [updatedCase.sender];
      let employeeNames;

      switch (service_status) {
        case "inProgress":
          content_notify = `Your service has started for: ${updatedCase.header}`;
          break;
        case "completed":
          content_notify = `Your service has been completed for: ${updatedCase.service}`;
          receiver_notify = [...receiver_notify];
          break;
        case "waitingForApproval":
          content_notify = `Service approval requested by ${updatedCase.receiver} for: ${updatedCase.header}`;
          receiver_notify = ["manager123"];
          break;
        case "reopened":
          content_notify = `Your service request for ${updatedCase.header} has been reopened`;
          break;
        case "halted":
          content_notify = `Your service was halted by the agent for: ${updatedCase.header}`;
          break;
        case "missed":
          content_notify = `Your service for ${updatedCase.header} was missed. Please request manager approval to reschedule.`;
          receiver_notify = ["manager123"];
          break;
        default:
          content_notify = `Your service status updated to ${service_status} for: ${updatedCase.header}`;
          break;
      }

      const newNotification = new Notification({
        receiver: receiver_notify,
        sender: updatedCase.receiver,
        content: content_notify,
        status: "unread",
        case_status: updatedCase.service_status,
        department: updatedCase.header,
        service: updatedCase.service,
        date: updatedCase.date,
        time: updatedCase.time,
        case_id: updatedCase._id,
      });

      await newNotification.save();

      return res.status(200).json({
        success: true,
        message: "Service status updated successfully!",
        case: updatedCase,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this service status.",
      });
    }
  } catch (error) {
    console.error("Error updating service status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.patch("/update-service-status-manager/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { service_status } = req.body;
    console.log("req body from update case", req.body);

    if (!validStatuses.includes(service_status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status update" });
    }

    const date = dayjs().format("DD-MM-YYYY");
    const time = dayjs().format("hh:mm A");
    const fullDateTime = dayjs(`${date} ${time}`, "DD-MM-YYYY hh:mm A");

    if (!fullDateTime.isValid()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date or time format" });
    }

    const scheduledStartTime = fullDateTime.add(30, "minutes").toDate();

    let updatedCase = await Case.findByIdAndUpdate(
      id,
      { service_status, time, scheduled_start_time: `${scheduledStartTime}` },
      { new: true }
    );

    if (!updatedCase) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    const newNotification = new Notification({
      receiver: [updatedCase.receiver],
      sender: "manager123",
      content: `Your service for ${updatedCase.header} approval was accepted by manager. You can restart now.`,
      status: "unread",
      case_status: updatedCase.service_status,
      department: updatedCase.header,
      service: updatedCase.service,
      date: updatedCase.date,
      time: updatedCase.time,
      case_id: updatedCase._id,
    });

    await newNotification.save();
    res.status(200).json({
      success: true,
      message: "Service status updated successfully!",
      case: updatedCase,
    });
    // }
  } catch (error) {
    console.error("Error updating service status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/accepted-cases/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const StatusCases = await Case.find({
      service_status: "accepted",
      receiver: user.name,
    });
    const userCases = await Case.find({
      receiver: user.name,
      service_status: "accepted",
    });
    const cases = [
      ...new Map(
        [...StatusCases, ...userCases].map((item) => [
          item._id.toString(),
          item,
        ])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/case-details/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let cases = await Case.findById(id);
    if (!cases) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/manager-services/:service", async (req, res) => {
  try {
    const { service } = req.params;
    console.log("hii from manager", service);

    const today = new Date();

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    let cases;
    console.log("formattedDate", formattedDate);

    if (service === "all") {
      const StatusCases = await Case.find({
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      console.log("cases", cases);
    } else if (service === "created") {
      const StatusCases = await Case.find({
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "Approval") {
      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: "waitingForApproval",
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "history") {
      const today = moment().format("YYYYMMDD"); // Convert today to YYYYMMDD format

      const pastServices = await Case.find({
        $expr: {
          $lt: [
            {
              $concat: [
                { $substr: ["$date", 6, 4] }, // Year (YYYY)
                { $substr: ["$date", 3, 2] }, // Month (MM)
                { $substr: ["$date", 0, 2] }, // Day (DD)
              ],
            },
            today, // Compare with today's date in YYYYMMDD format
          ],
        },
      });

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...pastServices].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      //  console.log("cases", cases);
    } else {
      // Fetch cases based on the given status
      // console.log("service", service);

      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: service,
      });

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/user-services/:service", async (req, res) => {
  try {
    const { service } = req.params;
    console.log("hii from manager", service);

    const today = new Date();

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    let cases;

    if (service === "all") {
      const StatusCases = await Case.find({
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "created") {
      const StatusCases = await Case.find({
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "Approval") {
      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: "waitingForApproval",
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "history") {
      const today = moment().format("YYYYMMDD"); // Convert today to YYYYMMDD format

      const pastServices = await Case.find({
        $expr: {
          $lt: [
            {
              $concat: [
                { $substr: ["$date", 6, 4] }, // Year (YYYY)
                { $substr: ["$date", 3, 2] }, // Month (MM)
                { $substr: ["$date", 0, 2] }, // Day (DD)
              ],
            },
            today, // Compare with today's date in YYYYMMDD format
          ],
        },
      });

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...pastServices].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      //  console.log("cases", cases);
    } else {
      // Fetch cases based on the given status
      // console.log("service", service);

      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: service,
      });

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/employee-services/:id/:service", async (req, res) => {
  try {
    const { service, id } = req.params;
    console.log(`from employee, service:- ${service}\n id:- ${id}`);

    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const today = new Date();

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    let cases;

    if (service === "all") {
      const StatusCases = await Case.find({
        date: formattedDate,
        receiver: user.name,
      });
      const userCases = await Case.find({
        receiver: user.name,
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases, ...userCases].map((item) => [
            item._id.toString(),
            item,
          ])
        ).values(),
      ];
      console.log("cases", cases);
    } else if (service === "Approval") {
      const StatusCases = await Case.find({
        // date: formattedDate,
        receiver: user.name,

        service_status: "waitingForApproval",
      });
      const userCases = await Case.find({
        service_status: "waitingForApproval",
        receiver: user.name,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases, ...userCases].map((item) => [
            item._id.toString(),
            item,
          ])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "history") {
      const today = moment().format("YYYYMMDD"); // Convert today to YYYYMMDD format

      const pastServices = await Case.find({
        $expr: {
          $lt: [
            {
              $concat: [
                { $substr: ["$date", 6, 4] }, // Year (YYYY)
                { $substr: ["$date", 3, 2] }, // Month (MM)
                { $substr: ["$date", 0, 2] }, // Day (DD)
              ],
            },
            today, // Compare with today's date in YYYYMMDD format
          ],
        },
      });

      const history = pastServices.filter(
        (service) => service.receiver === user.name
      );

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...history].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      //  console.log("cases", cases);
    } else {
      // Fetch cases based on the given status
      // console.log("service", service);

      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: service,
        receiver: user.name,
      });
      // const userCases = await Case.find({ status: service });
      // console.log("StatusCases", StatusCases);

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.get("/customer-services/:id/:service", async (req, res) => {
  try {
    const { service, id } = req.params;

    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const today = new Date();

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    let cases;

    if (service === "all") {
      const StatusCases = await Case.find({
        date: formattedDate,
        sender: user.name,
      });
      const userCases = await Case.find({
        sender: user.name,
        date: formattedDate,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases, ...userCases].map((item) => [
            item._id.toString(),
            item,
          ])
        ).values(),
      ];
    } else if (service === "Approval") {
      const StatusCases = await Case.find({
        // date: formattedDate,
        receiver: user.name,

        service_status: "waitingForApproval",
      });
      const userCases = await Case.find({
        service_status: "waitingForApproval",
        receiver: user.name,
      });
      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases, ...userCases].map((item) => [
            item._id.toString(),
            item,
          ])
        ).values(),
      ];
      // console.log("cases", cases);
    } else if (service === "history") {
      const today = moment().format("YYYYMMDD"); // Convert today to YYYYMMDD format

      const pastServices = await Case.find({
        $expr: {
          $lt: [
            {
              $concat: [
                { $substr: ["$date", 6, 4] }, // Year (YYYY)
                { $substr: ["$date", 3, 2] }, // Month (MM)
                { $substr: ["$date", 0, 2] }, // Day (DD)
              ],
            },
            today, // Compare with today's date in YYYYMMDD format
          ],
        },
      });

      const history = pastServices.filter(
        (service) => service.receiver === user.name
      );

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...history].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      //  console.log("cases", cases);
    } else {
      // Fetch cases based on the given status
      // console.log("service", service);

      const StatusCases = await Case.find({
        date: formattedDate,
        service_status: service,
        receiver: user.name,
      });
      // const userCases = await Case.find({ status: service });
      // console.log("StatusCases", StatusCases);

      // Merge and remove duplicates
      cases = [
        ...new Map(
          [...StatusCases].map((item) => [item._id.toString(), item])
        ).values(),
      ];
      // console.log("cases", cases);
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/service-history", async (req, res) => {
  try {
    const today = moment().format("YYYYMMDD"); // Convert today to YYYYMMDD format

    const pastServices = await Case.find({
      $expr: {
        $lt: [
          {
            $concat: [
              { $substr: ["$date", 6, 4] }, // Year (YYYY)
              { $substr: ["$date", 3, 2] }, // Month (MM)
              { $substr: ["$date", 0, 2] }, // Day (DD)
            ],
          },
          today, // Compare with today's date in YYYYMMDD format
        ],
      },
    });

    res.status(200).json(pastServices);
  } catch (error) {
    console.error("Error fetching service history:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/employee/todays-services", async (req, res) => {
  try {
    const { id } = req.query;
    const today = new Date();

    let user = await User.findById(id);

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;

    const todayCases = await Case.find({
      date: formattedDate,
      receiver: user?.name,
    });

    const cases = [
      ...new Map(
        [...todayCases].map((item) => [item._id.toString(), item])
      ).values(),
    ];

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
module.exports = router;
