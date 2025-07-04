"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { useGetEmployeeScheduleWithCasesQuery } from "@/features/userApiSlice";
import { useParams } from "next/navigation";

const startHour = 0;
const endHour = 24;
const hours = Array.from(
  { length: endHour - startHour },
  (_, i) => startHour + i
);

const statusColors = {
  accepted: "#e6f4ea", // Google Calendar blue
  inProgress: "#fce8b2", // Google Calendar yellow
  completed: "#c7e5cb", // Google Calendar green
  cancelled: "#f4c7c3", // Google Calendar red
};

const statusBorderColors = {
  accepted: "#aecbfa",
  inProgress: "#fdd663",
  completed: "#81c995",
  cancelled: "#f28b82",
};

const ScheduleCell = styled(TableCell)(({ theme }) => ({
  padding: "2px",
  border: "1px solid #e0e0e0",
  textAlign: "center",
  verticalAlign: "middle",
  height: "8px",
  minWidth: "80px",
  backgroundColor: "white",
  zIndex: 0,
}));

const TimeHeaderCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: "#f5f5f5",
  padding: "8px",
  border: "1px solid #e0e0e0",
  textAlign: "center",
  fontWeight: "bold",
  zIndex: 1,
  fontSize: "0.75rem",
}));

const DayHeaderCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  left: 0,
  backgroundColor: "#fff",
  padding: "8px",
  border: "1px solid #e0e0e0",
  textAlign: "center",
  fontWeight: "bold",
  minWidth: "120px",
  zIndex: 5,
}));

const transformSchedulesToActivities = (schedules, caseDetails) => {
  const activitiesByDate = {};

  schedules.forEach((schedule, index) => {
    const caseDetail = caseDetails[index];
    const [day, month, year] = schedule.date.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    const activity = {
      id: schedule?._id,
      startHour: schedule?.start_time,
      duration: schedule?.end_time - schedule?.start_time,
      title: caseDetail?.service,
      status: schedule?.status,
      description: caseDetail?.description,
      location: caseDetail?.location,
      participants: [caseDetail?.receiver],
    };

    if (!activitiesByDate[formattedDate]) {
      activitiesByDate[formattedDate] = [];
    }

    activitiesByDate[formattedDate].push(activity);
  });

  return activitiesByDate;
};

