"use client";
import { Typography, Box } from "@mui/material";

const DashboardContent = ({ title }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">{title}</Typography>
    </Box>
  );
};

export default DashboardContent;
