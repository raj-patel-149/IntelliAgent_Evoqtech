"use client";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
const MapModal = ({
  sendAddress,
  mapCenter,
  isFetchingAddress,
  onClose,
  mapRef,
  currentAddress,
  setMapModalOpen,
  handlePriceCheck,
  formData,
  setFormData,
  isLoading,
  setMapCenter,
  debouncedReverseGeocode,
}) => {


  return (
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
          📍
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "4px 12px",
            borderRadius: 8,
            fontSize: "12px",
            boxShadow: 2,
          }}
        >
          Place the pin accurately on map
        </Box>
      </Box>

      {/* Right Side: Address & Form */}
      <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          {isFetchingAddress
            ? "Fetching address..."
            : currentAddress || "No address found"}
        </Typography>

        <TextField
          fullWidth
          label="House/Flat Number*"
          sx={{ mb: 2 }}
          value={formData.flat}
          onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
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
          sx={{ bgcolor: "#8247e5", mt: 2 }}
          onClick={() => {
            handlePriceCheck();
            sendAddress(formData);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Calculating..." : "Save and proceed to slots"}
        </Button>
      </Box>
    </Box>
  );
};

export default MapModal;
