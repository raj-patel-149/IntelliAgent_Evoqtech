"use client";

import { Modal, Box, Typography, IconButton, Button, Card, Radio } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export default function SavedAddressModal({
  addressModalOpen,
  setAddressModalOpen,
  setAddAddressModalOpen,
  selectedAddress,
  setSelectedAddress,
}) {
  return (
    <Modal open={addressModalOpen} onClose={() => setAddressModalOpen(false)}>
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
          <Typography variant="h6">Saved address</Typography>
          <IconButton onClick={() => setAddressModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Button
          startIcon={<AddIcon />}
          sx={{ color: "#8247e5", fontWeight: "bold", mb: 2 }}
          onClick={() => setAddAddressModalOpen(true)}
        >
          Add another address
        </Button>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="flex-start" p={2}>
            <Radio
              checked={selectedAddress === "home"}
              onChange={() => setSelectedAddress("home")}
            />
            <Box>
              <Typography fontWeight="bold">Home</Typography>
              <Typography variant="body2">
                1204, Kishor Colony Ln, Sorab Nagar, Naranpura, Ahmedabad,
                Gujarat 380013, India
              </Typography>
            </Box>
          </Box>
        </Card>

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "#8247e5", borderRadius: 2 }}
          disabled={!selectedAddress}
          onClick={() => {
            setAddressModalOpen(false);
          }}
        >
          Proceed
        </Button>
      </Box>
    </Modal>
  );
}
