"use client";

import { useParams } from "next/navigation";
import CustomerLeftSection from "../../Components/CustomerLeftSection";
import TeamServiceCard from "@/app/Components/TeamServiceCard";
import { Box, styled } from "@mui/material";

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
  backgroundImage:
    "radial-gradient(circle at 15% 50%, rgba(224, 224, 224, 0.05) 0%, rgba(224, 224, 224, 0.05) 25%,transparent 25%, transparent 100%), radial-gradient(circle at 85% 30%, rgba(224, 224, 224, 0.05) 0%, rgba(224, 224, 224, 0.05) 25%,transparent 25%, transparent 100%)",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  marginLeft: 300,
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    padding: theme.spacing(2),
  },
}));

export default function Home() {
  const params = useParams();
  const id = params?.userId;

  return (
    <DashboardContainer>
      <CustomerLeftSection id={id} />

      <TeamServiceCard />
    </DashboardContainer>
  );
}
