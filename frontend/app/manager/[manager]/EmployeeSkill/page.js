"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import {
  useFetchApprovalSkillsQuery,
  useUpdateSkillStatusMutation,
} from "@/features/skillApiSlice";
import { useGetUserByIdQuery } from "@/features/apiSlice";

const SkillCard = ({ skill, handleStatusUpdate }) => {
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(
    skill.employee
  );
  const user = userData?.user;

  return (
    <Grid item xs={12} sm={6} md={4} key={skill._id}>
      <Card
        sx={{
          maxWidth: 360,
          padding: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            {skill.skill_Name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginBottom: 2 }}
          >
            Status:{" "}
            <strong
              style={{
                color:
                  skill.status === "pending"
                    ? "#FFA500"
                    : skill.status === "approved"
                    ? "#4CAF50"
                    : "#F44336",
              }}
            >
              {skill.status}
            </strong>
          </Typography>
          {userLoading ? (
            <CircularProgress size={20} />
          ) : user ? (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  sx={{ width: 50, height: 50, marginRight: 2 }}
                />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Department:</strong> {user.department}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                <strong>Location:</strong> {user.location}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "gray-100",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#7ae33d" },
                  }}
                  onClick={() => handleStatusUpdate(skill._id, "approved")}
                  startIcon={<CheckCircle />}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#fc5b66",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#db4852" },
                  }}
                  onClick={() => handleStatusUpdate(skill._id, "rejected")}
                  startIcon={<Cancel />}
                >
                  Reject
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="error">
              User not found
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

const EmployeeSkillRequest = () => {
  const {
    data: approvalSkills,
    isLoading: loadingSkills,
    refetch,
  } = useFetchApprovalSkillsQuery("pending" || "rejected");
  const [updateSkillStatus] = useUpdateSkillStatusMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateSkillStatus({ id, status }).unwrap();
      setSnackbar({
        open: true,
        message: `Skill ${status} successfully!`,
        severity: "success",
      });
      refetch(); // Refetch data after updating status
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update skill status!",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: 3, fontWeight: "bold", color: "#333" }}
      >
        Employee Skill Requests
      </Typography>
      {loadingSkills ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {approvalSkills?.approvals?.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              handleStatusUpdate={handleStatusUpdate}
            />
          ))}
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeSkillRequest;
