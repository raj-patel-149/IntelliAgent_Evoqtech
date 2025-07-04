"use client";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useState, useEffect } from "react";
import {
  useGetNotificationsQuery,
  useClearNotificationsMutation,
  useMarkNotificationAsReadMutation,
} from "@/features/notificationSlice";
import { useParams, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/features/apiSlice";
import {
  ClearAll as ClearAllIcon,
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  HourglassBottom as HourglassBottomIcon,
  EventAvailable as EventAvailableIcon,
} from "@mui/icons-material";

const statusConfig = {
  accepted: {
    label: "Accepted",
    color: "success",
    icon: <CheckCircleIcon fontSize="small" />,
  },
  inProgress: {
    label: "In Progress",
    color: "info",
    icon: <BuildIcon fontSize="small" />,
  },
  completed: {
    label: "Completed",
    color: "success",
    icon: <CheckCircleIcon fontSize="small" />,
  },
  halted: {
    label: "Stopped",
    color: "warning",
    icon: <PauseCircleOutlineIcon fontSize="small" />,
  },
  "accepted-agent": {
    label: "New",
    color: "primary",
    icon: <EventAvailableIcon fontSize="small" />,
  },
  waitingForApproval: {
    label: "Approval",
    color: "secondary",
    icon: <HourglassBottomIcon fontSize="small" />,
  },
  waitingToStart: {
    label: "Approved",
    color: "info",
    icon: <HourglassBottomIcon fontSize="small" />,
  },
};

export default function NotificationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.employee || params.userId || params.manager;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State
  const [notifList, setNotifList] = useState([]);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // API Hooks
  const { data: userData } = useGetUserByIdQuery(id);
  const user = userData?.user;
  const name = user?.name;

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery(name, { skip: !name });

  const [clearNotifications] = useClearNotificationsMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  // Effects
  useEffect(() => {
    if (notifications?.length > 0) {
      setNotifList(notifications);
    }
  }, [notifications]);

  // Handlers
  const handleClearAll = async () => {
    try {
      await clearNotifications(name).unwrap();
      setNotifList([]);
      setClearDialogOpen(false);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
      setNotifList((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    // Add navigation logic based on notification type if needed
  };

  // Render States
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4}>
        <Typography color="error">Failed to load notifications.</Typography>
        <Button onClick={refetch} variant="outlined" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (notifList.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <NotificationsActiveIcon
          sx={{ fontSize: 60, color: "action.disabled" }}
        />
        <Typography variant="h6" color="textSecondary">
          No notifications available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 3,

        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
          py: 2,
          px: isMobile ? 1 : 3,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          Notifications
        </Typography>
        <Tooltip title="Clear all notifications">
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            startIcon={!isMobile && <ClearAllIcon />}
            onClick={() => setClearDialogOpen(true)}
            disabled={notifList.length === 0}
          >
            {isMobile ? <ClearAllIcon /> : "Clear All"}
          </Button>
        </Tooltip>
      </Box>

      {/* Notification List */}
      <Paper elevation={isMobile ? 1 : 3} sx={{ overflow: "hidden" }}>
        <List sx={{ p: 0 }}>
          {notifList.map((notif) => (
            <ListItem
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              sx={{
                bgcolor: notif.read ? "background.paper" : "action.hover",
                borderBottom: "1px solid",
                borderColor: "divider",
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: "action.selected",
                },
                cursor: "pointer",
                px: isMobile ? 1 : 3,
                py: isMobile ? 1 : 2,
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <Box display="flex" width="100%" alignItems="center">
                <ListItemAvatar sx={{ minWidth: isMobile ? 40 : 56 }}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={notif.read}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          theme.palette[statusConfig[notif.case_status].color]
                            ?.main || "gray",
                        width: isMobile ? 36 : 48,
                        height: isMobile ? 36 : 48,
                      }}
                    >
                      <NotificationsActiveIcon
                        fontSize={isMobile ? "small" : "medium"}
                      />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  primary={notif.content}
                  primaryTypographyProps={{
                    fontWeight: notif.read ? "normal" : "bold",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  }}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                      >
                        {notif.service}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? "0.625rem" : "0.75rem" }}
                      >
                        {notif.date} • {notif.time}
                      </Typography>
                    </>
                  }
                  sx={{ ml: isMobile ? 1 : 2 }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Clear All Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>Clear All Notifications</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all notifications?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button
            onClick={() => setClearDialogOpen(false)}
            color="primary"
            size={isMobile ? "large" : "medium"}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearAll}
            color="error"
            variant="contained"
            size={isMobile ? "large" : "medium"}
            fullWidth={isMobile}
            sx={{ ml: isMobile ? 0 : 2 }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
