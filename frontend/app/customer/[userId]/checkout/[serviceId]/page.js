"use client";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  IconButton,
  Modal,
  TextField,
  useTheme,
  Radio,
  Paper,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Badge,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import debounce from "lodash.debounce";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useCalculatePriceMutation } from "@/features/priceApiSlice";
import { useGetSkillByIdQuery } from "@/features/skillApiSlice";
import {
  useGetSkillsByDepartmentQuery,
  useGetUserByIdQuery,
} from "@/features/userApiSlice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/bookingApiSlice";
import { useAddCaseMutation } from "@/features/caseApiSlice";
import { useGetTeamServiceTemplateByIdQuery } from "@/features/teamTemplateApiSlice";
import {
  teamServiceApi,
  useGetTeamServiceByIdQuery,
} from "@/features/teamServiceApiSlice";

const steps = ["Service", "Time & Address", "Payment"];

export default function CheckoutPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId;
  const sid = params?.serviceId;

  const [activeStep, setActiveStep] = useState(0);
  const mapRef = useRef(null);

  const [services, setServices] = useState([]);
  const pathname = window.location.pathname;
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [slotOpen, setSlotOpen] = useState(false);

  const [selectedTime, setSelectedTime] = useState();

  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 23.0219411,
    lng: 72.5090304,
  });
  const [currentAddress, setCurrentAddress] = useState("");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    flat: "",
    landmark: "",
    name: "",
    label: "",
  });

  const [calculatePrice, { isLoading }] = useCalculatePriceMutation();
  const { data: userData } = useGetUserByIdQuery(userId);
  const {
    data: currentServiceData,
    isLoading1,
    isError,
  } = useGetSkillByIdQuery(sid);
  const { data: teamserviceData } = useGetTeamServiceByIdQuery(sid);
  let currentService = currentServiceData
    ? currentServiceData
    : teamserviceData;
  const {
    data: additionalServices,
    isLoading2,
    isError2,
  } = useGetSkillsByDepartmentQuery(currentService?.department);

  const [addCase] = useAddCaseMutation();
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(currentService?.totalPrice);
  const [updatedPrice, setUpdatedPrice] = useState(currentService?.totalPrice);
  const user = userId;
  const caseId = sid;

  useEffect(() => {
    if (currentService) {
      setUpdatedPrice(currentService.totalPrice);
    }
  }, []);

  useEffect(() => {
    setFinalPrice(updatedPrice * quantity);
  }, [updatedPrice]);

  useEffect(() => {
    if (additionalServices) {
      const filteredServices = additionalServices.filter(
        (service) => service._id !== sid
      );
      setServices(filteredServices);
    }
  }, [additionalServices]);

  useEffect(() => {
    setFinalPrice(updatedPrice * quantity);
  }, [quantity]);

  const totalPrice = currentService?.totalPrice;

  const handlePayment = async () => {
    const { skill_Name } = currentService;

    try {
      const { data: order } = await createOrder({
        amount: finalPrice,
        currency: "INR",
        user,

        service: skill_Name,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: order?.currency,
        name: "Service Booking",
        description: `Booking for ${skill_Name}`,
        order_id: order?.id,
        handler: async function (response) {
          try {
            const result = await verifyPayment({
              ...response,
              user,
              service: skill_Name,
              amount: finalPrice,
              case: caseId,
            }).unwrap();

            if (result.success) {
              await generateCase({
                formData,
                user: userData?.user,
                selectedTime,
                currentService,
                quantity,
              });

              window.location.href = `${pathname}/booking-success?service=${skill_Name}&amount=${finalPrice}&paymentId=${response.razorpay_payment_id}`;
            }
          } catch (error) {
            console.error("Verification error:", error);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: theme.palette.primary.main,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const generateCase = async (data) => {
    try {
      const createCase = await addCase(data).unwrap();
      console.log("Case created:", createCase);
    } catch (error) {
      console.error("Error generating case:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location.");
        }
      );
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setIsFetchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setCurrentAddress(data.display_name);
        setFormData((prevData) => ({
          ...prevData,
          location: data.display_name,
        }));
      } else {
        setCurrentAddress("Address not found");
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
      setCurrentAddress("Address not found");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const debouncedReverseGeocode = useRef(
    debounce((lat, lng) => {
      reverseGeocode(lat, lng);
    }, 500)
  ).current;

  useEffect(() => {
    if (mapModalOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.setView([latitude, longitude], 16);
            }
            reverseGeocode(latitude, longitude);
          }, 300);
        },
        (error) => {
          console.error("Location error:", error);
          setCurrentAddress("Unable to get current location.");
        }
      );
    }
  }, [mapModalOpen]);

  useEffect(() => {
    getLocation();
  }, []);

  const handlePriceCheck = async () => {
    try {
      const [lat, lng] = mapCenter;
      const res = await calculatePrice({ lat, lng, id: sid }).unwrap();
      setUpdatedPrice(res.resp.totalPrice);
    } catch (err) {
      console.error("Failed to calculate price:", err);
      alert("Failed to calculate service charge. Please try again.");
    }
  };

  const MapEvents = ({ setMapCenter, debouncedReverseGeocode }) => {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        setMapCenter([center.lat, center.lng]);
        debouncedReverseGeocode(center.lat, center.lng);
      },
    });
    return null;
  };

  const handleServiceClick = (service) => {
    router.push(`/customer/${userId}/checkout/${service._id}`);
  };

  const handleNext = () => {
    if (activeStep === 0 && currentAddress && selectedTime) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* LEFT SIDE - Checkout Form */}
          <Grid item xs={12} md={7}>
            <Card
              variant="outlined"
              sx={{ p: 3, mb: 3, backgroundColor: "#fafafa" }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={3}
                color="text.primary"
              >
                Booking Details
              </Typography>

              {/* Service Selection */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#e0e0e0", mr: 2 }}>
                    <CheckCircleIcon color="primary" />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Service Selected
                  </Typography>
                </Box>
                <Paper
                  elevation={0}
                  sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      variant="rounded"
                      src="/sallon2.png"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box flexGrow={1}>
                      <Typography fontWeight="bold">
                        {currentService?.skill_Name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentService?.description}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold">₹{finalPrice}</Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Address Section */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: activeStep >= 1 ? "#e0e0e0" : "#f5f5f5",
                      mr: 2,
                    }}
                  >
                    {activeStep >= 1 ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <LocationOnIcon color="action" />
                    )}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Delivery Address
                  </Typography>
                </Box>

                {currentAddress ? (
                  <Paper
                    elevation={0}
                    sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  >
                    <Typography fontWeight="medium">
                      {formData.flat && `${formData.flat}, `}
                      {formData.landmark && `${formData.landmark}, `}
                      {currentAddress}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => setAddAddressModalOpen(true)}
                    >
                      Change Address
                    </Button>
                  </Paper>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LocationOnIcon />}
                    sx={{ py: 2, borderStyle: "dashed" }}
                    onClick={() => setAddAddressModalOpen(true)}
                  >
                    Add Delivery Address
                  </Button>
                )}
              </Box>

              {/* Time Slot Section */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: activeStep >= 1 ? "#e0e0e0" : "#f5f5f5",
                      mr: 2,
                    }}
                  >
                    {activeStep >= 1 ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <AccessTimeIcon color="action" />
                    )}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Time Slot
                  </Typography>
                </Box>

                {selectedTime ? (
                  <Paper
                    elevation={0}
                    sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                  >
                    <Typography fontWeight="medium">
                      {dayjs(selectedTime).format("dddd, MMMM D, YYYY")}
                    </Typography>
                    <Typography>
                      {dayjs(selectedTime).format("h:mm A")}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => setSlotOpen(true)}
                    >
                      Change Time
                    </Button>
                  </Paper>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AccessTimeIcon />}
                    sx={{ py: 2, borderStyle: "dashed" }}
                    onClick={() => setSlotOpen(true)}
                  >
                    Select Time Slot
                  </Button>
                )}
              </Box>

              {/* Navigation Buttons */}
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disabled={!currentAddress || !selectedTime}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Complete Order" : "Next"}
                </Button>
              </Box>
            </Card>

            {/* Payment Section - Only shown on last step */}
            {activeStep === 2 && (
              <Card
                variant="outlined"
                sx={{ p: 3, backgroundColor: "#fafafa" }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: "#e0e0e0", mr: 2 }}>
                    <CreditCardIcon color="primary" />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Payment Method
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Select your preferred payment method
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ py: 2, borderColor: "#e0e0e0" }}
                    >
                      UPI
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ py: 2, borderColor: "#e0e0e0" }}
                    >
                      Credit Card
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ py: 2, borderColor: "#e0e0e0" }}
                    >
                      Debit Card
                    </Button>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePayment}
                  sx={{ py: 2, mt: 2 }}
                >
                  Pay ₹{finalPrice}
                </Button>
              </Card>
            )}
          </Grid>

          {/* RIGHT SIDE - Order Summary */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ p: 3, backgroundColor: "#fafafa" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={3}
                color="text.primary"
              >
                Order Summary
              </Typography>

              {/* Service Item */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1">
                  {currentService?.skill_Name} × {quantity}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₹{finalPrice}
                </Typography>
              </Box>

              {/* Quantity Controls */}
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <IconButton
                  size="small"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Recommended Services */}
              <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                Frequently added together
              </Typography>
              <Box display="flex" gap={2} overflow="auto" pb={1} mb={3}>
                {services?.map((service, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 1.5,
                      minWidth: 140,
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 2,
                        borderColor: "primary.main",
                      },
                    }}
                    variant="outlined"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Box
                      height={80}
                      mb={1}
                      component="img"
                      src="/sallon2.png"
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        borderRadius: 1,
                      }}
                    />
                    <Typography fontSize={13} noWrap>
                      {service.skill_Name}
                    </Typography>
                    <Typography fontSize={13} fontWeight="bold">
                      ₹{service.basePrice}
                    </Typography>
                  </Card>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Preferences */}
              <Box display="flex" alignItems="center" mb={3}>
                <Checkbox defaultChecked color="primary" />
                <Typography variant="body2">
                  Avoid calling before reaching the location
                </Typography>
              </Box>

              {/* Price Breakdown */}
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{finalPrice}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Service Fee</Typography>
                  <Typography variant="body2">₹0</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Estimated Taxes</Typography>
                  <Typography variant="body2">₹0</Typography>
                </Box>
              </Box>

              {/* Total Price */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{finalPrice}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayment}
                sx={{ py: 1.5 }}
              >
                Place Order
              </Button>
            </Card>

            {/* Cancellation Policy */}
            <Card
              variant="outlined"
              sx={{ p: 3, mt: 3, backgroundColor: "#fafafa" }}
            >
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Cancellation Policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free cancellations if done more than 12 hrs before the service
                or if a professional isn't assigned. A fee will be charged
                otherwise.
              </Typography>
              <Button size="small" sx={{ mt: 1 }}>
                Read full policy
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Address Selection Modal */}
      <Modal
        open={addAddressModalOpen}
        onClose={() => setAddAddressModalOpen(false)}
      >
        <Box
          sx={{
            width: 500,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            mx: "auto",
            my: "10%",
            outline: "none",
            boxShadow: 24,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Select Address
            </Typography>
            <IconButton onClick={() => setAddAddressModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            placeholder="Search for your location/society/apartment"
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 1, color: "#aaa" }}>
                  🔍
                </Box>
              ),
              sx: { borderRadius: 2, backgroundColor: "#f5f5f5" },
            }}
          />

          <Button
            fullWidth
            startIcon={<LocationOnIcon />}
            sx={{
              color: "primary.main",
              textTransform: "none",
              justifyContent: "flex-start",
              my: 2,
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
              py: 1.5,
            }}
            onClick={() => {
              setSearchModalOpen(false);
              setAddAddressModalOpen(false);
              setMapModalOpen(true);
              getLocation();
            }}
          >
            Use current location
          </Button>
        </Box>
      </Modal>

      {/* Map Modal */}
      <Modal open={mapModalOpen} onClose={() => setMapModalOpen(false)}>
        <Box
          sx={{
            width: "90vw",
            height: "90vh",
            mx: "auto",
            my: "5vh",
            display: "flex",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "white",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setMapModalOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1500,
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Left Side: Map */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <MapContainer
              center={mapCenter}
              zoom={16}
              scrollWheelZoom={true}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <MapEvents
                setMapCenter={setMapCenter}
                debouncedReverseGeocode={debouncedReverseGeocode}
              />
            </MapContainer>
            {/* Pin icon in center */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -100%)",
                fontSize: "2rem",
                zIndex: 1000,
              }}
            >
              <LocationOnIcon color="primary" sx={{ fontSize: 48 }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: "14px",
                boxShadow: 2,
              }}
            >
              Place the pin accurately on map
            </Box>
          </Box>

          {/* Right Side: Address & Form */}
          <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Confirm your address
            </Typography>

            {isFetchingAddress ? (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} />
                <Typography>Fetching address...</Typography>
              </Box>
            ) : (
              <>
                <Typography variant="body1" mb={3}>
                  {currentAddress || "No address found"}
                </Typography>

                <TextField
                  fullWidth
                  label="House/Flat Number*"
                  sx={{ mb: 2 }}
                  value={formData.flat}
                  onChange={(e) =>
                    setFormData({ ...formData, flat: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Landmark (Optional)"
                  sx={{ mb: 2 }}
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setMapModalOpen(false);
                    handlePriceCheck();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Calculating..." : "Confirm Address"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Time Slot Modal */}
      <Modal open={slotOpen} onClose={() => setSlotOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Select your preferred date & time
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Pick date and time"
                value={selectedTime}
                format="DD/MM/YYYY hh:mm A"
                onChange={(newValue) => {
                  setSelectedTime(newValue);
                }}
                sx={{ width: "100%" }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={() => setSlotOpen(false)}
            disabled={!selectedTime}
          >
            Confirm Time Slot
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
