"use client";

import {
  useGetCasesByIdQuery,
  useUpdateServiceStatusMutation,
} from "@/features/caseApiSlice";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
} from "@mui/material";
import {
  useGetEmployeeByDepartmentQuery,
  useGetEmployeesByIdsMutation,
} from "@/features/userApiSlice";
import {
  AssignmentInd,
  Close,
  LocationOn,
  Schedule,
  Description,
  Group,
  PersonAdd,
  Error,
  Visibility,
  Phone,
  Email,
  Work,
  Badge,
  PlayArrow,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import {
  useGetEmployeesByCaseIdQuery,
  useUpdateTeamServiceStatusMutation,
} from "@/features/teamServiceApiSlice";
import { CheckCircle, Pause } from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#f8fafc",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const EmployeeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start mb-4">
    <div className="mr-3 mt-1 text-gray-500">{icon}</div>
    <div>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className="font-medium text-gray-600"
      >
        {label}
      </Typography>
      <Typography variant="body1" className="font-normal text-gray-800">
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
        width: 48,
        height: 48,
        border: "2px solid #e2e8f0",
        backgroundColor: "#f1f5f9",
      }}
    />
  </Tooltip>
);

const CaseDetails = () => {
  const params = useParams();
  const id = params.caseId;
  const employeeId = params.employee;
  const router = useRouter();

  const {
    data: caseData,
    isLoading: caseLoading,
    refetch,
  } = useGetCasesByIdQuery(id);

  const { data: employeeData, isLoading: employeeLoading } =
    useGetEmployeeByDepartmentQuery(caseData?.service);

  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const { data: assignedEmployeesData } = useGetEmployeesByCaseIdQuery(id);
  const assignedEmployeeIds = assignedEmployeesData?.employees || [];

  const [getEmployeesByIds] = useGetEmployeesByIdsMutation();

  useEffect(() => {
    if (assignedEmployeeIds.length > 0) {
      getEmployeesByIds(assignedEmployeeIds).then((response) => {
        if (response.data) {
          setAssignedEmployees(response.data.employees);
        }
      });
    }
  }, [assignedEmployeeIds, getEmployeesByIds]);

  const [serviceStatus, setServiceStatus] = useState();

  useEffect(() => {
    if (!caseData || !employeeId) return;

    const activeDept = caseData.departmentProgress?.find(
      (dept) => dept.status !== "completed"
    );

    if (activeDept) {
      const isEmployeeInDept = activeDept.employees.some(
        (emp) => emp._id === employeeId || emp._id?._id === employeeId
      );

      if (isEmployeeInDept) {
        setServiceStatus(activeDept.status); // e.g., "accepted", "inProgress"
      } else {
        setServiceStatus("Not Assign"); // or null, or "notMyTurn"
      }
    } else {
      // All departments completed
      setServiceStatus("completed");
    }
  }, [caseData, employeeId]);

  const [updateSeviceStatus] = useUpdateTeamServiceStatusMutation();

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateSeviceStatus({
        id: id,
        service_status: newStatus,
        receiver_id: employeeId,
      }).unwrap();
      setServiceStatus(newStatus);
      refetch();
    } catch (error) {
      console.error("Failed to update case status:", error);
    }
  };

  const handleEmployeeDetails = (empId) => {
    router.push(
      `/employee/${employeeId}/team-services/${id}/employee-details/${empId}`
    );
  };

  if (caseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress size={60} thickness={4} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <Error color="error" style={{ fontSize: 60 }} />
        <Typography variant="h5" className="mt-4 text-center text-gray-700">
          Case not found or error loading case details
        </Typography>
        <Button
          variant="outlined"
          className="mt-4"
          onClick={() => window.location.reload()}
          sx={{
            color: "#4b5563",
            borderColor: "#cbd5e1",
            "&:hover": {
              borderColor: "#94a3b8",
              backgroundColor: "#f1f5f9",
            },
          }}
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
      className="w-full bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <StyledCard className="p-0">
          <CardHeader
            title={
              <div className="flex items-center">
                <AssignmentInd className="mr-2 text-gray-600" />
                <Typography
                  variant="h5"
                  component="h1"
                  className="font-bold text-gray-800"
                >
                  Case Details
                </Typography>
                <Chip
                  label={
                    caseData.service_status === "accepted"
                      ? "Open"
                      : caseData.service_status === "inProgress"
                      ? "Working....."
                      : caseData.service_status === "halted"
                      ? "Paused ⏹️..."
                      : caseData.service_status === "completed"
                      ? "Completed ✅"
                      : "...."
                  }
                  color={
                    caseData.status === "Resolved"
                      ? "success"
                      : caseData.status === "In Progress"
                      ? "warning"
                      : "default"
                  }
                  size="small"
                  className="ml-3"
                  sx={{
                    backgroundColor:
                      caseData.status === "Open" ? "#e2e8f0" : undefined,
                    color: caseData.status === "Open" ? "#334155" : undefined,
                  }}
                />
              </div>
            }
            subheader={
              <Typography variant="subtitle2" className="text-gray-500">
                Case ID: {id}
              </Typography>
            }
            action={
              <IconButton
                onClick={() => window.history.back()}
                sx={{
                  color: "#64748b",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                <Close />
              </IconButton>
            }
            sx={{
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            }}
          />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <DetailItem
                  icon={<Description className="text-gray-500" />}
                  label="Service"
                  value={caseData.service}
                />
                <DetailItem
                  icon={<Description className="text-gray-500" />}
                  label="Header"
                  value={caseData.header}
                />
                <DetailItem
                  icon={<Schedule className="text-gray-500" />}
                  label="Date & Time"
                  value={`${caseData.date} at ${caseData.time}`}
                />
              </div>

              <div className="space-y-4">
                <DetailItem
                  icon={<LocationOn className="text-gray-500" />}
                  label="Location"
                  value={caseData.location}
                />
                <DetailItem
                  icon={<Description className="text-gray-500" />}
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
            {/* Service Action Buttons */}
            <div className="w-full flex justify-evenly items-center bg-gray-100 p-5 rounded-2xl">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                sx={{
                  backgroundColor: "#82b8e8",
                  ":hover": { backgroundColor: "#4b9ce3" },
                }}
                onClick={() => handleStatusUpdate("inProgress")}
                disabled={
                  serviceStatus === "completed" ||
                  serviceStatus === "inProgress" ||
                  serviceStatus === "Not Assign"
                }
              >
                Start Service
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Pause />}
                sx={{
                  backgroundColor: "#de925f",
                  ":hover": { backgroundColor: "#e6813e" },
                }}
                onClick={() => handleStatusUpdate("halted")}
                disabled={
                  serviceStatus === "halted" ||
                  serviceStatus === "missed" ||
                  serviceStatus === "completed" ||
                  serviceStatus === "accepted" ||
                  serviceStatus === "Not Assign" ||
                  serviceStatus === "waitingToStart"
                }
              >
                Halt Service
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                sx={{
                  backgroundColor: "#7bd952",
                  ":hover": { backgroundColor: "#5cc72e" },
                }}
                onClick={() => handleStatusUpdate("completed")}
                disabled={
                  serviceStatus === "completed" ||
                  serviceStatus === "missed" ||
                  serviceStatus === "accepted" ||
                  serviceStatus === "Not Assign" ||
                  serviceStatus === "waitingToStart"
                }
              >
                Complete Service
              </Button>
            </div>
          </CardContent>
        </StyledCard>

        {/* Enhanced Team Members Section */}
        <StyledCard>
          <CardHeader
            title={
              <div className="flex items-center">
                <Group className="mr-2 text-gray-600" />
                <Typography variant="h5" className="font-bold text-gray-800">
                  Assigned Team Members
                </Typography>
                <Chip
                  label={`${assignedEmployees.length} members`}
                  size="small"
                  className="ml-3"
                  sx={{
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
              </div>
            }
            sx={{
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            }}
          />

          <CardContent>
            {assignedEmployees.length > 0 ? (
              <div className="mt-4">
                {/* Table View (Hidden on small screens) */}
                <Box sx={{ display: { xs: "none", md: "block" }, mt: 4 }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                            Employee
                          </TableCell>
                          <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                            Contact
                          </TableCell>
                          <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                            Department
                          </TableCell>
                          <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedEmployees.map((emp, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.05,
                            }}
                            hover={{ backgroundColor: "#f8fafc" }}
                            sx={{
                              "&:last-child td": { borderBottom: 0 },
                              cursor: "pointer",
                            }}
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <EmployeeAvatar employee={emp} />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {emp.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {emp.department || "Not specified"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <Email
                                    fontSize="small"
                                    className="text-gray-400 mr-1"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {emp.email}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Phone
                                    fontSize="small"
                                    className="text-gray-400 mr-1"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {emp.mobile_Number || "Not provided"}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Work
                                  fontSize="small"
                                  className="text-gray-400 mr-1"
                                />
                                <span className="text-sm text-gray-700">
                                  {emp.department || "Team Member"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={emp.status || "Active"}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    emp.status === "Active"
                                      ? "#dcfce7"
                                      : emp.status === "On Leave"
                                      ? "#fef9c3"
                                      : "#e2e8f0",
                                  color:
                                    emp.status === "Active"
                                      ? "#166534"
                                      : emp.status === "On Leave"
                                      ? "#854d0e"
                                      : "#334155",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View profile" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEmployeeDetails(emp._id)}
                                  sx={{
                                    color: "#64748b",
                                    "&:hover": {
                                      backgroundColor: "#e2e8f0",
                                    },
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mt-5 bg-gray-50">
                <Group className="mx-auto text-gray-400" fontSize="large" />
                <Typography variant="body1" className="mt-3 text-gray-500">
                  No team members assigned yet
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  className="mt-4"
                  sx={{
                    color: "#4b5563",
                    borderColor: "#cbd5e1",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  Assign Team Members
                </Button>
              </div>
            )}
          </CardContent>
        </StyledCard>
      </div>
    </motion.div>
  );
};

export default CaseDetails;
