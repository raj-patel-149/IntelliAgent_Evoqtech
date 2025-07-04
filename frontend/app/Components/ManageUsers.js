"use client";
import {
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useAddUserMutation,
  useGetDepartmentsQuery,
  useGetSkillsByDepartmentQuery,
} from "@/features/userApiSlice";
import DisplayUsers from "./DisplayUsers";
import AddUserDialog from "./AddUserDialog";
import {
  MedicalServices,
  LocalHospital,
  BeachAccess,
  PersonAdd,
  Add,
  Check,
  List as ListIcon,
  Close,
  CheckCircle,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import {
  useAddDepartmentMutation,
  useAddNewSkillMutation,
} from "@/features/skillApiSlice";

import Department from "./Department";

const ManageUsers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [serviceDescription, setServiceDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allData, setAllData] = useState([]);

  const [addDepartment] = useAddDepartmentMutation();
  const [addNewSkill] = useAddNewSkillMutation();
  const [addUser] = useAddUserMutation();

  // Modern color palette
  const colors = {
    primary: "#3f51b5",
    secondary: "#6c757d",
    success: "#69cf84",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",
    background: "#f8f9fa",
    card: "#ffffff",
    textPrimary: "#212529",
    textSecondary: "#495057",
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedDepartments = localStorage.getItem("departments");
    const savedServices = localStorage.getItem("services");
    const savedAllData = localStorage.getItem("allData");

    if (savedDepartments) setDepartments(JSON.parse(savedDepartments));
    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedAllData) setAllData(JSON.parse(savedAllData));
  }, []);

  const handleAddUser = async (formData) => {
    try {
      const response = await addUser(formData).unwrap();
      console.log("API Response:", response);
      setSnackbarOpen(true);
      setOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      return error?.data?.message || error?.error || "Failed to add user.";
    }
  };

  const handleAddDepartment = async () => {
    const newDepartment = {
      name: departmentName,
      description: departmentDescription,
    };

    try {
      const res = await addDepartment(newDepartment).unwrap();
      const updatedDepartments = [...departments, res];
      setDepartments(updatedDepartments);
      localStorage.setItem("departments", JSON.stringify(updatedDepartments));

      setDepartmentDescription("");
      setOpenDeptDialog(false);
      setOpenServiceDialog(true);
    } catch (err) {
      console.error("Failed to add department:", err);
    }
  };

  const handleAddService = async () => {
    const basePriceNumber = Number(basePrice);
    console.log(typeof basePriceNumber);
    const newService = {
      skill_Name: serviceName,
      department: departmentName,
      basePrice: basePriceNumber,
      description: serviceDescription,
      duration,
    };

    try {
      const res = await addNewSkill(newService).unwrap();
      const updatedServices = [...services, res];
      setServices(updatedServices);
      localStorage.setItem("services", JSON.stringify(updatedServices));

      setServiceName("");
      setBasePrice("");
      setServiceDescription("");
      setDuration("");
    } catch (err) {
      console.error("Failed to add skill/service:", err);
    }
  };

  const handleSubmitAll = () => {
    const newEntry = {
      department: {
        name: departmentName,
        description: departmentDescription,
      },
      services: services.filter(
        (service) => service.department === departmentName
      ),
      timestamp: new Date().toISOString(),
    };

    const updatedAllData = [...allData, newEntry];
    setAllData(updatedAllData);
    localStorage.setItem("allData", JSON.stringify(updatedAllData));

    // Reset everything
    setServices([]);
    setOpenServiceDialog(false);
    setDepartmentName("");
    setDepartmentDescription("");
    localStorage.removeItem("services");
  };

  const steps = ["Department Details", "Add Services", "Review & Submit"];

  return (
    <Box
      sx={{
        flexGrow: 1,

        p: 2,
        pt: 3,
        backgroundColor: colors.background,
        minHeight: "100vh",
        marginLeft: { xs: 0, md: "10px" },
        width: "100%",
        maxWidth: "1100px",
        boxSizing: "border-box",
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      {/* Header Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 4, width: "100%" }}>
        {/* Total Staff Card */}
        <Grid item xs={3} sm={3} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
              backgroundColor: colors.card,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardActionArea>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    width: 40,
                    height: 40,
                    mb: 2,
                  }}
                >
                  <MedicalServices color="primary" sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h9" sx={{ color: colors.textSecondary }}>
                  Total Employees
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: colors.primary }}
                >
                  247
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Active Staff Card */}
        <Grid item xs={3} sm={3} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
              backgroundColor: colors.card,

              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardActionArea>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e8f5e9",
                    width: 40,
                    height: 40,
                    mb: 2,
                  }}
                >
                  <LocalHospital color="success" sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h9" sx={{ color: colors.textSecondary }}>
                  Active Employees
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: colors.success }}
                >
                  215
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* On Leave Card */}
        <Grid item xs={3} sm={3} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
              backgroundColor: colors.card,

              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardActionArea>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#fff8e1",
                    width: 40,
                    height: 40,
                    mb: 2,
                  }}
                >
                  <BeachAccess color="warning" sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h9" sx={{ color: colors.textSecondary }}>
                  On Leave
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: colors.warning }}
                >
                  32
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "#929693",
                borderRadius: 3,
                py: 1.5,
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "#303f9f",
                  boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                },
              }}
              fullWidth
            >
              Add Employee
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDeptDialog(true)}
              sx={{
                backgroundColor: colors.success,
                borderRadius: 3,
                py: 1.5,
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "#388e3c",
                  boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                },
              }}
              fullWidth
            >
              Add Dept/Services
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
          backgroundColor: colors.card,
          p: { xs: 2, md: 3 },
          mb: 4,
          width: "100%",
          boxSizing: "border-box",
          overflowX: "auto", // Only allow horizontal scrolling if absolutely necessary
        }}
      >
        <DisplayUsers />
      </Paper>

      {/* Add Department Dialog */}
      <Dialog
        open={openDeptDialog}
        onClose={() => setOpenDeptDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: { xs: "95%", sm: "500px" },
            mx: "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.primary,
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Typography variant="h6">Add New Department</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenDeptDialog(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            variant="outlined"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={departmentDescription}
            onChange={(e) => setDepartmentDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenDeptDialog(false)}
            sx={{
              color: colors.secondary,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddDepartment}
            variant="contained"
            disabled={!departmentName}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: colors.primary,
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Services Dialog */}
      <Dialog
        open={openServiceDialog}
        onClose={() => setOpenServiceDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: { xs: "95%", md: "md" },
            mx: "auto",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.primary,
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Typography variant="h6">
            Add Services for {departmentName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenServiceDialog(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Service Name"
                fullWidth
                variant="outlined"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Department"
                fullWidth
                variant="outlined"
                disabled
                value={departmentName}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Base Price"
                fullWidth
                type="number"
                variant="outlined"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Typography color="textSecondary" sx={{ mr: 1 }}>
                      $
                    </Typography>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Duration (minutes)"
                fullWidth
                type="number"
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Typography color="textSecondary" sx={{ ml: 1 }}>
                      mins
                    </Typography>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Add this service">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddService}
                disabled={!serviceName || !basePrice || !duration}
                sx={{
                  backgroundColor: colors.success,
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                }}
              >
                Add Service
              </Button>
            </Tooltip>
          </Box>

          {services.filter((s) => s.department === departmentName).length >
            0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: colors.textPrimary, mb: 2 }}
              >
                Added Services
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: "divider",
                  p: 2,
                }}
              >
                <List disablePadding>
                  {services
                    .filter((service) => service.department === departmentName)
                    .map((service, index) => (
                      <Box key={index}>
                        <ListItem
                          sx={{
                            py: 2,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    color: colors.textPrimary,
                                  }}
                                >
                                  {service.skill_Name}
                                </Typography>
                                <Chip
                                  label={`$${service.basePrice}`}
                                  color="primary"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  sx={{
                                    display: "block",
                                    color: colors.textSecondary,
                                  }}
                                >
                                  Duration: {service.duration} mins
                                </Typography>
                                <Typography
                                  component="span"
                                  sx={{
                                    display: "block",
                                    color: colors.textSecondary,
                                    mt: 0.5,
                                  }}
                                >
                                  {service.description}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index <
                          services.filter(
                            (s) => s.department === departmentName
                          ).length -
                            1 && <Divider />}
                      </Box>
                    ))}
                </List>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setOpenServiceDialog(false);
              setOpenDeptDialog(true);
            }}
            startIcon={<ArrowBack />}
            sx={{
              color: colors.secondary,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmitAll}
            variant="contained"
            startIcon={<CheckCircle />}
            disabled={
              services.filter((s) => s.department === departmentName).length ===
              0
            }
            sx={{
              backgroundColor: colors.success,
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>

      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddUser}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            backgroundColor: colors.success,
            color: "white",
          }}
          icon={<CheckCircle fontSize="inherit" />}
        >
          Employee added successfully!
        </Alert>
      </Snackbar>
      <Department />
    </Box>
  );
};

export default ManageUsers;
