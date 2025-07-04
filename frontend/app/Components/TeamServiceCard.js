"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Rating,
  styled,
  useTheme,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useGetAllTemplatesQuery } from "@/features/teamTemplateApiSlice";
import { useGetUserByIdQuery } from "@/features/apiSlice";

const ServiceCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-5px)",
  },
}));

const ServiceImage = styled(CardMedia)(({ theme }) => ({
  position: "relative",
  height: 180,
  backgroundColor: theme.palette.grey[100],
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  },
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: "0.75rem",
}));

const ServiceContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2.5),
}));

const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[900],
}));

const ServiceDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
  marginBottom: theme.spacing(2),
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const ServiceMeta = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[600],
}));

const ServicePrice = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "#454747",
  fontSize: "1rem",
  marginTop: "auto",
  marginBottom: theme.spacing(1),
}));

const ServiceRequirements = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const RequirementChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[800],
  fontWeight: 500,
  fontSize: "0.7rem",
}));

export default function TeamServiceCard() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const id = params?.userId;

  const { data: allTemplates, isLoading, isError } = useGetAllTemplatesQuery();
  const { data: userData } = useGetUserByIdQuery(id);

  const services = allTemplates?.data;
  const user = userData?.user;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load services
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please try again later
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h3"
        fontWeight={800}
        mb={4}
        color="text.primary"
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Professional Team Services
      </Typography>

      {services?.length > 0 ? (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={service._id}>
              <ServiceCard>
                <ServiceImage
                  image={service?.servicePicture || "/service-placeholder.jpg"}
                  title={service.service_name}
                >
                  <DiscountBadge label="18% OFF" size="small" />
                </ServiceImage>
                <ServiceContent>
                  <Box>
                    <ServiceTitle variant="h6">
                      {service.service_name}
                    </ServiceTitle>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1.5}
                      sx={{ color: theme.palette.grey[600] }}
                    >
                      <Rating
                        value={4.5}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption">(24 reviews)</Typography>
                    </Box>
                    <ServiceDescription variant="body2">
                      {service.description}
                    </ServiceDescription>
                  </Box>

                  <Box mt="auto">
                    <ServiceMeta>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">
                        {service.completion_time}
                      </Typography>
                    </ServiceMeta>

                    <ServiceRequirements>
                      {service.requirements.slice(0, 3).map((req, i) => (
                        <RequirementChip
                          key={i}
                          label={`${req.department} (${req.count})`}
                          size="small"
                        />
                      ))}
                      {service.requirements.length > 3 && (
                        <RequirementChip
                          label={`+${service.requirements.length - 3} more`}
                          size="small"
                        />
                      )}
                    </ServiceRequirements>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      <ServicePrice>₹{service?.basePrice}</ServicePrice>
                      <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={() =>
                          router.push(`/customer/${id}/checkout/${service._id}`)
                        }
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 2.5,
                          py: 1,
                          backgroundColor: "#919492",
                          "&:hover": {
                            backgroundColor: "#629690",
                          },
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Box>
                </ServiceContent>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          textAlign="center"
          py={10}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" gutterBottom color="text.secondary">
            No services available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're working on adding new services. Please check back later!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
