"use client";
import { useState } from "react";
import { Button, Input, Typography, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useGetAllServices2Query,
  useGetAllServices3Query,
  useGetServicesHistoryQuery,
} from "@/features/caseApiSlice";
import CaseSummaryCard from "@/app/Components/CaseSummaryCard";

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.grey[700]}, ${theme.palette.grey[500]})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  display: "inline-block",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: "60%",
    height: "3px",
    background: `linear-gradient(to right, ${theme.palette.grey[400]}, transparent)`,
    borderRadius: "3px",
  },
}));

export default function AllServices3({ service, id, page }) {
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query hook
  const {
    data: allServices = [], // Default to empty array
    isLoading,
    isError,
    refetch,
  } = useGetAllServices3Query({ service, id });

  // Filter cases based on search term
  const filteredCases = allServices?.filter(
    (caseItem) =>
      caseItem?.header?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem?.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem?.sender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Typography color="error">Error loading cases</Typography>
        <Button onClick={refetch} variant="outlined" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#F3F4F6]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <SectionTitle variant="h4" fontWeight="bold">
          Your Services
        </SectionTitle>

        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Input
              placeholder="Search cases..."
              startAdornment={<SearchIcon className="text-gray-400 mr-2" />}
              className="w-full pl-3 pr-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            className="whitespace-nowrap"
          >
            Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredCases?.length === 0 ? (
        <Typography>No cases...</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases?.map((caseItem) => (
            <CaseSummaryCard
              key={caseItem._id || caseItem.id}
              caseData={caseItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
