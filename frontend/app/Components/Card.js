"use client";
import { motion } from "framer-motion";
import { Avatar, Chip, Typography } from "@mui/material";
import { 
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DetailsIcon,
  Construction as ServiceIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as ProblemIcon,
  CheckCircle,
  Build as BuildIcon
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";

const statusConfig = {
  pending: { 
    color: "bg-amber-50 border-amber-200", 
    icon: <PendingIcon className="text-amber-500" />,
    text: "text-amber-600"
  },
  expired: { 
    color: "bg-gray-100 border-gray-200", 
    icon: <TimeIcon className="text-gray-500" />,
    text: "text-gray-600"
  },
  accepted: { 
    color: "bg-blue-50 border-blue-200", 
    icon: <CheckCircle className="text-blue-500" />,
    text: "text-blue-600"
  },
  inProgress: { 
    color: "bg-cyan-50 border-cyan-200", 
    icon: <BuildIcon className="text-cyan-500" />,
    text: "text-cyan-600"
  },
  completed: { 
    color: "bg-emerald-50 border-emerald-200", 
    icon: <CompletedIcon className="text-emerald-500" />,
    text: "text-emerald-600"
  },
  missed: { 
    color: "bg-rose-50 border-rose-200", 
    icon: <ProblemIcon className="text-rose-500" />,
    text: "text-rose-600"
  },
  default: { 
    color: "bg-gray-50 border-gray-200", 
    icon: <ServiceIcon className="text-gray-500" />,
    text: "text-gray-600"
  }
};

export default function ModernCaseCard({ caseData }) {
  const status = statusConfig[caseData.status] || statusConfig.default;
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    try {
      return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border ${status.color} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
    >
      {/* Card Header */}
      <div className={`p-5 border-b ${status.color}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white shadow-xs">
              {status.icon}
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-900">
                {caseData.header}
              </Typography>
              <Typography variant="subtitle2" className={`${status.text} font-medium`}>
                {caseData.service}
              </Typography>
            </div>
          </div>
          <Chip
            label={caseData.status}
            size="small"
            className={`capitalize ${status.text} font-medium border-current`}
            variant="outlined"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* People */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
              <PersonIcon className="text-indigo-500" />
            </div>
            <div>
              <Typography variant="caption" className="text-gray-500 font-medium">
                SENDER
              </Typography>
              <Typography variant="body2" className="font-medium text-gray-800">
                {caseData.sender}
              </Typography>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
              <PersonIcon className="text-purple-500" />
            </div>
            <div>
              <Typography variant="caption" className="text-gray-500 font-medium">
                RECEIVER
              </Typography>
              <Typography variant="body2" className="font-medium text-gray-800">
                {caseData.receiver}
              </Typography>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
            <LocationIcon className="text-red-500" />
          </div>
          <div>
            <Typography variant="caption" className="text-gray-500 font-medium">
              LOCATION
            </Typography>
            <Typography variant="body2" className="font-medium text-gray-800">
              {caseData.location}
            </Typography>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
              <CalendarIcon className="text-blue-500" />
            </div>
            <div>
              <Typography variant="caption" className="text-gray-500 font-medium">
                DATE & TIME
              </Typography>
              <Typography variant="body2" className="font-medium text-gray-800">
                {caseData.date} • {caseData.time}
              </Typography>
            </div>
          </div>
          {caseData.scheduled_start_time && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
                <TimeIcon className="text-amber-500" />
              </div>
              <div>
                <Typography variant="caption" className="text-gray-500 font-medium">
                  SCHEDULED
                </Typography>
                <Typography variant="body2" className="font-medium text-gray-800">
                  {formatDate(caseData.scheduled_start_time)}
                </Typography>
              </div>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-gray-50 rounded-lg p-4">
          <Typography variant="caption" className="text-gray-500 font-medium block mb-2">
            SERVICE TIMELINE
          </Typography>
          <div className="space-y-3">
            {caseData.actual_start_time && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Typography variant="body2" className="text-gray-700">
                  Started: {formatDate(caseData.actual_start_time)}
                </Typography>
              </div>
            )}
            {caseData.halted_time && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <Typography variant="body2" className="text-gray-700">
                  Halted: {formatDate(caseData.halted_time)}
                </Typography>
              </div>
            )}
            {caseData.actual_end_time && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <Typography variant="body2" className="text-gray-700">
                  Completed: {formatDate(caseData.actual_end_time)}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-xs mt-0.5">
            <DetailsIcon className="text-gray-500" />
          </div>
          <div>
            <Typography variant="caption" className="text-gray-500 font-medium">
              DETAILS
            </Typography>
            <Typography variant="body2" className="text-gray-700">
              {caseData.description}
            </Typography>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <Typography variant="caption" className="text-gray-500">
          Last updated: {formatDate(caseData.updatedAt)}
        </Typography>
        {caseData.reminder_sent && (
          <Chip
            label="Reminder Sent"
            size="small"
            color="info"
            variant="outlined"
            className="text-xs"
          />
        )}
      </div>
    </motion.div>
  );
}