const EmployeeSchedulePage = () => {
  const params = useParams();
  const empId = params?.employee;
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [daysToShow, setDaysToShow] = useState(5);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sampleActivities, setSampleActivites] = useState({});

  const { data } = useGetEmployeeScheduleWithCasesQuery(empId);
  const schedules = data?.schedules || [];
  const caseDetails = data?.caseDetails || [];

  useEffect(() => {
    if (schedules.length && caseDetails.length) {
      const formatted = transformSchedulesToActivities(schedules, caseDetails);
      setSampleActivites(formatted);
    }
  }, [schedules, caseDetails]);

  const navigateToPrevious = () => {
    setCurrentDate(currentDate.subtract(daysToShow, "day"));
  };

  const navigateToNext = () => {
    setCurrentDate(currentDate.add(daysToShow, "day"));
  };

  const navigateToToday = () => {
    setCurrentDate(dayjs());
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getScheduleData = () => {
    return Array.from({ length: daysToShow }, (_, i) => {
      const date = currentDate.add(i, "day");
      const dateKey = date.format("YYYY-MM-DD");
      const activities = sampleActivities[dateKey] || [];

      const slots = {};
      for (let hour of hours) {
        slots[hour] = null;
      }

      activities.forEach((activity) => {
        for (
          let h = activity.startHour;
          h < activity.startHour + activity.duration;
          h++
        ) {
          slots[h] = {
            ...activity,
            isStart: h === activity.startHour,
          };
        }
      });

      return {
        date: date.format("YYYY-MM-DD"),
        day: date.format("dddd"),
        isToday: date.isSame(dayjs(), "day"),
        slots,
      };
    });
  };

  const scheduleData = getScheduleData();

  // Calculate today's progress
  const calculateTodayProgress = () => {
    const today = scheduleData.find((day) => day.isToday);
    if (!today) return { percentage: 0, completed: 0, total: 0 };

    const todayTasks = Object.values(today.slots).filter(
      (slot) => slot !== null && slot.isStart
    );
    const totalTasks = todayTasks.length;

    if (totalTasks === 0) return { percentage: 0, completed: 0, total: 0 };

    const completedTasks = todayTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgressTasks = todayTasks.filter(
      (task) => task.status === "inProgress"
    ).length;

    // Weighted progress calculation:
    // Completed tasks count as 100%, inProgress as 50%, others as 0%
    const weightedProgress =
      (completedTasks * 1 + inProgressTasks * 0.5) / totalTasks;
    const percentage = Math.round(weightedProgress * 100);

    return {
      percentage,
      completed: completedTasks,
      inProgress: inProgressTasks,
      total: totalTasks,
    };
  };

  const progressData = calculateTodayProgress();

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Employee Schedule
          </h2>
          <button
            onClick={navigateToToday}
            className="ml-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-700">
            {currentDate.format("MMMM YYYY")}
          </span>
          <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200">
            <button
              onClick={navigateToPrevious}
              className="p-2 hover:bg-gray-100 transition-colors rounded-l-md"
            >
              <ChevronLeft className="text-gray-600" size={20} />
            </button>
            <button
              onClick={navigateToToday}
              className="px-3 py-1 text-sm border-x border-gray-200 hover:bg-gray-100"
            >
              <Calendar className="text-gray-600" size={16} />
            </button>
            <button
              onClick={navigateToNext}
              className="p-2 hover:bg-gray-100 transition-colors rounded-r-md"
            >
              <ChevronRight className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      {/* Table Container */}
      <div className="p-6 bg-gray-50 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Box
            sx={{
              maxHeight: "calc(100vh - 180px)",
              overflow: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              maxWidth: "1010px",
              width: "100%",
            }}
          >
            <Table
              stickyHeader
              sx={{
                "& .MuiTableCell-root": {
                  border: "1px solid #e0e0e0",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <DayHeaderCell>Date</DayHeaderCell>

                  {hours.map((h) => (
                    <TimeHeaderCell key={h}>{`${h
                      .toString()
                      .padStart(2, "0")}:00`}</TimeHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      backgroundColor: "#f0f7ff",
                      "&:hover": {
                        backgroundColor: "#f9f9f9",
                      },
                    }}
                  >
                    <DayHeaderCell key={i}>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-normal text-gray-500">
                          {row.day.substring(0, 3).toUpperCase()}
                        </span>
                        <span
                          className={`text-lg font-medium ${
                            row.isToday
                              ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                              : ""
                          }`}
                        >
                          {row.date.split("-")[2]}
                        </span>
                      </div>
                    </DayHeaderCell>

                    {hours.map((h) => {
                      const slot = row.slots[h];
                      if (slot?.isStart) {
                        return (
                          <ScheduleCell
                            key={h}
                            colSpan={slot.duration}
                            sx={{
                              fontWeight: "bold",
                              color: "#333",
                              textAlign: "left",
                              padding: "3px",
                              cursor: "pointer",
                              "&:hover": {
                                opacity: 0.9,
                                boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.1)",
                              },
                              border: "2px solid black",
                            }}
                            onClick={() => handleActivityClick(slot)}
                          >
                            <div
                              className="flex flex-col p-3 rounded-4xl"
                              style={{
                                backgroundColor: statusColors[slot.status],
                              }}
                            >
                              <span>{slot.title}</span>
                              {/* <span className="text-xs font-normal">
                                {`${slot.startHour
                                  .toString()
                                  .padStart(2, "0")}:00 - ${(
                                  slot.startHour + slot.duration
                                )
                                  .toString()
                                  .padStart(2, "0")}:00`}
                              </span> */}
                            </div>
                          </ScheduleCell>
                        );
                      } else if (slot === null) {
                        return <ScheduleCell key={h}></ScheduleCell>;
                      }
                      return null;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Today's Schedule - {dayjs().format("dddd, MMMM D")}
            </h3>
            <p className="text-sm text-gray-500">
              {progressData.total} tasks scheduled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              label={`${progressData.completed} completed`}
              size="small"
              sx={{
                backgroundColor: "#c7e5cb",
                color: "#1e4620",
                fontWeight: 500,
              }}
            />
            <Chip
              label={`${progressData.inProgress} in progress`}
              size="small"
              sx={{
                backgroundColor: "#fce8b2",
                color: "#5c3c00",
                fontWeight: 500,
              }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Daily progress</span>
            <span>{progressData.percentage}%</span>
          </div>
          <LinearProgress
            variant="determinate"
            value={progressData.percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor:
                  progressData.percentage === 100 ? "#81c995" : "#4285f4",
              },
            }}
          />
        </div>

        {/* Tasks List */}
        <div className="divide-y divide-gray-100">
          {scheduleData.find((day) => day.isToday) ? (
            Object.values(scheduleData.find((day) => day.isToday).slots)
              .filter((slot) => slot !== null && slot.isStart)
              .map((task, index) => (
                <div
                  key={index}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => handleActivityClick(task)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        backgroundColor: statusBorderColors[task.status],
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-gray-800 truncate">
                          {task.title}
                        </h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                          {`${task.startHour
                            .toString()
                            .padStart(2, "0")}:00 - ${(
                            task.startHour + task.duration
                          )
                            .toString()
                            .padStart(2, "0")}:00`}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="truncate">{task.location}</span>
                        </div>
                        {task.participants.length > 0 && (
                          <AvatarGroup
                            max={3}
                            sx={{
                              "& .MuiAvatar-root": {
                                width: 24,
                                height: 24,
                                fontSize: "0.75rem",
                              },
                            }}
                          >
                            {task.participants.map((participant, i) => (
                              <Avatar
                                key={i}
                                alt={participant}
                                sx={{ bgcolor: "#4285f4" }}
                              >
                                {participant.charAt(0)}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="px-6 py-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tasks scheduled for today
              </h3>
              <p className="mt-1 text-sm text-gray-500">Enjoy your day!</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: selectedActivity
              ? statusColors[selectedActivity.status]
              : "#f5f5f5",
            color: "#333",
            padding: "16px 24px",
            borderLeft: selectedActivity
              ? `6px solid ${statusBorderColors[selectedActivity.status]}`
              : "none",
          }}
        >
          <div>
            <Typography variant="h6" fontWeight="bold">
              {selectedActivity?.title}
            </Typography>
            <Typography variant="body2">
              {selectedActivity &&
                `${dayjs(selectedActivity.date).format("dddd, MMMM D")} • ${
                  selectedActivity.startHour
                }:00 - ${
                  selectedActivity.startHour + selectedActivity.duration
                }:00`}
            </Typography>
          </div>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: "rgba(0, 0, 0, 0.54)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {selectedActivity && (
            <div className="space-y-4">
              <div>
                <Typography>
                  {selectedActivity.description !== "NA"
                    ? selectedActivity.description
                    : ""}
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Location
                  </Typography>
                  <Typography>{selectedActivity.location}</Typography>
                </div>

                <div>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={selectedActivity.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: statusColors[selectedActivity.status],
                      color: "#000",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  />
                </div>
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Participants
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.participants.map((participant, index) => (
                    <Chip
                      key={index}
                      label={participant}
                      avatar={<Avatar>{participant.charAt(0)}</Avatar>}
                      variant="outlined"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeSchedulePage;
