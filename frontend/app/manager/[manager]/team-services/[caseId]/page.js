"use client";

import {
  useGetCasesByIdQuery,
  useUpdateCaseMutation,
} from "@/features/caseApiSlice";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  Badge,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  useGetEmployeeByDepartmentQuery,
  useGetEmployeesByIdsMutation,
  useGetEmployeesByMoreDepartmentsQuery,
  useGetUserByIdQuery,
} from "@/features/userApiSlice";
import {
  AssignmentInd,
  Close,
  LocationOn,
  Schedule,
  Description,
  Group,
  PersonAdd,
  CheckCircle,
  Error,
  Visibility,
  PersonRemove,
  ArrowBack,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/system";
import {
  useAssignEmployeesToCaseMutation,
  useGetEmployeesByCaseIdQuery,
  useRemoveEmployeeMutation,
} from "@/features/teamServiceApiSlice";
import { Box } from "lucide-react";
import { useGetTeamServiceTemplateByIdQuery } from "@/features/teamTemplateApiSlice";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  overflow: "auto",
  backgroundColor: "#f8fafc",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
}));

const GradientCardHeader = styled(CardHeader)(({ theme }) => ({
  background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
  color: "white",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  padding: "16px 24px",
}));

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start mb-6">
    <div className="mr-3 mt-1 text-gray-600">{icon}</div>
    <div>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className="font-medium text-gray-500 uppercase tracking-wider"
      >
        {label}
      </Typography>
      <Typography variant="body1" className="font-medium text-gray-800 mt-1">
        {value || "Not specified"}
      </Typography>
    </div>
  </div>
);

