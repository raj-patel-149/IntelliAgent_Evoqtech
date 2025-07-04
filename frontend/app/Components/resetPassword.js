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
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  useAcceptEmailMutation,
  useGetUserByEmailQuery,
  useResetPasswordMutation,
} from "@/features/apiSlice"; // Import the API function
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [acceptEmail] = useAcceptEmailMutation();
  const router = useRouter();
  const [expireLink, setExpireLink] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decoded?.exp < currentTime) {
          setExpireLink(true);
        }
        if (decoded?.email) {
          setEmail(decoded.email);
        } else {
          setError("Invalid token payload.");
        }
      } catch (err) {
        console.error("JWT Decoding Error:", err);
        setError("Invalid or expired token. Please request a new reset link.");
      }
    } else {
      setError("No token found. Please check the reset link.");
    }
  }, [token]);

  const { data } = useGetUserByEmailQuery(`email/${email}`);
  const user = data?.user;
  console.log(user?.user_Status);

  useEffect(() => {
    if (token) {
      acceptEmail(token);
    }
  }, [token, acceptEmail]);
  useEffect(() => {
    if (user?.user_Status === "Email sent") {
      setOpenSnackbar(true);
    }
  }, [user]); // Runs only when `user` changes

  const [resetPassword, { isLoading, isError, isSuccess }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await resetPassword({ email, password: data.password }).unwrap();
      alert("Password reset successful!");
      router.push("/login");
    } catch (err) {
      alert("Your link is expire ");
    }
  };

  if (user?.user_Status === "verified") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-[30px] bg-[#b1f0cb] p-10 rounded-3xl font-[700]">
          <p>You already set the password</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "200px", backgroundColor: "#5a80f2" }}
              onClick={() => router.push("/login")}
            >
              Login Now
            </Button>
          </div>
        </h1>
      </div>
    );
  }
  // if (
  //   user?.user_Status === "Email accepted" ||
  //   (user?.user_Status === "Password not set" && expireLink)
  // ) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
  //       <h1 className="text-[30px] bg-[#b1f0cb] p-10 rounded-3xl font-[700] text-center">
  //         <p>
  //           Thank you for accept our invitation . You can click on forgot
  //           password button to gate your password.
  //         </p>
  //         <div className="mt-4 flex justify-center space-x-4">
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             sx={{ width: "200px", backgroundColor: "#5a80f2" }}
  //             onClick={() => router.push("/forgot-password")}
  //           >
  //             Forgot Password
  //           </Button>
  //         </div>
  //       </h1>
  //     </div>
  //   );
  // }
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thank you for accepting the invitation!
        </Alert>
      </Snackbar>

      {expireLink ? (
        <h1 className="text-[30px] bg-[#fa9ba5] p-10 rounded-3xl font-[700]">
          Link was expired. Please request a new reset link.{" "}
        </h1>
      ) : (
        <Card className="w-full max-w-md p-6 shadow-xl bg-white rounded-lg">
          <Typography
            variant="h4"
            className="text-center font-bold text-gray-800"
          >
            Welcome to Reset Password
          </Typography>

          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            `Reset password for: ${email}`
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <TextField
              label="New Password"
              type="password"
              fullWidth
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            {isError && (
              <Typography color="error">
                Failed to reset password. Try again.
              </Typography>
            )}
            {isSuccess && (
              <Typography color="success">
                Password reset successfully!
              </Typography>
            )}
          </form>
        </Card>
      )}
    </div>
  );
};

export default ResetPasswordPage;
