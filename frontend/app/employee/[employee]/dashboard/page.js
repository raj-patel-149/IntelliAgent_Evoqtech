"use client";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Avatar,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useGetCasesQuery,
  useUpdateCaseMutation,
} from "@/features/caseApiSlice";
import {
  useGetSkillsByDepartmentQuery,
  useGetUserByIdQuery,
  useUpdateUserSkillsMutation,
} from "@/features/userApiSlice";
import {
  useAddSkillRequestMutation,
  useFetchApprovalSkillsByIdQuery,
  useFetchApprovalSkillsQuery,
} from "@/features/skillApiSlice";

import { useRejectServiceMutation } from "@/features/employeeApiSlice";

export default function Home() {
  const params = useParams();
  const id = params?.employee;
  const { data } = useGetUserByIdQuery(id);
  const user = data?.user;
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const {
    data: cases,
    isLoading,
    isError,
    refetch: fetchCase,
  } = useGetCasesQuery(id);
  console.log(cases);
  const [updateCaseStatus] = useUpdateCaseMutation();
  const [addSkillRequest] = useAddSkillRequestMutation();
  const { data: allSkillsData, refetch } = useFetchApprovalSkillsByIdQuery(id);
  const approvalSkills = allSkillsData?.approvals;
  const filteredApprovalSkills = approvalSkills?.filter(
    (skill) => skill.status === "pending" || skill.status === "rejected"
  );

  const [rows, setRows] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rejectService] = useRejectServiceMutation();

  const skills = user?.service || [];
  const [localSkills, setLocalSkills] = useState([]);

  const selectedDepartment = user?.department;
  const { data: allSkills, refetch: refetchSkills } =
    useGetSkillsByDepartmentQuery(selectedDepartment, {
      skip: !selectedDepartment,
    });

  useEffect(() => {
    if (user?.service) {
      setLocalSkills(user.service); // Sync with API response
    }
  }, [user]);

  // Load profile data from local storage when the component mounts
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
    setProfile(savedProfile);
  }, []);

  useEffect(() => {
    if (cases) {
      setRows(
        cases.map((c) => ({
          id: c._id,
          sender: c.sender,
          header: c.header,
          service: c.service,
          date: c.date,
          time: c.time,
          location: c.location,
          description: c.description,
          status: c.case_status,
        }))
      );
    }
  }, [cases]);

  // Add mutation to reject service

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const update = {
        id,
        case_status: newStatus,
        receiver: user?.name,
        receiver_id: user?._id,
      }
      console.log("Updating Case Status:", update);
      // Debug API Call
      const response = await updateCaseStatus(update).unwrap();

      if (!response) {
        throw new Error("Backend did not return a response.");
      }

      //  Reduce score if rejected
      if (newStatus === "rejected") {
        const rejectResponse = await rejectService({
          employeeId: user?._id,
        }).unwrap();
      }
      fetchCase();
    } catch (error) {
      console.error(" Failed to update case status:", error);

      if (error?.data) {
        console.error(" Error Details (Backend Response):", error.data);
      } else if (error?.message) {
        console.error(" Error Message:", error.message);
      } else {
        console.error(" Unknown Error:", error);
      }
    }
  };

  const columns = [
    {
      field: "sender",
      headerName: "Sender",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "header",
      headerName: "Header",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "service",
      headerName: "Service",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor:
                params.row.status === "accepted" ? "#3ec941" : "gray",
              "&:hover": {
                backgroundColor:
                  params.row.status === "accepted" ? "#27c42a" : "darkgray",
              },
            }}
            onClick={() => handleStatusUpdate(params.row.id, "accepted")}
          >
            Accept
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor:
                params.row.status === "rejected" ? "#d94e55" : "gray",
              "&:hover": {
                backgroundColor:
                  params.row.status === "rejected" ? "#c0392b" : "darkgray",
              },
            }}
            onClick={() => handleStatusUpdate(params.row.id, "rejected")}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  const availableSkills = allSkills?.filter(
    (skill) => !localSkills.includes(skill.skill_Name)
  );

  const handleAddSkillClick = (event) => {
    setAnchorEl(event.currentTarget);
    refetchSkills();
  };

  const handleSkillSelect = async (skill) => {
    if (!user?._id) {
      console.error("User ID is missing");
      return;
    }

    try {
      await addSkillRequest({
        skill_Name: skill,
        employee: user._id,
      }).unwrap();

      // Refetch approval skills to sync with the backend
      refetch();
    } catch (error) {
      console.error("Failed to submit skill request:", error);
    }

    setAnchorEl(null);
  };

  const getSkillStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-black";
      case "accepted":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Box
        className="grid grid-rows-10"
        sx={{ flex: 1, p: 2, bgcolor: "#F3F4F6", paddingBottom: "5px" }}
      >
        <Box className="row-span-1">
          <Typography variant="h6" fontWeight="bold" color="#333">
            Welcome to the Employee Dashboard!
          </Typography>
        </Box>
        {/* Skills Section */}

        <Box className="row-span-2">
          <Paper sx={{ marginTop: "20px", padding: "10px" }}>
            <Box className="w-full flex justify-between items-center px-3">
              <Typography variant="h6" fontWeight="bold">
                Services by You
              </Typography>
              <IconButton color="primary" onClick={handleAddSkillClick}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box className="w-full flex gap-2 flex-wrap px-3">
              {localSkills.map((skill, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800">
                    {skill}
                  </span>
                </Box>
              ))}
            </Box>
            <Box className="w-full flex gap-2 flex-wrap px-3 mt-5">
              <p className="">Service Requests : </p>
              {filteredApprovalSkills?.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${getSkillStyle(
                    skill.status
                  )}`}
                >
                  {skill.skill_Name}
                </span>
              ))}
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {availableSkills?.length ? (
                availableSkills.map((skill, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleSkillSelect(skill.skill_Name)}
                  >
                    {skill.skill_Name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Skills Available</MenuItem>
              )}
            </Menu>
          </Paper>
        </Box>
        <Box className="row-span-6">
          <Paper
            sx={{
              height: "auto",
              width: "100%",
              overflow: "hidden",
              marginTop: "20px",
            }}
          >
            {/* Data Grid Table */}
            <Box className="flex justify-start items-start p-3 ">
              <Typography variant="h6" fontWeight="bold" className="mb-8">
                Tasks
              </Typography>
            </Box>

            <Box>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-virtualScroller": {
                    overflow: "auto",
                    minHeight: 250,
                    maxHeight: 290,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-footerContainer": {
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "#fff",
                    zIndex: 1,
                  },
                  "& .super-app-theme--header": {
                    backgroundColor: "rgba(20, 20, 20, 0.23)",
                  },
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>

    // </Box >
  );
}
