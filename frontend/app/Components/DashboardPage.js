"use client";
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useAddUserMutation, useLogoutMutation } from "@/features/apiSlice";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

const DashboardPage = ({ role }) => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  let data = role === "admin" ? ["Dashboard", "Manage User"] : ["Dashboard"];
  let title = role === "admin" ? "Admin Pannel" : "User Pannel";

  // RTK Query API Mutation
  const [addUser, { isLoading }] = useAddUserMutation();
  const [logout] = useLogoutMutation();

  // React Hook Form
  const { handleSubmit, control, reset } = useForm();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const response = await addUser({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      setErrorMessage(error.data?.message || "Failed to add user.");
    }
  };

  // Open Dialog
  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    reset(); // Reset form fields
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          sx={{ width: 240, flexShrink: 0, height: "100%" }}
        >
          <Box
            sx={{ width: 240, p: 2, bgcolor: "primary.main", color: "white" }}
          >
            <Typography variant="h6">{title}</Typography>
          </Box>
          <List className="relative h-full">
            {data.map((text) => (
              <ListItem
                key={text}
                onClick={() => setSelectedOption(text)}
                className="cursor-pointer hover:bg-gray-200"
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <ListItem className="cursor-pointer absolute bottom-0 hover:bg-red-700 mt-[400px] bg-red-400 ">
              <ListItemText primary={"logout"} onClick={handleLogout} />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, width: "100%" }} className="relative">
          {/* Add User Button (Only for "Manage User") */}
          {selectedOption === "Manage User" && (
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
              className="absolute right-10"
            >
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Add User
              </Button>
            </Box>
          )}

          <Typography variant="h4">{selectedOption}</Typography>

          {/* MUI Dialog for Adding User */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                {errorMessage && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Typography>
                )}

                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Username is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Username"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Password is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          className="text-[20px]"
        >
          User added Successfully !
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardPage;
