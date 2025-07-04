"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Card,
  Typography,
  Snackbar,
  Alert,
  Box,
  Container,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/features/authApiSlice";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Left Side - Image */}
        <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/forgotpass.png" // Replace with your actual image path
            alt="Forgot Password"
            width={400}
            height={400}
            priority
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>

        {/* Right Side - Form */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: 4,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#ffffff",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 2, color: "#333" }}>
              Forgot Password
            </Typography>

            <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mb: 3 }}>
              Enter your email to receive a password reset link.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                required
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  padding: "10px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                Reset Password
              </Button>

              {errorMessage && (
                <Typography color="error" textAlign="center" mt={2}>
                  {errorMessage}
                </Typography>
              )}
            </form>

            <Box textAlign="center" mt={3}>
              <Button onClick={() => router.push("/login")} sx={{ color: "#1976d2", textTransform: "none" }}>
                Back to Login
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Reset link sent successfully! Check your email.
        </Alert>
      </Snackbar>
    </Container>
  );
}