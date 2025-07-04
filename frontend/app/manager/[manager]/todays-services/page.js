// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import {
//   useGetTodaysServicesQuery,
// } from "@/features/caseApiSlice";
// import { setService } from "@/features/serviceSlice";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Chip,
//   CardContent,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { useState } from "react";
// import PlaceIcon from "@mui/icons-material/Place";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import EventIcon from "@mui/icons-material/Event";
// import PersonIcon from "@mui/icons-material/Person";
// import TaskAltIcon from "@mui/icons-material/TaskAlt";
// import CloseIcon from "@mui/icons-material/Close";
// import Link from "next/link";

// export default function TodaysServices() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.manager;
//   const dispatch = useDispatch();

//   const {
//     data: todaysServices,
//     isLoading,
//     isError,
//   } = useGetTodaysServicesQuery();

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const handleServiceClick = (service) => {
//     dispatch(setService(service)); // ✅ Update Redux state

//     setTimeout(() => {
//       router.push(`/manager/${id}/todays-services/service-details`);
//     }, 500); // 🔍 Delay to ensure Redux updates before navigation
//   };

//   return (
//     <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F3F4F6", minHeight: "100vh" }}>
//       <Typography variant="h5" fontWeight="bold" mb={3}>
//         Today's Services
//       </Typography>

//       {isLoading && <Typography>Loading...</Typography>}
//       {isError && <Typography color="error">Error fetching cases.</Typography>}
//       {todaysServices?.length === 0 && <Typography>No today cases found.</Typography>}

//       <Grid container spacing={3}>
//         {todaysServices?.map((service) => (
//           <Grid key={service.id} item xs={12} sm={6} md={4} lg={4}>
//             <Card
//               sx={{
//                 boxShadow: 3,
//                 borderRadius: 2,
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 cursor: "pointer",
//                 boxShadow: 4,
//                 borderRadius: 3,
//                 minWidth: 200,
//                 p: 2,
//                 transition: "0.3s",
//                 "&:hover": { transform: "scale(1.02)" },
//               }}
//               onDoubleClick={() => handleServiceClick(service)}
//             >
//               <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   {service.caseHeader}
//                 </Typography>

//                 {/* Sender */}
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <PersonIcon color="primary" />
//                   <Typography variant="body2">
//                     <strong>Sender:</strong> {service.sender}
//                   </Typography>
//                 </Box>

//                 {/* Date & Time */}
//                 <Box justifyContent="space-between">
//                   <Box display="flex" alignItems="center" gap={1}>
//                     <EventIcon color="action" />
//                     <Typography variant="body2">
//                       <strong>Date:</strong> {service.date}
//                     </Typography>
//                   </Box>
//                   <Box display="flex" alignItems="center" gap={1}>
//                     <AccessTimeIcon color="action" />
//                     <Typography variant="body2">
//                       <strong>Time:</strong> {service.time}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 {/* Location */}
//                 <Box display="flex" alignItems="center" gap={1} mb={1}>
//                   <PlaceIcon color="secondary" />
//                   <Typography variant="body2">
//                     <strong>Location:</strong>{" "}
//                     <Link
//                       href={`https://www.google.com/maps?q=${encodeURIComponent(
//                         service.location
//                       )}`}
//                       target="_blank"
//                       style={{ color: "#1976D2", textDecoration: "none" }}
//                     >
//                       {service.location}
//                     </Link>
//                   </Typography>
//                 </Box>

//                 {/* Description */}
//                 <Typography variant="body2" mb={2}>
//                   <Typography variant="body2">
//                     <strong>Description:</strong>{" "}
//                     <b className="text-gray-500">{service.description}</b>
//                   </Typography>
//                 </Typography>

//                 {/* Status Chip */}
//                 <Chip
//                   label={service.case_Status.toUpperCase()}
//                   color={
//                     service.case_Status === "accepted"
//                       ? "success"
//                       : service.case_Status === "rejected"
//                         ? "error"
//                         : "warning"
//                   }
//                   sx={{ fontWeight: "bold", mb: 2 }}
//                 />

//                 {/* Action Buttons */}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

"use client";

import {
  useGetAllServicesQuery,
  useGetEmployeeTodayTaskQuery,
  useGetTodaysServicesQuery,
  useUpdateCaseMutation,
} from "@/features/caseApiSlice";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import Link from "next/link";
import { useState } from "react";
import { useGetUserByIdQuery } from "@/features/apiSlice";
import { useDispatch } from "react-redux";
import { setService } from "@/features/serviceSlice";

export default function TodaysServices() {
  // useGetAllServicesQuery("accepted");
  const params = useParams();
  const id = params?.manager;
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: todaysServices,
    isLoading,
    isError,
  } = useGetTodaysServicesQuery();

  const { data } = useGetUserByIdQuery(id);
  const receiver = data?.user;

  const [updateCaseStatus] = useUpdateCaseMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const statusDetails = {
    waitingForApproval: { label: "Waiting for Approval", color: "error", icon: <HourglassBottomIcon sx={{ fontSize: 30 }} /> },
    waitingToStart: { label: "Waiting to Start", color: "primary", icon: <HourglassBottomIcon sx={{ fontSize: 30 }} /> },
    inProgress: { label: "In Progress", color: "primary", icon: <HourglassBottomIcon sx={{ fontSize: 30 }} /> },
    completed: { label: "Completed", color: "success", icon: <CheckCircleOutlineIcon sx={{ fontSize: 30 }} /> },
    halted: { label: "Halted", color: "warning", icon: <PauseCircleOutlineIcon sx={{ fontSize: 30 }} /> },
    missed: { label: "Missed", color: "error", icon: <HighlightOffIcon sx={{ fontSize: 30 }} /> },
  };

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      await updateCaseStatus({
        id: caseId,
        case_Status: newStatus,
        receiver: receiver?.name,
        receiver_id: receiver?._id,
      }).unwrap();
      setSnackbarMessage(`Case rejected successfully`);
      setSnackbarSeverity("success");
      refetch(); // Refresh the data after update
    } catch (error) {
      console.error("Failed to update case status:", error);
      setSnackbarMessage("Failed to update case status.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleServiceClick = (service) => {
    router.push(
      `/manager/${id}/todays-services/service-details/${service._id}`
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Today's Services
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Error fetching cases.</Typography>}
      {todaysServices && todaysServices.length === 0 && (
        <Typography>No today cases found.</Typography>
      )}

      <Grid container spacing={3} alignItems="stretch">
        {todaysServices?.map((service) => (
          <Grid key={service.id} item xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                boxShadow: 4,
                borderRadius: 3,
                minWidth: 200,
                pr: 2,
                pl: 2,
                pb: 2,
                pt: 0,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
              onClick={() => handleServiceClick(service)}
            >
              <CardContent>
                {/* Header */}
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

                {/* Sender */}
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

                {/* Date & Time */}
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

                {/* Location */}
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

                {/* Description */}
                <Typography variant="body2" mb={2} mt={2}>
                  <Typography variant="body2">
                    <strong>Description:</strong>{" "}
                    <b className="text-gray-500">{service.description}</b>
                  </Typography>
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Status Chip */}
                  <Chip
                    label={service.case_Status.toUpperCase()}
                    color={
                      service.case_Status === "accepted"
                        ? "success"
                        : service.case_Status === "rejected"
                        ? "error"
                        : "warning"
                    }
                    sx={{ fontWeight: "bold" }}
                  />

                  <Chip
                    label={statusDetails[service.service_status].label}
                    color={statusDetails[service.service_status].color}
                    icon={statusDetails[service.service_status].icon}
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
