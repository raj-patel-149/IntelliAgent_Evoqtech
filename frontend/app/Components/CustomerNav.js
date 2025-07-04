"use client";

import { useParams, useRouter } from "next/navigation";
import { Search, User, Bell, ChevronDown } from "lucide-react";
import {
  Avatar,
  Box,
  Badge,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Navbar({ user }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.userId;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const notificationCount = 3;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    router.push(path);
    handleClose();
  };

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left Section - Logo and Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => router.push(`/customer/${id}`)}
        >
          <Image
            src="/icon.png"
            alt="IntelliAgent Logo"
            width={40}
            height={40}
            style={{ borderRadius: "8px", marginRight: "12px" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#2d3748",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            IntelliAgent
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              px: 2,
              py: 1,
              borderRadius: "6px",
              color: "#4a5568",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f7fafc",
                color: "#2d3748",
              },
            }}
            onClick={() => router.push(`/customer/${id}/edit-profile`)}
          >
            Edit Profile
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              px: 2,
              py: 1,
              borderRadius: "6px",
              color: "#4a5568",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f7fafc",
                color: "#2d3748",
              },
            }}
            onClick={() => router.push(`/customer/${id}/services-history`)}
          >
            Services
          </Typography>
        </Box>
      </Box>

      {/* Middle Section - Search (Hidden on Mobile) */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexGrow: 1,
          maxWidth: "500px",
          mx: 4,
          position: "relative",
        }}
      >
        <Box
          component="input"
          placeholder="Search..."
          sx={{
            width: "100%",
            px: 3,
            py: 1.5,
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            outline: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            "&:focus": {
              borderColor: "#cbd5e0",
              boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
            },
          }}
        />
        <Search
          size={18}
          color="#718096"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </Box>

      {/* Right Section - User and Notifications */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Location (Hidden on Mobile) */}
        <Box
          sx={{
            display: { xs: "none", xl: "flex" },
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "6px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Box component="span" sx={{ color: "#4a5568", fontSize: "0.875rem" }}>
            📍 {user?.location || "Navrangpura, Ahmedabad"}
          </Box>
        </Box>

        {/* Notifications */}
        <IconButton
          onClick={() => router.push(`/customer/${id}/notification-page`)}
          sx={{
            backgroundColor: "#f8fafc",
            "&:hover": {
              backgroundColor: "#edf2f7",
            },
          }}
        >
          <Badge
            badgeContent={notificationCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                right: 5,
                top: 5,
                border: "2px solid #ffffff",
              },
            }}
          >
            <Bell size={20} color="#4a5568" />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#f7fafc",
            },
          }}
          onClick={handleClick}
        >
          <Avatar
            src={user?.profilePicture}
            alt={user?.name}
            sx={{
              width: 36,
              height: 36,
              border: "2px solid #e2e8f0",
              backgroundColor: user?.profilePicture ? "transparent" : "#edf2f7",
            }}
          >
            {!user?.profilePicture && <User size={18} color="#718096" />}
          </Avatar>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              mr: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#2d3748", fontWeight: 600, lineHeight: 1.2 }}
            >
              {user?.name || "Guest"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#718096", fontSize: "0.7rem" }}
            >
              {user?.role || "User"}
            </Typography>
          </Box>

          <ChevronDown size={18} color="#718096" />
        </Box>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              minWidth: 200,
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => handleNavigation(`/customer/${id}/edit-profile`)}
            sx={{
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            }}
          >
            <User size={16} style={{ marginRight: "8px", color: "#718096" }} />
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation(`/customer/${id}/services-history`)}
            sx={{
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            }}
          >
            <Search
              size={16}
              style={{ marginRight: "8px", color: "#718096" }}
            />
            My Services
          </MenuItem>
          <Divider sx={{ my: 0.5, borderColor: "#e2e8f0" }} />
          <MenuItem
            onClick={() => handleNavigation("/")}
            sx={{
              color: "#e53e3e",
              "&:hover": {
                backgroundColor: "#fef2f2",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                width: 24,
                display: "inline-flex",
                justifyContent: "center",
                mr: 1,
              }}
            >
              →
            </Box>
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
