"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignupMutation } from "../../features/authApiSlice";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  useMediaQuery,
} from "@mui/material";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile_Number: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState("");
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    if (!window.google || !inputRef.current) return;
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["geocode"] }
    );
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place?.formatted_address) {
        setLocation(place.formatted_address);
      }
    });
  };

  const onSubmit = async (data) => {
    if (!location) {
      setErrorMessage("Location is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("mobile_Number", data.mobile_Number);
      formData.append("location", location);
      console.log("hello from signup page", formData);

      const res = await signup(formData).unwrap();
      console.log("hello from signup page after signup:-", res);

      if (res.success) {
        router.push("/login/user-login");
      }
    } catch (err) {
      setErrorMessage(err.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        padding: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 450,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 3,
          padding: { xs: 3, sm: 4, md: 5 },
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#333" }}>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {["name", "email", "password", "mobile_Number"].map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field.replace("_", " ").toUpperCase()}
              type={field === "password" ? "password" : "text"}
              variant="outlined"
              margin="normal"
              {...register(field)}
              error={!!errors[field]}
              helperText={errors[field]?.message}
            />
          ))}
          {errors.name && (
            <Typography color="error">{errors.name.message}</Typography>
          )}
          {errors.email && (
            <Typography color="error">{errors.email.message}</Typography>
          )}
          {errors.password && (
            <Typography color="error">{errors.password.message}</Typography>
          )}
          {errors.mobile_Number && (
            <Typography color="error">
              {errors.mobile_Number.message}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center", color: "#555" }}>
            Have an account?{" "}
            <Link
              onClick={() => router.push("/login")}
              sx={{ cursor: "pointer" }}
            >
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}
