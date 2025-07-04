'use client';

import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
} from "@mui/material";
import {
  useGetClientCasesQuery,
} from "@/features/caseApiSlice";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import Link from "next/link";
import { useGetUserByIdQuery } from "@/features/apiSlice";

export default function AcceptedServices() {
  const router = useRouter();
  const params = useParams();
  const id = params?.userId;

  const { data } = useGetUserByIdQuery(id);
  const user = data?.user;
  const name = user?.name;

  const {
    data: acceptedCases,
    isLoading,
    isError,
  } = useGetClientCasesQuery(name);

  // Modal + Stepper State
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleOpen = (service) => {
    setSelectedService(service);
    setFormData({
      date: service.date || "",
      time: service.time || "",
      location: service.location || "",
      description: service.description || "",
    });
    setActiveStep(0); // 🆕 Reset to first step on open
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
    setFormData({
      date: "",
      time: "",
      location: "",
      description: "",
    });
    setActiveStep(0); // Reset step here
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    // TODO: Send updated data to backend
    handleClose(); // Reset everything
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Accepted Services
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Error fetching cases.</Typography>}
      {acceptedCases && acceptedCases.length === 0 && (
        <Typography>No accepted cases found.</Typography>
      )}

      <Grid container spacing={3}>
        {acceptedCases?.map((service) => (
          <Grid key={service.id} item xs={12} sm={6} md={4} lg={4}>
            <Card
              onClick={() => handleOpen(service)}
              sx={{
                boxShadow: 4,
                borderRadius: 3,
                minWidth: 200,
                pr: 2,
                pl: 2,
                pb: 2,
                pt: 0,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.02)", cursor: "pointer" },
                height: 400,
                overflow: "auto",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={1}
                  sx={{
                    backgroundColor: "#e0dede",
                    width: "100%",
                    borderRadius: 5,
                    textAlign: "center",
                    padding: "5px",
                  }}
                >
                  {service.header}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="body2">
                    <strong>Employee:</strong> {service.receiver}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <PersonIcon color="primary" />
                  <Typography variant="body2">
                    <strong>Customer:</strong> {service.sender}
                  </Typography>
                </Box>

                <Box justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <EventIcon color="action" />
                    <Typography variant="body2">
                      <strong>Date:</strong> {service.date}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <AccessTimeIcon color="action" />
                    <Typography variant="body2">
                      <strong>Time:</strong> {service.time}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <PlaceIcon color="secondary" />
                  <Typography variant="body2">
                    <strong>Location:</strong>{" "}
                    <Link
                      href={`https://www.google.com/maps?q=${encodeURIComponent(
                        service.location
                      )}`}
                      target="_blank"
                      style={{ color: "#1976D2", textDecoration: "none" }}
                    >
                      {service.location}
                    </Link>
                  </Typography>
                </Box>

                <Typography variant="body2" mb={2} mt={2}>
                  <strong>Description:</strong>{" "}
                  <b className="text-gray-500">{service.description}</b>
                </Typography>
                <Chip
                  label={service.case_Status?.toUpperCase()}
                  color={
                    service.case_Status === "accepted"
                      ? "success"
                      : service.case_Status === "rejected"
                        ? "error"
                        : "warning"
                  }
                  sx={{ fontWeight: "bold", mb: 2 }}
                  mt={2}
                />

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Multi-Step Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Service Details</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {["Date/Time", "Location", "Description"].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <>
              <TextField
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                fullWidth
                margin="normal"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}

          {activeStep === 1 && (
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          )}

          {activeStep === 2 && (
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          )}
        </DialogContent>


      </Dialog>
    </Box>
  );
}
