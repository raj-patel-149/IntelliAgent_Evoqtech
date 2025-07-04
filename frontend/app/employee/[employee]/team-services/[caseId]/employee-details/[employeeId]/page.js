"use client";
import { useParams } from "next/navigation";
import {
  useGetSkillsByDepartmentQuery,
  useGetUserByIdQuery,
} from "@/features/userApiSlice";

import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Container,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  Mail,
  Phone,
  Business,
  Work,
  LocationOn,
  Person,
  Star,
  AttachMoney,
  AssignmentTurnedIn,
  TrendingUp,
} from "@mui/icons-material";
import EmployeeServiceTable from "@/app/Components/EmployeeServiceTable";

export default function EmployeeDetails() {
  const { employeeId } = useParams();
  const { data, error, isLoading } = useGetUserByIdQuery(employeeId);
  const employee = data?.user;

  if (isLoading)
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography color="error">Failed to load employee data</Typography>
      </Box>
    );

  return (
    <Container maxWidth="xl" className="py-6">
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-lg rounded-xl bg-gray-50">
            <CardContent className="flex flex-col items-center p-6">
              <Avatar
                src={employee?.profilePicture || "/profile.jpg"}
                alt="Employee"
                className="!w-32 !h-32 border-4 border-gray-200 shadow-md mb-4"
              />
              <Typography variant="h5" className="font-bold text-gray-800">
                {employee?.name}
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600 mb-4">
                {employee?.role || "Employee"}
              </Typography>

              <Divider className="w-full my-2" />

              <Box className="w-full space-y-3 mt-4">
                <DetailItem
                  icon={<Mail className="text-gray-500" />}
                  label="Email"
                  value={employee?.email}
                />
                <DetailItem
                  icon={<Phone className="text-gray-500" />}
                  label="Mobile"
                  value={employee?.mobile_Number}
                />
                <DetailItem
                  icon={<Business className="text-gray-500" />}
                  label="Department"
                  value={employee?.department}
                />
                <DetailItem
                  icon={<LocationOn className="text-gray-500" />}
                  label="Location"
                  value={employee?.location}
                />
                <DetailItem
                  icon={<Person className="text-gray-500" />}
                  label="Status"
                  value={employee?.status}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Services */}
        <Grid item xs={12} md={8}>
          {/* Stats Cards */}
          <Grid container spacing={3} className="mb-4">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<AttachMoney className="text-green-500" />}
                title="Total Earnings"
                value="$3,500"
                color="bg-green-50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<AssignmentTurnedIn className="text-blue-500" />}
                title="Today's Orders"
                value="45"
                color="bg-blue-50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp className="text-purple-500" />}
                title="Total Revenue"
                value="$2,700"
                color="bg-purple-50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Star className="text-amber-500" />}
                title="Rating"
                value="4.8/5"
                color="bg-amber-50"
              />
            </Grid>
          </Grid>

          {/* Skills Card */}
          <Card className="shadow-lg rounded-xl mt-4 bg-gray-50">
            <CardContent className="p-6">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-4"
              >
                Skills & Expertise
              </Typography>
              <Box className="flex flex-wrap gap-2 mt-5">
                {employee?.service?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Services Table */}
          <Card className="shadow-lg rounded-xl bg-gray-50">
            <CardContent className="p-4">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-4"
              >
                Service History
              </Typography>
              <EmployeeServiceTable />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <Box className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
    <Box className="text-gray-500">{icon}</Box>
    <Box>
      <Typography variant="body2" className="text-gray-500">
        {label}
      </Typography>
      <Typography variant="body1" className="text-gray-800 font-medium">
        {value || "N/A"}
      </Typography>
    </Box>
  </Box>
);

const StatCard = ({ icon, title, value, color }) => (
  <Card className={`shadow-md rounded-xl ${color}`}>
    <CardContent className="p-4">
      <Box className="flex items-center justify-between">
        <Box>
          <Typography variant="body2" className="text-gray-600">
            {title}
          </Typography>
          <Typography variant="h5" className="font-bold text-gray-800">
            {value}
          </Typography>
        </Box>
        <Box className="p-2 bg-white rounded-full shadow-sm">{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);
