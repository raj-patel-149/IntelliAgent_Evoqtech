import { Card, Box, Typography, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";

const ServiceCardContainer = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2.5),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: theme.palette.common.white,
  border: "1px solid rgba(0,0,0,0.05)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    borderColor: theme.palette.grey[300],
  },
}));

const ServiceImage = styled("img")({
  width: 100,
  height: 100,
  borderRadius: "12px",
  objectFit: "cover",
  marginBottom: "8px",
  border: "1px solid rgba(0,0,0,0.05)",
});

const BookButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "6px 16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  border: `1px solid ${theme.palette.grey[300]}`,
  color: theme.palette.grey[800],
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    boxShadow: "none",
  },
}));

const ServiceCard = ({ service, id }) => {
  const router = useRouter();

  return (
    <ServiceCardContainer>
      {/* Left Side */}
      <Box sx={{ flex: 1, pr: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="grey.800">
          {service.skill_Name}
        </Typography>
        <Box display="flex" alignItems="center" mt={0.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "warning.main",
              mr: 1,
            }}
          >
            ⭐
          </Box>
          <Typography variant="body2" color="grey.600">
            4.91 (19K reviews)
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="grey.600">
            Starts at{" "}
            <Typography component="span" fontWeight="bold" color="grey.800">
              ₹{service.basePrice}
            </Typography>
          </Typography>
          <Typography variant="body2" color="grey.600" mt={0.5}>
            Duration:{" "}
            <Typography component="span" fontWeight="bold" color="grey.800">
              {service.duration.value} {service.duration.unit}
            </Typography>
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="primary.main"
          mt={1.5}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View details
        </Typography>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pl: 1,
        }}
      >
        <ServiceImage
          src={service.image || "/sallon1.png"}
          alt={service.skill_Name}
        />
        <BookButton
          variant="outlined"
          onClick={() => router.push(`/customer/${id}/checkout/${service._id}`)}
        >
          Book Now
        </BookButton>
      </Box>
    </ServiceCardContainer>
  );
};

export default ServiceCard;
