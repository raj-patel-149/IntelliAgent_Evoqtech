import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const StaticPaymentOptions = () => {
  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 3,
        mb: 3,
        p: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Select payment method
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Amount to pay: ₹3,346
      </Typography>

      <Paper elevation={1} sx={{ mb: 2 }}>
        <Typography sx={{ p: 1.5, fontWeight: 500 }}>Cards</Typography>
        <Divider />
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary="Add new card" />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={1} sx={{ mb: 2 }}>
        <Typography sx={{ p: 1.5, fontWeight: 500 }}>UPI</Typography>
        <Divider />
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Add a new UPI ID" />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={1} sx={{ mb: 2 }}>
        <Typography sx={{ p: 1.5, fontWeight: 500 }}>Netbanking</Typography>
        <Divider />
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Netbanking" />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={1} sx={{ mb: 2 }}>
        <Typography sx={{ p: 1.5, fontWeight: 500 }}>Pay after service</Typography>
        <Divider />
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Pay online after service" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Pay with cash after service" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default StaticPaymentOptions;
