"use client";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import {
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Line } from "react-chartjs-2";


import { useGetEmployeeCountQuery,useGetEmployeesByDepartmentQuery } from "@/features/employeeApiSlice";
import { useGetUserCountQuery, useGetClientCountQuery } from "@/features/userApiSlice";
import { useAddSkillMutation } from "@/features/skillApiSlice";
import {TextField, Button } from "@mui/material";
import OrderComponent from "../../components/OrderComponent";
import PaymentButton from "../../components/PaymentButton";



export default function AdminDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("6 Months");

  const employees = ["John Doe", "Jane Smith", "Mark Johnson"];
  const departments = ["Saloon", "Garage", "AC Repairing", "Plumbing"];
  const timeRanges = ["1 Month", "3 Months", "6 Months", "1 Year"];

  // const { data, error, isLoading } = useGetEmployeeCountQuery(); // Fetch employee count

  const { data, error, isLoading } = useGetEmployeeCountQuery();
  const { data: userData, error: userError, isLoading: userLoading } = useGetUserCountQuery();
  const { data: depData, error: depError, isLoading: depLoading } = useGetEmployeesByDepartmentQuery();
  const { data: clientData, error: clientError, isLoading: clientLoading } = useGetClientCountQuery();



  if (isLoading || userLoading || depLoading || clientLoading) {
    return <Typography>Loading dashboard data...</Typography>;
  }

  if (error || userError || depError || clientError) {
    return <Typography>Error fetching dashboard data</Typography>;
  }

  const totalEmployees = data?.total || 0;
  const totalUsers = userData?.totalUsers || 0;
  const countClient = clientData?.totalClient || 0;




 

  const employeeData = {
    labels: [ "saloon","garage","repairing", "servicing","plumbing","electrical","carpentry", "cleaning", "painting",],
    datasets: [
      {
        label: "Employees",
        data: [90, 20, 50, 30, 60,45,67,87,65,43],
        backgroundColor: [
          "#B0BEC5",
          "#90A4AE",
          "#78909C",
          "#607D8B",
          "#455A64",
        ],
      },
    ],
  };

  const getPerformanceData = () => {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // X-axis labels
      datasets: [
        {
          label: "Revenue",
          data: [12000, 15000, 18000, 20000, 25000, 30000], // Dummy values
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
        },
      ],
    };
  };
  

  const employeePieData = {
    labels: depData.map((dept) => dept.name), // Department names
    datasets: [
      {
        data: depData.map((dept) => dept.employeeCount), // Employee count per department
        backgroundColor: [
          "#4B4B4B", // dark gray
          "#6E6E6E", // medium-dark gray
          "#8C8C8C", // medium gray
          "#A9A9A9", // medium-light gray
          "#C0C0C0", // light gray
          "#DCDCDC"  // very light gray
        ],
        
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
    barPercentage: 0.5, // Increases bar width
    categoryPercentage: 0.8, // Helps with proper spacing
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
  };

  const cardData = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <Users size={24} />,
    },
    { title: "Total Users", value: totalUsers, icon: <User size={24} /> },
    { title: "Total Client", value: countClient, icon: <Briefcase size={24} /> },
    { title: "Pending Approvals", value: "0", icon: <Clock size={24} /> },
    {
      title: "Payroll Processed",
      value: "$0",
      icon: <DollarSign size={24} />,
    },
    { title: "Upcoming Reviews", value: "0", icon: <Calendar size={24} /> },
    
  ];  return (
    <Box sx={{ p: 4, width: "100%", bgcolor: "gray.100", minHeight: "100vh" }}>
      {/* Key Metrics (6 Cards in 2 Rows) */}
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {card.icon}
                <Box>
                  <Typography variant="h6">{card.value}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {card.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
  {/* Bar Chart - Full Width */}
  <Grid item xs={12}>
    <Card sx={{ boxShadow: 3, p: 2, height: "400px" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
       Employee Payroll
        </Typography>
        <Box sx={{ height: "300px", width: "100%" }}>
          <Bar data={employeeData} options={barChartOptions} />
        </Box>
      </CardContent>
    </Card>
  </Grid>

{/* Pie Chart - Full Width like Bar Chart */}
<Grid item xs={12}>
  <Card sx={{ boxShadow: 3, p: 2, height: "400px" }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
      Employees by Department
      </Typography>
      <Box sx={{ height: "300px", width: "100%" }}>
      <Pie data={employeePieData} options={pieChartOptions} />
      </Box>
    </CardContent>
  </Card>
</Grid>

</Grid>

      {/* Performance Chart Section */}
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Employee Performance Over Time
              </Typography>

              {/* Filters */}
              <Box display="flex" gap={2} mb={2}>
                {/* Department Filter */}
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 250 }}
                >
                  <InputLabel>Select Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    label="Select Department"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Employee Filter */}
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 250 }}
                >
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    label="Select Employee"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp} value={emp}>
                        {emp}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Time Range Filter */}
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 250 }}
                >
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    label="Time Range"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {timeRanges.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

             
              <Line data={getPerformanceData()} /> 
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}