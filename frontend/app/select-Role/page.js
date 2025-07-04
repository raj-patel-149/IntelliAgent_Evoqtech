"use client";

import React from "react";

import { useState } from "react";
import { Box, Button, Card, Typography, useTheme } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();
  const theme = useTheme();

  const roles = [
    {
      title: "Manager Portal",
      value: "manager",
      icon: <LaptopMacIcon fontSize="large" />,
      path: "/login/manager-login",
      description: "Access team management tools and analytics dashboard",
      color: theme.palette.primary.main,
    },
    {
      title: "Employee Portal",
      value: "employee",
      icon: <PeopleAltIcon fontSize="large" />,
      path: "/login/employee-login",
      description: "View tasks, submit reports, and track your progress",
      color: theme.palette.secondary.main,
    },
    {
      title: "Customer Portal",
      value: "customer",
      icon: <WorkIcon fontSize="large" />,
      path: "/login/user-login",
      description: "Submit requests and track service progress",
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at 10% 20%, rgba(236, 240, 243, 0.8) 0%, rgba(255, 255, 255, 1) 90%)",
        p: 4,
      }}
    >
      {/* Header with Logo and Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 6,
          gap: 2,
        }}
      >
        <Image
          src="/icon.png"
          alt="IntelliAgent Logo"
          width={80}
          height={80}
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          IntelliAgent
        </Typography>
      </Box>

      {/* Subtitle */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 6,
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: 1.4,
        }}
      >
        Welcome to the Portal
        <br />
        <Typography
          component="span"
          variant="body1"
          sx={{
            color: theme.palette.grey[600],
            display: "block",
            mt: 1,
          }}
        >
          Select your role to continue
        </Typography>
      </Typography>

      {/* Role Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          mb: 8,
          maxWidth: "1200px",
        }}
      >
        {roles.map((role) => (
          <Card
            key={role.value}
            onMouseEnter={() => setHoveredCard(role.value)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => router.push(role.path)}
            sx={{
              width: 300,
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform:
                hoveredCard === role.value ? "translateY(-8px)" : "none",
              boxShadow:
                hoveredCard === role.value
                  ? `0 15px 30px -5px ${role.color}33`
                  : "0 5px 15px rgba(0,0,0,0.05)",
              background: "white",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: role.color,
              },
            }}
            elevation={0}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                color: role.color,
                transition: "all 0.3s ease",
                transform: hoveredCard === role.value ? "scale(1.1)" : "none",
              }}
            >
              {React.cloneElement(role.icon, {
                fontSize: "large",
                sx: { fontSize: 48 },
              })}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                textAlign: "center",
                mb: 2,
              }}
            >
              {role.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                minHeight: "60px",
              }}
            >
              {role.description}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 3,
                borderColor: role.color,
                color: role.color,
                "&:hover": {
                  backgroundColor: `${role.color}10`,
                  borderColor: role.color,
                },
              }}
            >
              Continue
            </Button>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.grey[500],
          textAlign: "center",
          mt: "auto",
          pt: 4,
        }}
      >
        © {new Date().getFullYear()} IntelliAgent. All rights reserved.
      </Typography>
    </Box>
  );
}
