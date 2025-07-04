"use client";

import Image from "next/image";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Icon,
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import {
  useGetDepartmentsQuery,
  useGetSkillsByDepartmentQuery,
} from "@/features/userApiSlice";
import { useGetUserByIdQuery } from "@/features/apiSlice";
import { useAddCaseMutation } from "@/features/caseApiSlice";
import ServiceCard from "../customer/components/ServiceCard";
import TeamServiceCard from "./TeamServiceCard";

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

export default function HomeServices({ id }) {
  const [open, setOpen] = useState(false); // State to control the modal visibility
  const [filteredServices, setFilteredServices] = useState([]); // State to hold the clicked service data
  const router = useRouter();

  const params = useParams();
  const department = "all";
  const userId = params?.userId;

  const {
    data: departments,
    isLoading: isLoading1,
    isError: isError1,
  } = useGetDepartmentsQuery();
  const {
    data: services,
    isLoading,
    isError,
  } = useGetSkillsByDepartmentQuery(department);
  const { data: userData } = useGetUserByIdQuery(userId);
  const user = userData?.user;
  const [addCase, { isLoading: isSubmitting }] = useAddCaseMutation();
  console.log("departments", departments?.departments);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    const filteredServices = services?.filter(
      (service) => service.department === "saloon"
    );
    setFilteredServices(filteredServices);
  }, [services]);
  // Initialize useRouter for navigation
  const handleClickimage = (dept) => {
    const filteredServices = services?.filter(
      (service) => service.department === dept
    );
    setFilteredServices(filteredServices);
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box px={{ xs: 4, sm: 6, md: 10 }} py={{ xs: 4, sm: 5, md: 6 }}>
      <SectionTitle variant="h4" fontWeight="bold">
        Home services at your doorstep
      </SectionTitle>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left Section - Services */}
        <Grid item xs={12} md={4}>
          <Box bgcolor="grey.100" p={3} borderRadius={2} boxShadow={2}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              What are you looking for?
            </Typography>
            <Grid
              container
              spacing={2}
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
            >
              {departments?.departments?.map((service, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Card
                    elevation={1}
                    onClick={() => handleClickimage(service)}
                    style={{ cursor: "pointer" }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                      }}
                    >
                      <Image
                        src="/womensallon.png"
                        alt={service}
                        width={50}
                        height={50}
                        // onClick={() => handleClickimage(service.name)}
                        style={{ cursor: "pointer" }}
                      />
                      <Typography variant="body2" textAlign="center" mt={1}>
                        {service}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={8}>
          <Box
            px={{ xs: 2, sm: 4, md: 6 }}
            py={4}
            sx={{ height: "70vh", overflowY: "scroll" }}
          >
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh"
              >
                <CircularProgress color="primary" />
              </Box>
            ) : isError ? (
              <Typography variant="h6" color="error" align="center">
                Error fetching services
              </Typography>
            ) : filteredServices?.length > 0 ? (
              <Grid container spacing={3}>
                {filteredServices.map((service) => (
                  <Grid item xs={12} md={6} key={service._id}>
                    <ServiceCard service={service} id={user?._id} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
                No services available
              </Typography>
            )}

            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
