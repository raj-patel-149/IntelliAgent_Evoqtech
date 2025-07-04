import React, { useState, useEffect } from "react";
import { useUpdateEmployeeScoreMutation } from "../features/employeeApiSlice";

const EmployeeProfile = ({ employee }) => {
  const [updateScore] = useUpdateEmployeeScoreMutation();
  const [score, setScore] = useState(employee.score);

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (newStatus === "rejected") {
        const response = await updateScore({ employeeId: employee._id, change: -5 }).unwrap();
        setScore(response.score);
      } else if (newStatus === "completed") {
        const response = await updateScore({ employeeId: employee._id, change: +5 }).unwrap();
        setScore(response.score);
      }
    } catch (error) {
      console.error("Failed to update score:", error);
    }
  };

  return (
    <div>
      <h2>Employee Profile</h2>
      <p>Name: {employee.name}</p>
      <p>Score: {score}</p>

      <button onClick={() => handleStatusUpdate("completed")}>Complete Service (+5)</button>
      <button onClick={() => handleStatusUpdate("rejected")}>Reject Service (-5)</button>
    </div>
  );
};

export default EmployeeProfile;
