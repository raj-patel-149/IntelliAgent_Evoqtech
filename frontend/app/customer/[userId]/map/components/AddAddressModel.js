"use client";
import React from "react";
import {
  Modal,
  Box,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

const AddAddressModal = ({
  open,
  onClose,
  setMapModalOpen,
  setSearchModalOpen,
  getLocation,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
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
          <IconButton onClick={onClose} sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Button
          fullWidth
          startIcon={<LocationOnIcon />}
          sx={{
            color: "#8247e5",
            textTransform: "none",
            justifyContent: "flex-start",
            mb: 2,
            fontWeight: "bold",
          }}
          onClick={() => {
            setSearchModalOpen(false);
            setMapModalOpen(true);
            getLocation();
          }}
        >
          Use current location
        </Button>

        <Box mt={4} textAlign="center" color="#aaa" fontSize="12px">
          powered by Google
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAddressModal;
