"use client";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useGetFilterCasesQuery } from "@/features/caseApiSlice";
import { useGetUserByIdQuery } from "@/features/userApiSlice";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

export default function EmployeeServiceTable() {
  const params = useParams();
  const id = params?.employeeId;
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: cases = [], isLoading } = useGetFilterCasesQuery({
    id,
    status: statusFilter,
  });

  const rows = cases.map((c) => ({
    id: c._id,
    sender: c.sender,
    header: c.header,
    service: c.service,
    date: new Date(c.date).toLocaleDateString(),
    time: c.time,
    location: c.location,
    status: c.case_status,
  }));

  const columns = [
    {
      field: "sender",
      headerName: "Sender",
      flex: 1,
      headerClassName: "bg-gray-100",
      cellClassName: "text-gray-800",
    },
    {
      field: "header",
      headerName: "Header",
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "service",
      headerName: "Service",
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      headerClassName: "bg-gray-100",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "bg-gray-100",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          className={`mt-4 rounded-full text-sm font-medium flex justify-center items-center ${
            params.value === "accepted"
              ? "bg-green-100 text-green-800"
              : params.value === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box className="flex gap-2 mb-4">
        <Button
          variant={statusFilter === "all" ? "contained" : "outlined"}
          onClick={() => setStatusFilter("all")}
          className={`${
            statusFilter === "all" ? "bg-gray-600" : "text-gray-600"
          } hover:bg-gray-700`}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "accepted" ? "contained" : "outlined"}
          onClick={() => setStatusFilter("accepted")}
          className={`${
            statusFilter === "accepted" ? "bg-green-600" : "text-green-600"
          } hover:bg-green-700`}
        >
          Accepted
        </Button>
        <Button
          variant={statusFilter === "rejected" ? "contained" : "outlined"}
          onClick={() => setStatusFilter("rejected")}
          className={`${
            statusFilter === "rejected" ? "bg-red-600" : "text-red-600"
          } hover:bg-red-700`}
        >
          Rejected
        </Button>
      </Box>

      <Paper className="shadow-none border border-gray-200 rounded-lg">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          className="border-0"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f4f6",
              borderRadius: "8px 8px 0 0",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e5e7eb",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#f3f4f6",
              borderRadius: "0 0 8px 8px",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
