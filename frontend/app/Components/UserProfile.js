"use client";
import { useGetUserByIdQuery } from "@/features/apiSlice";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const ProfilePage = () => {
  const params = useParams();
  const userId = params.userId;
  const { data: userData, isError, isLoading } = useGetUserByIdQuery(userId);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    }
  }, [userData]);

  if (isLoading)
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">Error loading user data.</div>
    );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 500,
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          bgcolor: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            {user?.name.toUpperCase()}'s Data
          </Typography>
          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Status:</strong>{" "}
              {user?.status ? "Active🟢" : "Inactive 🔴"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Parent ID:</strong> {user?.parent_Id}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Password:</strong> ........
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
