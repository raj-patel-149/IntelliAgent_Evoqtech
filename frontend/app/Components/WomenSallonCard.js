"use client";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Link,
  Divider,
  Button,
  styled,
} from "@mui/material";
import {
  Twitter,
  LinkedIn,
  Instagram,
  Facebook,
  Apple,
  Android,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import Image from "next/image";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(6, 4),
  color: theme.palette.grey[800],
  borderTop: `1px solid ${theme.palette.grey[300]}`,
}));

const FooterSection = styled(Box)(({ theme }) => ({
  maxWidth: 1280,
  margin: "0 auto",
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.1rem",
  marginBottom: theme.spacing(2),
  color: theme.palette.grey[900],
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[700],
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[700],
  marginRight: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

const AppButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  justifyContent: "flex-start",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
  },
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <FooterSection>
        {/* Logo and company info */}
        <Box display="flex" alignItems="center" mb={4}>
          <Image
            src="/icon.png"
            alt="IntelliAgent Logo"
            width={48}
            height={48}
            style={{ marginRight: 16 }}
          />
          <Typography variant="h5" fontWeight={800} color="grey.900">
            IntelliAgent
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Company Links */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Company</FooterTitle>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Press</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
          </Grid>

          {/* Products */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Products</FooterTitle>
            <FooterLink href="#">IntelliAgent Pro</FooterLink>
            <FooterLink href="#">IntelliAgent Teams</FooterLink>
            <FooterLink href="#">IntelliAgent API</FooterLink>
            <FooterLink href="#">Pricing</FooterLink>
            <FooterLink href="#">Features</FooterLink>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Resources</FooterTitle>
            <FooterLink href="#">Documentation</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Community</FooterLink>
            <FooterLink href="#">Webinars</FooterLink>
            <FooterLink href="#">Status</FooterLink>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Connect With Us</FooterTitle>

            <Box display="flex" mb={2}>
              <SocialIcon aria-label="Twitter">
                <Twitter fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="LinkedIn">
                <LinkedIn fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="Instagram">
                <Instagram fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="Facebook">
                <Facebook fontSize="small" />
              </SocialIcon>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Email fontSize="small" sx={{ mr: 1, color: "grey.600" }} />
                <Typography variant="body2" color="grey.700">
                  support@intelliagent.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone fontSize="small" sx={{ mr: 1, color: "grey.600" }} />
                <Typography variant="body2" color="grey.700">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOn
                  fontSize="small"
                  sx={{ mr: 1, color: "grey.600" }}
                />
                <Typography variant="body2" color="grey.700">
                  123 Tech Street, San Francisco, CA
                </Typography>
              </Box>
            </Box>

            <FooterTitle variant="subtitle1">Get the App</FooterTitle>
            <AppButton startIcon={<Apple />} fullWidth>
              Download for iOS
            </AppButton>
            <AppButton startIcon={<Android />} fullWidth>
              Download for Android
            </AppButton>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "grey.300" }} />

        {/* Bottom footer */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="grey.600">
            © {new Date().getFullYear()} IntelliAgent Technologies. All rights
            reserved.
          </Typography>

          <Box mt={{ xs: 2, sm: 0 }}>
            <FooterLink href="#" sx={{ display: "inline", mr: 2 }}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" sx={{ display: "inline", mr: 2 }}>
              Terms of Service
            </FooterLink>
            <FooterLink href="#" sx={{ display: "inline" }}>
              Cookie Policy
            </FooterLink>
          </Box>
        </Box>
      </FooterSection>
    </FooterContainer>
  );
};

export default Footer;
