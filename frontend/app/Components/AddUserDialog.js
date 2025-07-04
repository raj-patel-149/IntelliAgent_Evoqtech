"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Autocomplete,
  CircularProgress,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  useAddUserMutation,
  useGetDepartmentsQuery,
  useGetSkillsByDepartmentQuery,
} from "@/features/userApiSlice";
import {
  Close,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  MedicalServices,
  School,
  CameraAlt,
  Badge,
  LocalHospital,
  CheckCircle,
} from "@mui/icons-material";
import { Grid } from "@mui/material";

const AddUserDialog = ({ open, onClose, onSubmit }) => {
  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile_Number: "",
      location: "",
      department: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Hospital-themed color palette
  const colors = {
    primary: "#1976d2",
    secondary: "#757575",
    background: "#f5f7fa",
    white: "#ffffff",
    success: "#4caf50",
    error: "#f44336",
  };

  const {
    data: departmentsData,
    error: deptError,
    isLoading: isDeptLoading,
  } = useGetDepartmentsQuery();

  const selectedDepartment = watch("department");

  const {
    data: skillsData,
    isLoading: isSkillsLoading,
    error: skillsError,
  } = useGetSkillsByDepartmentQuery(selectedDepartment, {
    skip: !selectedDepartment,
  });

  useEffect(() => {
    if (skillsData) {
      setServiceList(skillsData.map((skill) => skill.skill_Name));
    } else {
      setServiceList([]);
    }
  }, [skillsData]);

  const handleAddService = () => {
    if (serviceInput.trim() !== "") {
      setServiceList([...serviceList, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleRemoveService = (index) => {
    setServiceList(serviceList.filter((_, i) => i !== index));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (formData) => {
    const formDataWithFile = new FormData();
    formDataWithFile.append("name", formData.name);
    formDataWithFile.append("email", formData.email);
    formDataWithFile.append("mobile_Number", formData.mobile_Number);
    formDataWithFile.append("location", formData.location);
    formDataWithFile.append("department", formData.department);

    serviceList.forEach((service, index) =>
      formDataWithFile.append(`service[${index}]`, service)
    );

    if (selectedFile) {
      formDataWithFile.append("profile", selectedFile);
    }

    try {
      await onSubmit(formDataWithFile);
      reset();
      setServiceList([]);
      setSelectedFile(null);
      setPreview(null);
      setErrorMessage("");
      setActiveStep(0);
      onClose();
    } catch (error) {
      console.error("Error adding staff:", error);
      setErrorMessage(error?.data?.message || "Failed to add staff member.");
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ["Personal Information", "Professional Details", "Review"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary,
          color: colors.white,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <LocalHospital sx={{ mr: 1.5 }} />
          <Typography variant="h6">Add New Employee</Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{ color: colors.white }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Stepper
        activeStep={activeStep}
        sx={{ px: 3, pt: 2, backgroundColor: colors.background }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent sx={{ py: 3, backgroundColor: colors.background }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Avatar
                    src={preview}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: `3px solid ${colors.primary}`,
                    }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CameraAlt />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Full name is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="mobile_Number"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Mobile number is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="location"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Location is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Location/Ward"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        ),
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="department"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={departmentsData?.departments || []}
                      getOptionLabel={(option) => option}
                      loading={isDeptLoading}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Medical Department"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!deptError}
                          helperText={
                            deptError ? "Failed to fetch departments" : ""
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Work color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <>
                                {isDeptLoading ? (
                                  <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Specializations/Certifications:
                  </Typography>
                  {isSkillsLoading ? (
                    <CircularProgress size={24} />
                  ) : skillsError ? (
                    <Typography color="error">
                      Failed to fetch specializations
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {serviceList.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleRemoveService(index)}
                          color="primary"
                          size="small"
                          icon={<MedicalServices fontSize="small" />}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${colors.primary}`,
                backgroundColor: colors.white,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.primary }}
              >
                Employee Details Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    Personal Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Person color="action" sx={{ mr: 1 }} />
                    <Typography>{watch("name") || "Not provided"}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Email color="action" sx={{ mr: 1 }} />
                    <Typography>{watch("email") || "Not provided"}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Phone color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {watch("mobile_Number") || "Not provided"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    Professional Details
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Work color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {watch("department") || "Not provided"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {watch("location") || "Not provided"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <MedicalServices color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {serviceList.length > 0
                        ? serviceList.join(", ")
                        : "No specializations"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: colors.background,
          borderTop: `1px solid #e0e0e0`,
        }}
      >
        <Button
          onClick={activeStep === 0 ? onClose : handleBack}
          sx={{
            color: colors.secondary,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{
              backgroundColor: colors.primary,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(handleFormSubmit)}
            startIcon={<CheckCircle />}
            sx={{
              backgroundColor: colors.success,
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Confirm & Add Employee
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
