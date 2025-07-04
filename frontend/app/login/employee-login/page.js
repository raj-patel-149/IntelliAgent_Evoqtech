"use client";
import { useState } from "react";
import { useLoginMutation } from "../../../features/authApiSlice";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Divider,
  Fade,
  Paper,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn, GitHub } from "@mui/icons-material";
import Image from "next/image";

export default function EmployeeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validateForm = () => {
    let valid = true;

    if (!username) {
      setUsernameError("Email is required.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      setUsernameError("Enter a valid email address.");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const res = await login({ email: username, password }).unwrap();
      if (res.success) {
        if (res.role === "agent") {
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/employee/${res.id}/dashboard`);
          }, 700);
        } else {
          setError(
            "This portal is for employees only. Please use the appropriate login."
          );
        }
      }
    } catch (err) {
      setError(err.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: isMobile ? "column-reverse" : "row",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      }}
    >
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 2 : 4,
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 500,
              p: 4,
              borderRadius: 4,
              background: "white",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Image
                src="/icon.png"
                alt="IntelliAgent Logo"
                width={60}
                height={60}
                style={{ borderRadius: "50%" }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                mb: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              IntelliAgent
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", mb: 4, color: "text.secondary" }}
            >
              Employee Portal Login
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mb: 1 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                component="button"
                variant="body2"
                onClick={() => router.push("/forgot-password")}
                sx={{ color: "text.secondary" }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>

            <Divider sx={{ my: 3 }}>or continue with</Divider>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {[
                { icon: <GitHub />, color: "#333" },
                { icon: <LinkedIn />, color: "#0077B5" },
                { icon: <Twitter />, color: "#1DA1F2" },
                { icon: <Facebook />, color: "#4267B2" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    backgroundColor: `${social.color}10`,
                    color: social.color,
                    "&:hover": {
                      backgroundColor: `${social.color}20`,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Fade>
      </Box>

      {/* Right Side - Info & Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 4 : 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome Back, Agent
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Access your work tools and manage your tasks efficiently
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              textAlign: "left",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            {[
              "Task Management",
              "Service Request Handling",
              "Customer Interaction Tools",
              "Performance Tracking",
              "Shift Scheduling",
              "Knowledge Base Access",
            ].map((feature) => (
              <Box
                key={feature}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
                />
                <Typography variant="body1">{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Authentication successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
}
