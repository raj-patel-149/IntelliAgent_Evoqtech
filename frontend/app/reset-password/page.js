"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Card,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  useAcceptEmailMutation,
  useGetUserByEmailQuery,
  useResetPasswordMutation,
} from "@/features/apiSlice";
import { useRouter } from "next/navigation";

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [expireLink, setExpireLink] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();
  const [acceptEmail] = useAcceptEmailMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { data } = useGetUserByEmailQuery(`email/${email}`);
  const user = data?.user;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded?.exp < currentTime) {
          setExpireLink(true);
          showSnackbar("Link has expired. Please request a new one.", "error");
        }

        if (decoded?.email) {
          setEmail(decoded.email);
        } else {
          setError("Invalid token payload.");
          showSnackbar("Invalid token format.", "error");
        }
      } catch (err) {
        console.error("JWT Decoding Error:", err);
        setError("Invalid or expired token. Please request a new reset link.");
        showSnackbar("Invalid or expired token.", "error");
      }
    } else {
      setError("No token found. Please check the reset link.");
      showSnackbar("No token found in URL.", "error");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      acceptEmail(token);
    }
  }, [token, acceptEmail]);

  useEffect(() => {
    if (user?.user_Status === "Email sent") {
      showSnackbar("Thank you for accepting the invitation!", "success");
    }
  }, [user]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (formData) => {
    try {
      await resetPassword({ email, password: formData.password }).unwrap();
      showSnackbar(
        "Password reset successful! Redirecting to login...",
        "success"
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      showSnackbar("Password reset failed. Please try again.", "error");
    }
  };

  if (user?.user_Status === "verified") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          p: 2,
        }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            textAlign: "center",
            maxWidth: 500,
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Password Already Set
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You have already set your password. Please log in with your
            credentials.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => router.push("/login")}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {expireLink ? (
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            textAlign: "center",
            maxWidth: 500,
            width: "100%",
            bgcolor: "error.light",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, color: "error.contrastText" }}
          >
            Link Expired
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "error.contrastText" }}
          >
            This password reset link has expired. Please request a new one.
          </Typography>
        </Card>
      ) : (
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            maxWidth: 500,
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
              color: "primary.main",
            }}
          >
            Reset Password
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>
              Reset password for: <strong>{email}</strong>
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": { bgcolor: "action.disabled" },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default function Page() {
  return (
    <React.Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordPage />
    </React.Suspense>
  );
}
