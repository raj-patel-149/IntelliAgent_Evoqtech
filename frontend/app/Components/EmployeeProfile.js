"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Avatar,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Paper,
  IconButton,
} from "@mui/material";
import { useParams } from "next/navigation";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/features/userApiSlice";
import Image from "next/image";

const ProfileForm = () => {
  const params = useParams();
  const id = params?.employee || params?.userId;

  const { data, refetch } = useGetUserByIdQuery(id);
  const user = data?.user;

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [updateUser] = useUpdateUserMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile_Number: "",
      department: "",
      location: "",
    },
  });

  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        mobile_Number: user?.mobile_Number || "",
        department: user?.department || "",
        location: user?.location || "",
      });
      setProfileImage(user.profilePicture || "");
    }
  }, [user, reset]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("mobile_Number", data.mobile_Number);
      formData.append("department", data.department);
      formData.append("location", data.location);
      formData.append("status", user?.status ? "active" : "inactive");

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      await updateUser({
        id: user?._id,
        updatedData: formData,
      }).unwrap();

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      setSnackbarMessage(error.message || "Error updating profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        maxWidth: "1200px",
        mx: "auto",
        background: "linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "#2d3748",
            borderBottom: "2px solid #e2e8f0",
            pb: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          Edit Your Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 3 : 6,
            width: "100%",
          }}
        >
          {/* Profile Picture Card */}
          <Paper
            elevation={2}
            sx={{
              width: isMobile ? "100%" : 350,
              height: isMobile ? "auto" : "100%",
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "1px solid #e2e8f0",
            }}
          >
            <Box
              sx={{
                position: "relative",
                mb: 3,
                "&:hover .avatar-overlay": {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                src={profileImage}
                sx={{
                  width: isMobile ? 120 : 180,
                  height: isMobile ? 120 : 180,
                  border: "3px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Box
                className="avatar-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <Typography variant="body2" color="white">
                  Change Photo
                </Typography>
              </Box>
            </Box>

            <Box textAlign="center" sx={{ width: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                {user?.name || ""}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                  color: "#4a5568",
                  backgroundColor: "#edf2f7",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: "inline-block",
                }}
              >
                {user?.department || ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mt: 2,
                  color: "#718096",
                }}
              >
                {user?.email || ""}
              </Typography>
            </Box>

            <Button
              component="label"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#edf2f7",
                color: "#4a5568",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#e2e8f0",
                },
                transition: "all 0.3s ease",
              }}
            >
              Upload New Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Paper>

          {/* Form Card */}
          <Paper
            elevation={2}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: isMobile ? "100%" : "calc(100% - 386px)",
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid #e2e8f0",
              flexGrow: 1,
            }}
          >
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#4a5568",
                    mb: 1,
                  }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cbd5e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#a0aec0",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mobile Number"
                      variant="outlined"
                      error={!!errors.mobile_Number}
                      helperText={errors.mobile_Number?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cbd5e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#a0aec0",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#4a5568",
                    mt: 2,
                    mb: 1,
                  }}
                >
                  Professional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Department"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cbd5e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#a0aec0",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Location"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cbd5e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#a0aec0",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#4a5568",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#2d3748",
                  },
                  transition: "all 0.3s ease",
                  minWidth: "150px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontWeight: 500 }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileForm;