const EmployeeAvatar = ({ employee }) => (
  <Tooltip title={`${employee.name} (${employee.email})`} arrow>
    <Avatar
      src={employee.profilePicture || "/default-avatar.png"}
      sx={{
        width: 40,
        height: 40,
        marginRight: -1,
        border: "2px solid white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    />
  </Tooltip>
);

const StatusPill = ({ status }) => {
  let color = "gray";
  let bgColor = "bg-gray-100";

  switch (status) {
    case "Resolved":
      color = "green";
      bgColor = "bg-green-100";
      break;
    case "In Progress":
      color = "orange";
      bgColor = "bg-orange-100";
      break;
    case "Open":
      color = "blue";
      bgColor = "bg-blue-100";
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-${color}-800 ${bgColor}`}
    >
      {status}
    </span>
  );
};

const CaseDetails = () => {
  const params = useParams();
  const id = params?.caseId;
  const manager = params?.manager;
  const router = useRouter();
  const {
    data: caseData,
    isLoading: caseLoading,
    refetch,
  } = useGetCasesByIdQuery(id);

  const { data: teamServiceTemplate } = useGetTeamServiceTemplateByIdQuery(
    caseData?.teamServiceTemplateId
  );

  const departmentsList = teamServiceTemplate?.data?.requirements?.map(
    (req) => req.department
  );
  const lowercaseDepartments = departmentsList?.map((dep) => dep.toLowerCase());

  const {
    data: employeeData,
    isLoading: employeeLoading,
    error,
  } = useGetEmployeesByMoreDepartmentsQuery(lowercaseDepartments);

  console.log("/*****************", teamServiceTemplate);

  const [assignEmployeesToCase] = useAssignEmployeesToCaseMutation();

  const employees = employeeData?.agents || [];
  const [open, setOpen] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [currentDepartmentIndex, setCurrentDepartmentIndex] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const currentRequirement =
    teamServiceTemplate?.data?.requirements?.[currentDepartmentIndex];

  const {
    data: assignedEmployeesData,
    isLoading: assignedLoading,
    refetch: employeeDataRefetch,
  } = useGetEmployeesByCaseIdQuery(id);

  const assignedEmployeeIds = assignedEmployeesData?.employees || [];

  // Initialize mutation
  const [
    getEmployeesByIds,
    { data: employeesData, isLoading: employeesLoading },
  ] = useGetEmployeesByIdsMutation();

  const [removeEmployee] = useRemoveEmployeeMutation();

  // Fetch employee details when assignedEmployeeIds change
  useEffect(() => {
    if (assignedEmployeeIds.length > 0) {
      getEmployeesByIds(assignedEmployeeIds).then((response) => {
        if (response.data) {
          setAssignedEmployees(response.data.employees);
        }
      });
    }
  }, [assignedEmployeeIds, getEmployeesByIds]);

  const handleAssignClick = () => {
    setSelectedEmployees(assignedEmployees); // Initialize with already assigned employees
    setOpen(true);
  };
  const handleCheckboxChange = (employee) => {
    setSelectedEmployees((prev) => {
      const isAlreadySelected = prev.some((e) => e._id === employee._id);

      if (isAlreadySelected) {
        return prev.filter((e) => e._id !== employee._id);
      } else {
        const currentDepartmentCount = prev.filter(
          (e) =>
            e.department.toLowerCase() === employee.department.toLowerCase()
        ).length;

        const departmentRequirement =
          teamServiceTemplate?.data?.requirements?.find(
            (req) =>
              req.department.toLowerCase() === employee.department.toLowerCase()
          );

        if (currentDepartmentCount < (departmentRequirement?.count || 0)) {
          return [...prev, employee];
        }

        return prev;
      }
    });
  };

  const handleNextDepartment = () => {
    if (
      currentDepartmentIndex <
      teamServiceTemplate?.data?.requirements?.length - 1
    ) {
      setCurrentDepartmentIndex(currentDepartmentIndex + 1);
    }
  };

  const handlePreviousDepartment = () => {
    if (currentDepartmentIndex > 0) {
      setCurrentDepartmentIndex(currentDepartmentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await assignEmployeesToCase({
        caseId: id,
        employees: selectedEmployees.map((emp) => emp._id),
        employees_name: selectedEmployees.map((emp) => emp.name),
      }).unwrap();

      employeeDataRefetch();

      setAssignedEmployees(selectedEmployees);
      setOpen(false);
      setCurrentDepartmentIndex(0);

      // Show success notification
      setSnackbarMessage("Team members assigned successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error assigning employees:", error);

      // Show error notification
      setSnackbarMessage("Failed to assign team members. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEmployeeDetails = (empId) => {
    router.push(
      `/manager/${manager}/team-services/${id}/employee-details/${empId}`
    );
  };

  const handleRemoveEmployee = async (empId, name) => {
    try {
      const response = await removeEmployee({
        caseId: id,
        employeeId: empId,
      }).unwrap();
      employeeDataRefetch();

      // Show success notification
      setSnackbarMessage(
        `${name || "Employee"} has been removed from the team.`
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);

      // Optional: refresh data or show success message
    } catch (err) {
      console.error("Error removing employee:", err);

      // // Show error notification
      // setSnackbarMessage("Failed to remove employee. Please try again.");
      // setSnackbarSeverity("error");
      // setSnackbarOpen(true);
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      // electrical: "#2685bf",
      // technical: "#3ce674",
      // cleaning: "#d18d2e",
      // inspection: "#4260db",
      // plumbing: "#bdd42a",
      default: "#64748b",
    };
    return colors[department.toLowerCase()] || colors.default;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (caseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress size={60} thickness={4} className="text-gray-400" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <Error className="text-red-500" style={{ fontSize: 60 }} />
        <Typography variant="h5" className="mt-4 text-center text-gray-700">
          Case not found or error loading case details
        </Typography>
        <Button
          variant="outlined"
          className="mt-4 text-gray-700 border-gray-400"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center">
          <IconButton
            onClick={() => router.back()}
            className="mr-2 text-gray-600 hover:bg-gray-200"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" className="font-bold text-gray-800">
            Team Service Case Management
          </Typography>
        </div>

        <StyledCard>
          <GradientCardHeader
            title={
              <div className="flex items-center">
                <AssignmentInd className="mr-2" />
                <Typography variant="h6" component="h1" className="font-bold">
                  Case Details
                </Typography>
                <div className="ml-4">
                  <StatusPill status={caseData.status || "Open"} />
                </div>
              </div>
            }
            subheader={
              <Typography className="text-gray-200">
                Case ID: {id} | Created: {caseData.date}
              </Typography>
            }
            action={
              <IconButton onClick={() => window.history.back()}>
                <Close className="text-white" />
              </IconButton>
            }
          />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <DetailItem
                  icon={<Description className="text-gray-600" />}
                  label="Service"
                  value={caseData.service}
                />
                <DetailItem
                  icon={<Description className="text-gray-600" />}
                  label="Header"
                  value={caseData.header}
                />
                <DetailItem
                  icon={<Schedule className="text-gray-600" />}
                  label="Date & Time"
                  value={`${caseData.date} at ${caseData.time}`}
                />
              </div>
              <div>
                <DetailItem
                  icon={<LocationOn className="text-gray-600" />}
                  label="Location"
                  value={caseData.location}
                />
                <DetailItem
                  icon={<Description className="text-gray-600" />}
                  label="Description"
                  value={
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <Typography
                        variant="body1"
                        className="whitespace-pre-line text-gray-700"
                      >
                        {caseData.description}
                      </Typography>
                    </div>
                  }
                />
              </div>
            </div>

            <Divider className="my-6" />

            <Typography
              variant="h6"
              className="font-semibold p-4 text-gray-700 flex items-center"
            >
              <Group className="mr-2 text-gray-600" />
              Assigned Team Members
            </Typography>

            {assignedEmployees.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-semibold text-gray-700">
                          Employee
                        </TableCell>
                        <TableCell className="font-semibold text-gray-700">
                          Department
                        </TableCell>
                        <TableCell className="font-semibold text-gray-700">
                          Location
                        </TableCell>
                        <TableCell className="font-semibold text-gray-700">
                          Status
                        </TableCell>
                        <TableCell className="font-semibold text-gray-700 ">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamServiceTemplate?.data?.requirements?.map(
                        (departmentReq) =>
                          assignedEmployees
                            .filter(
                              (emp) =>
                                emp.department.toLowerCase() ===
                                departmentReq.department.toLowerCase()
                            )
                            .map((emp) => (
                              <TableRow
                                key={emp._id}
                                hover
                                className="border-b border-gray-100"
                              >
                                <TableCell>
                                  <div className="flex items-center">
                                    <EmployeeAvatar employee={emp} />
                                    <div className="ml-3">
                                      <Typography className="font-medium text-gray-800">
                                        {emp.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        className="text-gray-500"
                                      >
                                        {emp.email}
                                      </Typography>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={emp.department.toLowerCase()}
                                    size="small"
                                    className="capitalize"
                                    sx={{
                                      backgroundColor: getDepartmentColor(
                                        emp.department.toLowerCase()
                                      ),
                                      color: "white",
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <LocationOn
                                      fontSize="small"
                                      className="text-gray-400 mr-1"
                                    />
                                    <span className="text-gray-700">
                                      {emp.location || "Unknown"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={emp.status || "Active"}
                                    size="small"
                                    variant="outlined"
                                    color={
                                      emp.status === "Active"
                                        ? "success"
                                        : emp.status === "On Leave"
                                        ? "warning"
                                        : "default"
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-start  w-full items-center">
                                    <Tooltip title="View profile" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleEmployeeDetails(emp._id)
                                        }
                                        className="text-gray-500 hover:text-blue-600 mr-2"
                                      >
                                        <Visibility fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove from team" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleRemoveEmployee(
                                            emp._id,
                                            emp.name
                                          )
                                        }
                                        className="text-gray-500 hover:text-red-600"
                                      >
                                        <PersonRemove fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <Typography variant="body2" className="text-gray-600">
                    Showing {assignedEmployees.length} of{" "}
                    {assignedEmployees.length} members
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAdd />}
                    onClick={handleAssignClick}
                    className="border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    Add Team Member
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Group className="mx-auto text-gray-400" fontSize="large" />
                <Typography variant="body1" className="mt-4 text-gray-500">
                  No team members assigned yet
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className="mt-4 bg-gray-600 hover:bg-gray-700"
                  startIcon={<PersonAdd />}
                  onClick={handleAssignClick}
                >
                  Assign Team Members
                </Button>
              </div>
            )}
          </CardContent>
        </StyledCard>
      </div>

      {/* Assign Employee Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "auto",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="font-bold">
                  Build Your Team
                </Typography>
                <Typography variant="subtitle2" className="text-gray-300 mt-1">
                  Step {currentDepartmentIndex + 1} of{" "}
                  {teamServiceTemplate?.data?.requirements?.length || 0}
                </Typography>
              </div>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(false)}
              >
                <Close />
              </IconButton>
            </div>
            {currentRequirement && (
              <div className="mt-3">
                <div className="flex justify-between mb-2">
                  {teamServiceTemplate?.data?.requirements?.map(
                    (req, index) => (
                      <div
                        key={index}
                        className={`flex-1 text-center ${
                          index <
                          teamServiceTemplate.data.requirements.length - 1
                            ? "mr-2"
                            : ""
                        }`}
                      >
                        <div
                          className={`h-1.5 rounded-full ${
                            index <= currentDepartmentIndex
                              ? "bg-blue-400"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <Typography
                          variant="caption"
                          className={`block mt-2 ${
                            index === currentDepartmentIndex
                              ? "font-bold text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {req.department.toUpperCase()}
                        </Typography>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </DialogTitle>

          <DialogContent className="p-6 bg-gray-50">
            {employeeLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <Skeleton
                      variant="circular"
                      width={48}
                      height={48}
                      className="bg-gray-200"
                    />
                    <div className="ml-3 flex-1">
                      <Skeleton
                        variant="text"
                        width="60%"
                        className="bg-gray-200"
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        className="bg-gray-200"
                      />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width={24}
                      height={24}
                      className="bg-gray-200"
                    />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg shadow-sm">
                <Error className="text-red-500" style={{ fontSize: 48 }} />
                <Typography
                  variant="h6"
                  className="mt-3 text-center text-gray-700"
                >
                  Failed to load employees
                </Typography>
                <Typography
                  variant="body2"
                  className="mt-2 text-center text-gray-500"
                >
                  Please try again later
                </Typography>
              </div>
            ) : (
              <>
                <div className="mb-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Typography
                    variant="subtitle1"
                    className="font-medium text-gray-700 mb-2"
                  >
                    Available Team Members ≫
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mb-3">
                    Select {currentRequirement?.count}{" "}
                    {currentRequirement?.department.toLowerCase()} member
                    {currentRequirement?.count > 1 ? "s" : ""} to assign
                  </Typography>

                  <div className="border border-gray-200 rounded-lg h-70 mt-2 overflow-auto">
                    <List className="divide-y divide-gray-200">
                      {employees
                        .filter(
                          (emp) =>
                            emp.department.toLowerCase() ===
                            currentRequirement?.department.toLowerCase()
                        )
                        .map((employee) => (
                          <ListItem
                            key={employee._id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                            secondaryAction={
                              <Checkbox
                                checked={
                                  selectedEmployees.some(
                                    (e) => e._id === employee._id
                                  ) ||
                                  assignedEmployees.some(
                                    (e) => e._id === employee._id
                                  )
                                }
                                onChange={() => handleCheckboxChange(employee)}
                                color="primary"
                                disabled={
                                  selectedEmployees.filter(
                                    (e) =>
                                      e.department.toLowerCase() ===
                                      currentRequirement?.department.toLowerCase()
                                  ).length >= currentRequirement?.count &&
                                  !selectedEmployees.some(
                                    (e) => e._id === employee._id
                                  ) &&
                                  !assignedEmployees.some(
                                    (e) => e._id === employee._id
                                  )
                                }
                                icon={<CheckCircle className="text-gray-300" />}
                                checkedIcon={<CheckCircle color="primary" />}
                              />
                            }
                          >
                            <ListItemAvatar>
                              <Badge
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                badgeContent={
                                  assignedEmployees.some(
                                    (e) => e._id === employee._id
                                  ) ? (
                                    <small className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      ✓
                                    </small>
                                  ) : null
                                }
                              >
                                <Avatar
                                  src={
                                    employee.profilePicture ||
                                    "/default-avatar.png"
                                  }
                                  sx={{ width: 48, height: 48 }}
                                />
                              </Badge>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <div className="flex items-center">
                                  <Typography
                                    variant="subtitle1"
                                    className="font-medium text-gray-800"
                                  >
                                    {employee.name}
                                  </Typography>
                                  {employee.score && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      Score: {employee.score}
                                    </span>
                                  )}
                                </div>
                              }
                              secondary={
                                <>
                                  <Typography
                                    variant="body2"
                                    className="text-gray-600"
                                  >
                                    {employee.email}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-gray-500"
                                  >
                                    {employee.service?.join(", ")}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                    </List>

                    {employees.filter(
                      (emp) =>
                        emp.department.toLowerCase() ===
                        currentRequirement?.department.toLowerCase()
                    ).length === 0 && (
                      <div className="p-6 text-center text-gray-500 bg-gray-50">
                        <Group
                          className="mx-auto text-gray-400"
                          fontSize="large"
                        />
                        <Typography variant="body1" className="mt-2">
                          No {currentRequirement?.department.toLowerCase()} team
                          members available
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>

          <DialogActions className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-between">
            <div>
              {currentDepartmentIndex > 0 && (
                <Button
                  onClick={handlePreviousDepartment}
                  variant="outlined"
                  className="mr-2 text-gray-700 border-gray-400 hover:border-gray-500"
                >
                  Back
                </Button>
              )}
            </div>

            <div>
              {currentDepartmentIndex <
              teamServiceTemplate?.data?.requirements?.length - 1 ? (
                <Button
                  onClick={handleNextDepartment}
                  variant="contained"
                  className="bg-gray-700 hover:bg-gray-800"
                  disabled={
                    selectedEmployees.filter(
                      (e) =>
                        e.department.toLowerCase() ===
                        currentRequirement?.department.toLowerCase()
                    ).length < currentRequirement?.count
                  }
                >
                  Next:{" "}
                  {teamServiceTemplate?.data?.requirements?.[
                    currentDepartmentIndex + 1
                  ]?.department.toLowerCase()}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={
                    selectedEmployees.filter(
                      (e) =>
                        e.department.toLowerCase() ===
                        currentRequirement?.department.toLowerCase()
                    ).length < currentRequirement?.count
                  }
                  startIcon={<CheckCircle />}
                >
                  Complete Team ({selectedEmployees.length})
                </Button>
              )}
            </div>
          </DialogActions>
        </motion.div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default CaseDetails;
