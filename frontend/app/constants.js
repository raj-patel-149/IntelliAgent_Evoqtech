import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ReplayIcon from "@mui/icons-material/Replay";
import CancelIcon from "@mui/icons-material/Cancel";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PersonIcon from "@mui/icons-material/Person";

export const statusDetails = {
    waitingToStart: {
        label: "Waiting to Start",
        color: "primary",
        icon: <HourglassBottomIcon sx={{ fontSize: 30 }} />,
    },

    pending: {
        label: "Pending",
        color: "warning",
        icon: <HourglassEmptyIcon sx={{ fontSize: 30 }} />
    },
    expired: {
        label: "Expired",
        color: "error",
        icon: <EventBusyIcon sx={{ fontSize: 30 }} />
    },
    accepted: {
        label: "Accepted",
        color: "success",
        icon: <CheckCircleIcon sx={{ fontSize: 30 }} />
    },
    assigned: {
        label: "Assigned",
        color: "info",
        icon: <PersonAddIcon sx={{ fontSize: 30 }} />
    },
    scheduled: {
        label: "Scheduled",
        color: "primary",
        icon: <EventAvailableIcon sx={{ fontSize: 30 }} />
    },
    inProgress: {
        label: "In Progress",
        color: "secondary",
        icon: <BuildIcon sx={{ fontSize: 30 }} />
    },
    waitingForCustomer: {
        label: "Waiting for Customer",
        color: "warning",
        icon: <PersonIcon sx={{ fontSize: 30 }} />
    },
    waitingForParts: {
        label: "Waiting for Parts",
        color: "warning",
        icon: <SettingsIcon sx={{ fontSize: 30 }} />
    },
    completed: {
        label: "Completed",
        color: "success",
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />
    },
    missed: {
        label: "Missed",
        color: "error",
        icon: <ReportProblemIcon sx={{ fontSize: 30 }} />
    },
    waitingForApproval: {
        label: "Waiting for Approval",
        color: "info",
        icon: <HourglassBottomIcon sx={{ fontSize: 30 }} />
    },
    reopened: {
        label: "Reopened",
        color: "primary",
        icon: <ReplayIcon sx={{ fontSize: 30 }} />
    },
    halted: {
        label: "Halted",
        color: "error",
        icon: <PauseCircleOutlineIcon sx={{ fontSize: 30 }} />
    },
    rejected: {
        label: "Rejected",
        color: "error",
        icon: <CancelIcon sx={{ fontSize: 30 }} />
    },
    cancelled: {
        label: "Cancelled",
        color: "error",
        icon: <DoNotDisturbIcon sx={{ fontSize: 30 }} />
    },
    closed: {
        label: "Closed",
        color: "default",
        icon: <LockIcon sx={{ fontSize: 30 }} />
    }
};