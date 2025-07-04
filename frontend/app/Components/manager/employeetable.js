"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "chart.js";
import { Avatar, Button, Chip, IconButton, Typography } from "@mui/material";
import {
  LocationOn,
  PersonAdd,
  PersonRemove,
  Visibility,
} from "@mui/icons-material";

const EmployeeAvatar = ({ employee }) => (
  <Tooltip title={`${employee.name} (${employee.email})`} arrow>
    <Avatar
      src={employee.profilePicture || "/default-avatar.png"}
      sx={{ width: 40, height: 40, marginRight: -1, border: "2px solid white" }}
    />
  </Tooltip>
);

const Employeetable = ({ assignedEmployees, handleAssignClick }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm mt-3">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assignedEmployees.map((emp, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
              }}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <EmployeeAvatar employee={emp} />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {emp.name}
                    </p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <LocationOn fontSize="small" className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-900">
                    {emp.location || "Unknown"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Chip
                  label={emp.status || "Active"}
                  size="small"
                  color={
                    emp.status === "Active"
                      ? "success"
                      : emp.status === "On Leave"
                      ? "warning"
                      : "default"
                  }
                  variant="outlined"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                <Tooltip title="View profile" arrow>
                  <IconButton size="small">
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove from case" arrow>
                  <IconButton size="small" className="text-red-500">
                    <PersonRemove fontSize="small" />
                  </IconButton>
                </Tooltip>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
        <Typography variant="body2" className="text-gray-600">
          Showing {assignedEmployees.length} of {assignedEmployees.length}{" "}
          members
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonAdd />}
          onClick={handleAssignClick}
        >
          Add Team Member
        </Button>
      </div>
    </div>
  );
};

export default Employeetable;
