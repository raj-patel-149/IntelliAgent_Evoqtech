"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Switch,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import TableSkeleton from "./skeloton/TableSkeleton";
import {
  useDeleteUserMutation,
  useEditUserMutation,
  useGetuserQuery,
  useUpdateUserMutation,
} from "@/features/userApiSlice";
import { useForm, Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useRouter } from "next/navigation";

const DisplayUsers = ({ trainerId, role }) => {
  // State Hooks
  const [userStatus, setUserStatus] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params?.manager;

  const handleAdminClick = (employeeId) => {
    router.push(`/manager/${id}/manageUser/employee-details/${employeeId}`);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetuserQuery({
    status: statusFilter,
    page: paginationModel.page,
    limit: paginationModel.pageSize,
    search: debouncedSearch.length >= 2 ? debouncedSearch : "",
  });
  const users = data?.users || [];
  const totalUsers = data?.pagination?.totalUsers || 0;
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Mutations
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useEditUserMutation();

  // Form Management
  const { handleSubmit, control, reset, setValue, watch } = useForm();

  // Watch status once at the top level
  const statusValue = watch("status");

  // Update userStatus when users change
  useEffect(() => {
    if (users && users.length > 0) {
      const statusMap = users.reduce(
        (acc, user) => ({ ...acc, [user._id]: user.status === "active" }),
        {}
      );
      setUserStatus(statusMap);
    }
  }, [users]);

  // Toggle Status
  const handleStatusToggle = (userId) => {
    setUserStatus((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Open Delete Confirmation Dialog
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  // Delete User
  const handleDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId).unwrap();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setOpenDialog(false);
  };

  // Open Edit Dialog & Populate Fields
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setValue("name", user.name.name);
    setValue("email", user.email);
    setValue("mobile_Number", user.mobile_Number);
    setValue("department", user.department);
    setValue("location", user.location);
    setValue("password", user.password);
    setValue("status", user.status === "active");
    setOpenEditDialog(true);
  };

  // Update User Submission
  const handleEditSubmit = async (data) => {
    try {
      await updateUser({
        id: selectedUser._id,
        name: data.name,
        mobile_Number: data.mobile_Number,
        department: data.department,
        location: data.location,
        status: data.status ? "active" : "inactive",
      }).unwrap();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle Loading State
  if (!users) return <TableSkeleton rows={5} />;

  // DataGrid Columns
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "profilePicture",
      headerName: "",
      width: 30,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-full ">
            <Avatar
              alt={params.value}
              src={params.value}
              style={{ width: "30px", height: "30px", marginRight: "10px" }}
            ></Avatar>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 120,
      headerAlign: "start",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "mobile_Number",
      headerName: "Mobile Number",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "department",
      headerName: "Department",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "service",
      headerName: "Service",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const userId = params.row._id;
        return (
          <div className="flex justify-start items-center">
            <Switch
              disabled
              checked={userStatus[userId] || false}
              onChange={() => handleStatusToggle(userId)}
              color="success"
            />
            {userStatus[userId] ? "Active🟢" : "Inactive 🔴"}
          </div>
        );
      },
    },

    {
      field: "user_status",
      headerName: "User Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center mt-4">
            <Typography
              sx={{
                color:
                  params.value === "Email sent"
                    ? "orange"
                    : params.value === "Email accepted"
                    ? "blue"
                    : params.value === "Password not set"
                    ? "red"
                    : "green",
                fontSize: "14px",
              }}
            >
              {params.value}
            </Typography>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleOpenEditDialog(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={() => handleOpenDialog(params.row._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // DataGrid Rows
  const rows = Array.isArray(users)
    ? users.map((user, index) => ({
        id: index + 1,
        _id: user._id,
        profilePicture: user.profilePicture,
        name: user.name,
        email: user.email,
        mobile_Number: user.mobile_Number,
        department: user.department,
        service: user.service,
        location: user.location,
        score: user.score,
        status: user.status || "inactive",
        user_status: user.user_Status || "Email sent",
      }))
    : [];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "0 60px",
          // height: "100%",
          mx: "auto",
          marginTop: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <div className="flex justify-evenly items-center">
            <Box className="flex justify-center items-center w-full relative">
              <TextField
                id="outlined-basic"
                label="Search here...."
                variant="outlined"
                sx={{ width: "100%" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon className="absolute right-0 mr-4" />
            </Box>
          </div>
        </Paper>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Paper
            sx={{
              height: 383,
              width: "100%",
              overflow: "hidden",
              marginTop: "20px",
              "& .super-app-theme--header": {
                backgroundColor: "rgba(20, 20, 20, 0.23)",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              rowCount={totalUsers}
              paginationMode="server"
              paginationModel={paginationModel}
              onRowDoubleClick={(params) => handleAdminClick(params.row._id)}
              onPaginationModelChange={(newModel) =>
                setPaginationModel(newModel)
              }
              loading={isLoading}
              autoPageSize={false}
              sx={{
                "& .MuiDataGrid-virtualScroller": {
                  overflow: "auto",
                  maxHeight: 400,
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
              }}
            />
          </Paper>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "OK"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Controller
                name="mobile_Number"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="mobile_Number"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Department"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Controller
                name="score"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Score"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label={statusValue ? "Active 🟢" : "Inactive 🔴"}
                  />
                )}
              />
              <DialogActions>
                <Button
                  onClick={() => setOpenEditDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default DisplayUsers;
