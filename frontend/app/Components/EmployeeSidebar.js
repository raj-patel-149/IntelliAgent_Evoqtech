"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Grid, TextField, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

export default function ServiceDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query params
  const caseHeader = searchParams.get("caseHeader");
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");
  const date = searchParams.get("date");
  const location = searchParams.get("location");
  const description = searchParams.get("description");

  const [serviceStatus, setServiceStatus] = useState("start");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogIcon, setDialogIcon] = useState(null);

  const handleButtonClick = () => {
    if (serviceStatus === "start") {
      setServiceStatus("completed");
      setDialogMessage("Service has started successfully.");
      setDialogIcon(<HourglassBottomIcon sx={{ fontSize: 50, color: "blue" }} />);
    } else if (serviceStatus === "completed") {
      setServiceStatus("end");
      setDialogMessage("Service is marked as completed.");
      setDialogIcon(<CheckCircleOutlineIcon sx={{ fontSize: 50, color: "green" }} />);
    } else {
      setDialogMessage("Service has ended and a new service can start.");
      setDialogIcon(<HighlightOffIcon sx={{ fontSize: 50, color: "red" }} />);
      setTimeout(() => router.back(), 1000);
    }
    setDialogOpen(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
          Service Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Service Header" fullWidth value={caseHeader || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Sender" fullWidth value={sender || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Receiver" fullWidth value={receiver || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Date & Time" fullWidth value={date || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Location" fullWidth value={location || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth multiline rows={2} value={description || ""} InputProps={{ readOnly: true }} sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }} />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" sx={{ width: "100%", py: 1, fontSize: "0.9rem", fontWeight: "bold", bgcolor: serviceStatus === "start" ? "primary.main" : serviceStatus === "completed" ? "green" : "red", "&:hover": { bgcolor: serviceStatus === "start" ? "primary.dark" : serviceStatus === "completed" ? "darkgreen" : "darkred" } }} onClick={handleButtonClick}>
            {serviceStatus === "start" ? "Start Service" : serviceStatus === "completed" ? "Completed" : "End"}
          </Button>
        </Box>
      </Box>

<<<<<<< HEAD
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>Service Update</DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          {dialogIcon}
          <Typography variant="body1" sx={{ mt: 2 }}>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color="primary">OK</Button>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" color="error">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
=======
      <Divider sx={{ bgcolor: "#475569", my: 2 }} />

      {/* Navigation Links */}
      <List>
        {[
          { text: "Edit Profile", icon: <Edit />, path: "/profile" }, // ✅ Navigate to Edit Profile page
          {
            text: "Accepted Services",
            icon: <Assignment />,
            path: "/services",
          },
          { text: "Settings", icon: <Settings />, path: "/settings" },
        ].map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => handleNavigation(item.path)} // ✅ Handle Navigation
            sx={{
                width: 280,
                height: '100vh',
                bgcolor: 'gray',
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                position: 'fixed',       // Ensures it stays fixed
                top: 0,                  // Fixes sidebar from the top
                bottom: 0,               // Ensures it touches the bottom
                zIndex: 10,              // Ensures sidebar stays above the content
                overflowY: 'auto'
            }}
          >
            <ListItemIcon sx={{ color: "#E2E8F0" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Logout Button */}
      <Button
        startIcon={<Logout />}
        sx={{
          mt: 2,
          bgcolor: "white",
          color: "black",
          "&:hover": { bgcolor: "#B71C1C" },
          padding: 1.5,
          borderRadius: "8px",
        }}
        fullWidth
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
>>>>>>> raj-dev
  );
}
