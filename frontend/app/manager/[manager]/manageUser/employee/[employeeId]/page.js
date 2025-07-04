"use client";
import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/features/userApiSlice";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Container,
  Button,
  IconButton,
  Add as AddIcon,
  Edit as EditIcon,
  Chip,
  Divider,
} from "@mui/material";
import {
  Mail,
  Phone,
  Business,
  Work,
  LocationOn,
  Person,
} from "@mui/icons-material";

export default function EmployeeDetails() {
  const { employeeId } = useParams();
  const { data, error, isLoading } = useGetUserByIdQuery(employeeId);
 

  if (isLoading)
    return <CircularProgress className="absolute top-1/2 left-1/2" />;
  if (error)
    return <p className="text-red-500">Failed to load employee data</p>;

  const employee = data?.user;
  const serviceData = [
    {
      id: 1,
      name: "Web Development",
      subService: "Frontend Development",
      date: "2024-03-25",
      time: "10:00 AM",
      location: "New York",
      status: "Accepted",
    },
    {
      id: 2,
      name: "Graphic Design",
      subService: "Logo Design",
      date: "2024-03-24",
      time: "02:00 PM",
      location: "Los Angeles",
      status: "Rejected",
    },
    {
      id: 3,
      name: "SEO Optimization",
      subService: "Keyword Research",
      date: "2024-03-26",
      time: "11:30 AM",
      location: "Chicago",
      status: "Accepted",
    },
    {
      id: 4,
      name: "Mobile App Design",
      subService: "UI/UX Design",
      date: "2024-03-27",
      time: "03:15 PM",
      location: "San Francisco",
      status: "Rejected",
    },
  ];

  const columns = [
    { field: "name", headerName: "Service Name", flex: 1 },
    { field: "subService", headerName: "Subservices", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`font-bold ${
            params.value === "Accepted" ? "text-green-600" : "text-red-600"
          }`}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" disableGutters>
        <Box className="w-full min-h-screen overflow-x-hidden overflow-y-auto flex-grow-1">

      <Box className="flex flex-row justify-between p-6 bg-gray-100 min-h-screen flex-grow-1 max-w-ful">
        {/* Left Side */}
        <Box className="flex flex-col items-start space-y-6 max-w-ful">
          <Card className="w-[380px] p-6 shadow-xl rounded-2xl bg-white">
            {/* Profile Header */}
            <Box className="flex flex-col items-center">
              <Avatar
                src={employee?.profilePicture || "/profile.jpg"}
                alt="Employee"
                className="!w-35 !h-35 border-4 border-white shadow-lg transform hover:scale-105 transition duration-300"
              />
              <Typography
                variant="h6"
                className="mt-4 font-semibold text-gray-900"
              >
                {employee?.name}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {employee?.role || "Employee"}
              </Typography>
            </Box>

            {/* Profile Details */}
            <Box className="mt-5 space-y-4 text-gray-700 max-w-ful">
              <DetailItem
                icon={<Mail className="text-gray-400" />}
                label="Email"
                value={employee?.email}
              />
              <DetailItem
                icon={<Phone className="text-gray-400" />}
                label="Mobile"
                value={employee?.mobile_Number}
              />
              <DetailItem
                icon={<Business className="text-gray-400" />}
                label="Department"
                value={employee?.department}
              />
              <DetailItem
                icon={<Work className="text-gray-400" />}
                label="Service"
                value={employee?.service}
              />
              <DetailItem
                icon={<LocationOn className="text-gray-400" />}
                label="Location"
                value={employee?.location}
              />
              <DetailItem
                icon={<Person className="text-gray-400" />}
                label="Status"
                value={employee?.status}
              />
            </Box>
          </Card>
        </Box>

        <Box className="flex flex-col overflow-hidden space-y-6 flex-grow-1 max-w-ful">
          {/* Metric Cards */}
          <Box className="flex flex-nowrap space-x-6 overflow-hidden flex-1 pl-6">

            
            <Card className="w-[150px] min-w-0 max-w-full h-auto p-4 shadow-lg rounded-lg bg-white ">
              <Typography variant="h5" className="font-bold">
                $ 3.500
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Total earning
              </Typography>
            </Card>

            <Card className="w-[150px] min-w-0 max-w-full h-auto p-4 shadow-lg rounded-lg bg-white">
              <Typography variant="h5" className="font-bold">
                45
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                orders today
              </Typography>
            </Card>

            <Card className="w-[150px] min-w-0 max-w-full h-auto p-4 shadow-lg rounded-lg bg-white">
              <Typography variant="h5" className="font-bold">
                $ 2.700
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                total revenue
              </Typography>
            </Card>
          </Box>

          {/* Skills Section*/}
          <Card className="w-[500px] p-6 shadow-lg rounded-xl bg-white ml-6 overflow-hidden h-120 max-w-ful">
            <Typography variant="h6" className="font-semibold">
              Skills
            </Typography>
            <Box className="flex flex-wrap gap-2 mt-4">
              {[
                "HTML",
                "JavaScript",
                "Sass",
                "React",
                "Redux",
                "Next.js",
                "Material UI",
                "UI",
                "UX",
              ].map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  className="bg-gray-200 text-black"
                />
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
      {/* <Box className="w-[900px] p-6 bg-white rounded-xl shadow-lg ml-14 flex-1">*/}
      <Box className="w-full max-w-[900px] p-6 bg-white rounded-xl shadow-lg ml-14 overflow-hidden flex-grow-1 max-w-ful">
        <Typography variant="h6" className="font-semibold text-center mb-4">
          Service Status
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={serviceData}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            className="border border-gray-300"
          />
        </div>
      </Box>
    </Box>
    </Container>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <Box className="flex items-center space-x-3 p-2 bg-white/20 rounded-lg shadow-sm hover:bg-white/30 transition duration-200">
    {icon}
    <Typography className="text-black">
      <strong>{label}:</strong> {value || "N/A"}
    </Typography>
  </Box>
);