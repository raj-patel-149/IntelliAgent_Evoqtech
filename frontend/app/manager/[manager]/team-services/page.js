"use client";

import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  useGetAcceptedCasesQuery,
  useGetTeamCasesQuery,
} from "@/features/caseApiSlice";
import { setService } from "@/features/serviceSlice";
import {
  Place as PlaceIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,




  ArrowForward as ArrowForwardIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import Link from "next/link";
import CaseSummaryCard from "@/app/Components/CaseSummaryCard";
import { useCallback } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

const statusColors = {
  waitingForApproval: "error",
  waitingToStart: "primary",
  inProgress: "info",
  completed: "success",
  halted: "warning",
  missed: "error",
};

const statusIcons = {
  waitingForApproval: <HourglassBottomIcon />,
  waitingToStart: <HourglassBottomIcon />,
  inProgress: <HourglassBottomIcon />,
  completed: <CheckCircleOutlineIcon />,
  halted: <PauseCircleOutlineIcon />,
  missed: <HighlightOffIcon />,
};

export default function AcceptedServices() {
  const router = useRouter();
  const params = useParams();
  const id = params?.manager;

  const { data: acceptedCases, isLoading, isError } = useGetTeamCasesQuery();

  const navigateToService = useCallback(
    (serviceId) => {
      router.push(`/manager/${id}/team-services/${serviceId}`);
    },
    [router, id]
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3, backgroundColor: "grey.50", minHeight: "100vh" }}>
        <Skeleton
          variant="text"
          width="30%"
          height={60}
          sx={{
            mb: 4,
            bgcolor: "grey.300",
            borderRadius: 1,
          }}
        />
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                  borderRadius: 3,
                  bgcolor: "grey.200",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "grey.50",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HighlightOffIcon
          color="error"
          sx={{
            fontSize: 80,
            mb: 3,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Typography variant="h5" color="error" gutterBottom>
          Error loading services
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please try again later
        </Typography>
      </Box>
    );
  }

  if (!acceptedCases || acceptedCases.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "grey.50",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckCircleOutlineIcon
          color="disabled"
          sx={{
            fontSize: 80,
            mb: 3,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No services assigned to your team
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          When services are assigned, they will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "grey.50",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={5}
        sx={{
          color: "grey.800",
          position: "relative",
          "&:after": {
            content: '""',
            display: "block",
            width: "80px",
            height: "4px",
            backgroundColor: "primary.main",
            mt: 2,
          },
        }}
      >
        Team Services
      </Typography>

      <Grid container spacing={4}>
        {acceptedCases.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
                backgroundColor: "common.white",
                border: "1px solid",
                borderColor: "grey.200",
                "&:hover": {
                  boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                  borderColor: "primary.light",
                },
              }}
              onClick={(event) => {
                event.stopPropagation();
                navigateToService(service._id);
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                  "&:last-child": {
                    pb: 3,
                  },
                }}
              >
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "grey.700",
                        color: "common.white",
                        width: 60,
                        height: 60,
                        fontSize: "1.75rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {service.service.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "grey.800" }}
                      >
                        {service.service}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={service.service_status
                      .split(/(?=[A-Z])/)
                      .join(" ")
                      .toUpperCase()}
                    color={statusColors[service.service_status] || "default"}
                    icon={statusIcons[service.service_status]}
                    sx={{
                      alignSelf: "flex-start",
                      px: 1.5,
                      py: 1,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      bgcolor: `${statusColors[service.service_status]}.light`,
                      color: `${statusColors[service.service_status]}.dark`,
                    }}
                  />

                  <Divider
                    sx={{
                      borderColor: "grey.200",
                      my: 1,
                    }}
                  />

                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <PersonIcon
                        fontSize="small"
                        sx={{
                          color: "grey.500",
                          mt: 0.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "grey.600",
                            fontWeight: "medium",
                            display: "block",
                          }}
                        >
                          Customer
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "grey.800",
                            fontWeight: "medium",
                          }}
                        >
                          {service.sender}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <EventIcon
                        fontSize="small"
                        sx={{
                          color: "grey.500",
                          mt: 0.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "grey.600",
                            fontWeight: "medium",
                            display: "block",
                          }}
                        >
                          Date & Time
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "grey.800",
                            fontWeight: "medium",
                          }}
                        >
                          {service.date} at {service.time}
                        </Typography>
                      </Box>
                    </Box>

                    {/* <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <PlaceIcon
                        fontSize="small"
                        sx={{
                          color: "grey.500",
                          mt: 0.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "grey.600",
                            fontWeight: "medium",
                            display: "block",
                          }}
                        >
                          Location
                        </Typography>
                        <Link
                          href={`https://www.google.com/maps?q=${encodeURIComponent(
                            service.location
                          )}`}
                          target="_blank"
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: "primary.main",
                              fontWeight: "medium",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {service.location}
                          </Typography>
                        </Link>
                      </Box>
                    </Box> */}

                    {service.teamWork === "yes" && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mt: 1,
                        }}
                      >
                        <GroupIcon
                          fontSize="small"
                          sx={{
                            color: "grey.500",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "primary.main",
                            fontWeight: "medium",
                          }}
                        >
                          {service.teamServiceDetailsId
                            ? "Team Assigned ✅"
                            : "Team Not Assigned ❌"}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {service.description && (
                    <>
                      <Divider
                        sx={{
                          borderColor: "grey.200",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "grey.600",
                            fontWeight: "medium",
                            display: "block",
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "grey.700",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.6,
                          }}
                        >
                          {service.description}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>

              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "grey.100",
                  borderTop: "1px solid",
                  borderColor: "grey.200",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "grey.600",
                    fontWeight: "medium",
                  }}
                >
                  Last updated:{" "}
                  {new Date(service.updatedAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.main",
                    fontWeight: "bold",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  View Details{" "}
                  <ArrowForwardIcon sx={{ ml: 0.5, fontSize: "1rem" }} />
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
