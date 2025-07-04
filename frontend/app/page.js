"use client";
import { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  Avatar,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Groups,
  Person,
  Business,
  Assignment,
  Notifications,
  LocationOn,
  Schedule,
  CheckCircle,
  Star,
  Work,
  ManageAccounts,
  Security,
  TrendingUp,
  Email,
  Lock,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

const FeatureCard = ({ icon, title, description, color = "primary" }) => (
  <Card
    sx={{
      height: "100%",
      p: 3,
      borderRadius: 2,
      boxShadow: "none",
      border: "1px solid",
      borderColor: "divider",
      transition: "all 0.3s ease",
      backgroundColor: "background.paper",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 3,
        borderColor: `${color}.main`,
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          mr: 2,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Card>
);

const RoleSection = ({ icon, title, features, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: 3,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
      <Avatar
        sx={{
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          mr: 2,
          width: 56,
          height: 56,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
        {title}
      </Typography>
    </Box>
    <Grid container spacing={3}>
      {features.map((feature, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <CheckCircle
              sx={{ color: `${color}.main`, mr: 2, mt: "4px", fontSize: 20 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

const FeatureCarouselItem = ({ item }) => (
  <Box
    sx={{
      position: "relative",
      height: 400,
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      component="img"
      src={item.image}
      alt={item.title}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(0.7)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        p: 4,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        color="common.white"
        gutterBottom
      >
        {item.title}
      </Typography>
      <Typography variant="body1" color="rgba(255,255,255,0.9)">
        {item.description}
      </Typography>
    </Box>
  </Box>
);

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manager");
  const navigateToService = useCallback(() => {
    router.push(`/select-Role`);
  }, [router]);

  const carouselItems = [
    {
      image: "/mainimage.jpeg",
      title: "Workflow Automation",
      description:
        "Streamline complex service workflows with automated task assignments and notifications",
    },
    {
      image: "/mainimage.jpeg",
      title: "Role-Based Access",
      description:
        "Secure system with granular permissions for managers, employees and customers",
    },
    {
      image: "/mainimage.jpeg",
      title: "Location Intelligence",
      description:
        "Dynamic pricing and resource allocation based on geographical factors",
    },
    {
      image: "/mainimage.jpeg",
      title: "Smart Notifications",
      description:
        "Automated alerts and reminders for all service milestones and updates",
    },
  ];

  const managerFeatures = [
    {
      title: "Employee Management",
      description: "Add/remove employees, assign departments and skills",
    },
    {
      title: "Service Templates",
      description: "Create and customize service workflows",
    },
    {
      title: "Team Coordination",
      description: "Assign multi-departmental teams to services",
    },
    {
      title: "Skill Approval",
      description: "Review and approve employee skill requests",
    },
    {
      title: "Progress Tracking",
      description: "Monitor service execution in real-time",
    },
    {
      title: "Notification System",
      description: "Automated alerts for all stakeholders",
    },
  ];

  const employeeFeatures = [
    {
      title: "Verified Onboarding",
      description: "Secure registration via email verification",
    },
    {
      title: "Skill-Based Services",
      description: "View only relevant services matching your skills",
    },
    {
      title: "Status Updates",
      description: "Update service progress (Start/Halt/Complete)",
    },
    {
      title: "Task Management",
      description: "View and complete assigned tasks",
    },
    {
      title: "Reminder Notifications",
      description: "Get alerts before service starts",
    },
    {
      title: "Performance Feedback",
      description: "View customer ratings and comments",
    },
  ];

  const customerFeatures = [
    {
      title: "Easy Booking",
      description: "Simple service booking with location, date and time",
    },
    {
      title: "Dynamic Pricing",
      description: "Location-based service charges",
    },
    {
      title: "Real-time Tracking",
      description: "Monitor service progress from booking to completion",
    },
    {
      title: "Automated Updates",
      description: "Receive notifications at every service milestone",
    },
    {
      title: "Feedback System",
      description: "Rate and review completed services",
    },
    {
      title: "Transaction Records",
      description: "Access complete payment history",
    },
  ];

  const platformFeatures = [
    {
      icon: <TrendingUp />,
      title: "Workflow Automation",
      description:
        "Streamline complex service workflows with automated task assignments and notifications",
      color: "primary",
    },
    {
      icon: <Security />,
      title: "Role-Based Access",
      description:
        "Secure system with granular permissions for managers, employees and customers",
      color: "secondary",
    },
    {
      icon: <LocationOn />,
      title: "Location Intelligence",
      description:
        "Dynamic pricing and resource allocation based on geographical factors",
      color: "info",
    },
    {
      icon: <Notifications />,
      title: "Smart Notifications",
      description:
        "Automated alerts and reminders for all service milestones and updates",
      color: "success",
    },
  ];

  return (
    <Box sx={{ bgcolor: "grey.50" }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 12,
          pb: 10,
          background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, transparent 100%)`,
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  component="img"
                  src="/icon1.png"
                  alt="IntelliAgent Logo"
                  sx={{ height: 40 }}
                />

                <span className="text-3xl font-semibold text-gray-800 mr-2">
                  IntelliAgent
                </span>
              </Box>
              <Typography
                variant="h2"
                fontWeight={800}
                gutterBottom
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Smart Service Management{" "}
                <Typography
                  component="span"
                  variant="inherit"
                  color="primary.main"
                >
                  Simplified
                </Typography>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 600 }}
              >
                Streamline workflows across managers, employees and customers
                with our intelligent platform designed for modern service
                businesses.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: theme.shadows[4],
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigateToService();
                  }}
                >
                  Get Started
                </Button>
                {/* <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                  }}
                >
                  Live Demo
                </Button> */}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: theme.shadows[10],
                }}
              >
                <Box
                  component="img"
                  src="/l2.jpg"
                  alt="Dashboard Preview"
                  sx={{ width: "100%", display: "block" }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Logo Cloud Section */}
      <Box sx={{ py: 6, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            TRUSTED BY LEADING COMPANIES
          </Typography>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <Grid item key={item}>
                <Box
                  component="img"
                  src={`/icon1.png`}
                  alt={`Company ${item}`}
                  sx={{ height: 32, filter: "grayscale(100%)", opacity: 0.6 }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Carousel */}
      <Box sx={{ py: 10, bgcolor: "grey.100" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Powerful Platform Features
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 700, mx: "auto", mb: 6 }}
          >
            IntelliAgent provides comprehensive tools to manage the entire
            service lifecycle with intelligence and efficiency
          </Typography>

          <Carousel
            animation="fade"
            duration={800}
            navButtonsAlwaysVisible
            navButtonsProps={{
              style: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
            NextIcon={<ArrowForward />}
            PrevIcon={<ArrowBack />}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              "& .CarouselIndicator": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {carouselItems.map((item, i) => (
              <FeatureCarouselItem key={i} item={item} />
            ))}
          </Carousel>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {platformFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Role Sections */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Designed For All Stakeholders
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 700, mx: "auto", mb: 6 }}
          >
            IntelliAgent serves all three key roles in your service ecosystem
            with tailored functionality
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 2,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              {[
                { id: "manager", label: "Managers" },
                { id: "employee", label: "Employees" },
                { id: "customer", label: "Customers" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  fullWidth
                  variant={activeTab === tab.id ? "contained" : "text"}
                  onClick={() => setActiveTab(tab.id)}
                  sx={{
                    borderRadius: 1,
                    fontWeight: 700,
                    py: 1,
                    textTransform: "none",
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {activeTab === "manager" && (
            <RoleSection
              icon={<ManageAccounts />}
              title="Manager Portal"
              features={managerFeatures}
              color="primary"
            />
          )}
          {activeTab === "employee" && (
            <RoleSection
              icon={<Work />}
              title="Employee Portal"
              features={employeeFeatures}
              color="secondary"
            />
          )}
          {activeTab === "customer" && (
            <RoleSection
              icon={<Person />}
              title="Customer Portal"
              features={customerFeatures}
              color="info"
            />
          )}
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: "grey.100" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            What Our Customers Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      src={`/avatar-${item}.jpg`}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography fontWeight={600}>John Doe</Typography>
                      <Typography variant="body2" color="text.secondary">
                        CEO, Company {item}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={5} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    "IntelliAgent has transformed our service operations. The
                    platform's automation features saved us countless hours of
                    manual work."
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: "primary.contrastText",
              textAlign: "center",
              boxShadow: theme.shadows[10],
            }}
          >
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Ready to Transform Your Service Business?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join hundreds of businesses using IntelliAgent to streamline their
              service operations
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: "background.paper",
                color: "primary.main",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  bgcolor: "background.paper",
                  opacity: 0.9,
                },
              }}
              onClick={(event) => {
                event.stopPropagation();
                navigateToService();
              }}
            >
              Start Free Trial
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: "grey.600", color: "grey.300" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={700} color="common.white">
                  IntelliAgent
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Smart service management platform designed to streamline
                workflows across managers, employees and customers.
              </Typography>
              <Typography variant="body2">
                © {new Date().getFullYear()} IntelliAgent. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="common.white"
                gutterBottom
              >
                Product
              </Typography>
              <List dense>
                {["Features", "Pricing", "Integrations", "Roadmap"].map(
                  (item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="common.white"
                gutterBottom
              >
                Resources
              </Typography>
              <List dense>
                {["Documentation", "Guides", "Blog", "Support"].map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="common.white"
                gutterBottom
              >
                Contact Us
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32, color: "grey.400" }}>
                    <Email fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="contact@intelliagent.com"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32, color: "grey.400" }}>
                    <Lock fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security & Privacy"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
