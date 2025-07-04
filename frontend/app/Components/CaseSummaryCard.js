"use client";
import { motion } from "framer-motion";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Chip, Typography } from "@mui/material";

import {
  ArrowBack as BackIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DetailsIcon,
  Construction as ServiceIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as ProblemIcon,
  Edit as EditIcon,
  HourglassBottom as HourglassBottomIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  HourglassEmpty as HourglassEmptyIcon,
  EventBusy as EventBusyIcon,
  PersonAdd as PersonAddIcon,
  EventAvailable as EventAvailableIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  ReportProblem as ReportProblemIcon,
  Replay as ReplayIcon,
  Cancel as CancelIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  inProgress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export default function CaseSummaryCard({ caseData }) {
  const router = useRouter();

  const pathname = usePathname();

   console.log("pathname", caseData)

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "warning",
      icon: <HourglassEmptyIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-amber-100 text-amber-800",
    },
    expired: {
      label: "Expired",
      color: "error",
      icon: <EventBusyIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-red-100 text-red-800",
    },
    accepted: {
      label: "Accepted",
      color: "success",
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-green-100 text-green-800",
    },
    assigned: {
      label: "Assigned",
      color: "info",
      icon: <PersonAddIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-blue-100 text-blue-800",
    },
    scheduled: {
      label: "Scheduled",
      color: "primary",
      icon: <EventAvailableIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-purple-100 text-purple-800",
    },
    inProgress: {
      label: "In Progress",
      color: "secondary",
      icon: <BuildIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-cyan-100 text-cyan-800",
    },
    waitingForCustomer: {
      label: "Waiting for Customer",
      color: "warning",
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-yellow-100 text-yellow-800",
    },
    waitingForParts: {
      label: "Waiting for Parts",
      color: "warning",
      icon: <SettingsIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-orange-100 text-orange-800",
    },
    completed: {
      label: "Completed",
      color: "success",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-green-100 text-green-800",
    },
    missed: {
      label: "Missed",
      color: "error",
      icon: <ReportProblemIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-red-100 text-red-800",
    },
    waitingForApproval: {
      label: "Waiting for Approval",
      color: "info",
      icon: <HourglassBottomIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-blue-100 text-blue-800",
    },
    reopened: {
      label: "Reopened",
      color: "primary",
      icon: <ReplayIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-indigo-100 text-indigo-800",
    },
    halted: {
      label: "Halted",
      color: "error",
      icon: <PauseCircleOutlineIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-pink-100 text-pink-800",
    },
    rejected: {
      label: "Rejected",
      color: "error",
      icon: <CancelIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-red-100 text-red-800",
    },
    cancelled: {
      label: "Cancelled",
      color: "error",
      icon: <DoNotDisturbIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-gray-300 text-gray-800",
    },
    closed: {
      label: "Closed",
      color: "default",
      icon: <LockIcon sx={{ fontSize: 30 }} />,
      bgColor: "bg-gray-500 text-white",
    },
  };
  const status = statusConfig[caseData.service_status] || statusConfig.default;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all"
      onClick={() => router.push(`${pathname}/${caseData._id}`)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Typography variant="h6" className="font-bold text-gray-900 truncate">
            {caseData.header}
          </Typography>
          <Chip
            label={status?.label || ""}
            color={status?.color}
            className={`${status?.bgColor} capitalize font-medium`}
            icon={status?.icon}
            size="small"
            // className={`${status} capitalize font-medium`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ServiceIcon className="text-gray-400" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {caseData.service}
            </Typography>
          </div>

          <div className="flex items-center space-x-2">
            <PersonIcon className="text-gray-400" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {caseData.receiver}
            </Typography>
          </div>

          <div className="flex items-center space-x-2">
            <LocationIcon className="text-gray-400" fontSize="small" />
            <Typography variant="body2" className="text-gray-600 truncate">
              {caseData.location}
            </Typography>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-gray-400" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {caseData.date} • {caseData.time}
            </Typography>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
