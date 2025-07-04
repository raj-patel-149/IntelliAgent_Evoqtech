"use client";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Button,
  IconButton,
  Paper,
  Stack,
  LinearProgress,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  ArrowBack,
  Work,
  People,
  Schedule,
  MonetizationOn,
  CheckCircle,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import {
  useDeleteTemplateMutation,
  useGetTeamServiceTemplateByIdQuery,
} from "@/features/teamTemplateApiSlice";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

const TeamServiceTemplatePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.serviceId;
  const { data, isLoading, error } = useGetTeamServiceTemplateByIdQuery(id);
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();

  const service = data?.data;

  // Mock data for analytics (replace with actual API calls)
  const [analytics] = useState({
    totalCustomers: 124,
    completedServices: 98,
    completionRate: 79,
    averageRating: 4.2,
    demandLevel: "High",
  });

  // State for modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    service_name: service?.service_name || "",
    description: service?.description || "",
    basePrice: service?.basePrice || "",
    completion_time: service?.completion_time || "",
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">Error loading service details</Typography>
      </Box>
    );
  }

  if (!service) {
    return null;
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Add your update API call here
    console.log("Saving changes:", editForm);
    setEditDialogOpen(false);
  };

  const handleDelete = async () => {
    // Add your delete API call here
    await deleteTemplate(service._id).unwrap();
    console.log("Deleting service:", service._id);
    setDeleteDialogOpen(false);

    router.back();
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Back to Services
      </Button>

      <Grid container spacing={3}>
        {/* Left Column - Service Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, backgroundColor: "white" }}>
            <Box sx={{ position: "relative", height: 300 }}>
              <img
                src={service.servicePicture}
                alt={service.service_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {service.service_name}
                </Typography>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditForm({
                        service_name: service.service_name,
                        description: service.description,
                        basePrice: service.basePrice,
                        completion_time: service.completion_time,
                      });
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {service.description}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {service.skills_tags?.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <MonetizationOn color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      <strong>Price:</strong> {service.basePrice}{" "}
                      {service.currency}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Schedule color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      <strong>Completion Time:</strong>{" "}
                      {service.completion_time} hours
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Work color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      <strong>Leader Required:</strong>{" "}
                      {service.leader_required ? "Yes" : "No"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Tools Needed:</strong>
                  </Typography>
                  <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                    {service.tools_needed?.map((tool, index) => (
                      <li key={index}>
                        <Typography variant="body2">{tool}</Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Team Requirements Section */}
          <Card sx={{ mb: 3, backgroundColor: "white" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Team Requirements
              </Typography>
              <Grid container spacing={2}>
                {service.requirements?.map((req, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "#fafafa",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        {req.department.charAt(0).toUpperCase() +
                          req.department.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {req.count} professional{req.count > 1 ? "s" : ""}{" "}
                        needed
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Analytics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, backgroundColor: "white" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Service Analytics
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    <People
                      fontSize="small"
                      sx={{ mr: 1, verticalAlign: "middle" }}
                    />
                    Total Customers
                  </Typography>
                  <Typography fontWeight="bold">
                    {analytics.totalCustomers}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    <CheckCircle
                      fontSize="small"
                      sx={{ mr: 1, verticalAlign: "middle" }}
                    />
                    Completed Services
                  </Typography>
                  <Typography fontWeight="bold">
                    {analytics.completedServices}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <Star
                      fontSize="small"
                      sx={{ mr: 1, verticalAlign: "middle" }}
                    />
                    Average Rating
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={analytics.averageRating}
                      precision={0.1}
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography>({analytics.averageRating})</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <TrendingUp
                      fontSize="small"
                      sx={{ mr: 1, verticalAlign: "middle" }}
                    />
                    Demand Level
                  </Typography>
                  <Chip
                    label={analytics.demandLevel}
                    color={
                      analytics.demandLevel === "High"
                        ? "success"
                        : analytics.demandLevel === "Medium"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={analytics.completionRate}
                      sx={{
                        flexGrow: 1,
                        mr: 1,
                        height: 8,
                        borderRadius: 4,
                      }}
                    />
                    <Typography variant="body2">
                      {analytics.completionRate}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity (Mock) */}
          <Card sx={{ backgroundColor: "white", width: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ color: "text.secondary" }}>
                <Typography variant="body2" gutterBottom>
                  • 5 new requests in last 24 hours
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • 3 projects completed yesterday
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • 1 customer rated 5 stars
                </Typography>
                <Typography variant="body2">• Updated 2 days ago</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Service Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{service.service_name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Service Template</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Service Name"
            name="service_name"
            value={editForm.service_name}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Base Price"
            name="basePrice"
            type="number"
            value={editForm.basePrice}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Completion Time (hours)"
            name="completion_time"
            type="number"
            value={editForm.completion_time}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Currency"
            name="currency"
            select
            value={service.currency}
            disabled
          >
            <MenuItem value="INR">INR</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamServiceTemplatePage;
