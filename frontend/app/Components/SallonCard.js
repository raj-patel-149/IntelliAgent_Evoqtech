"use client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, IconButton } from '@mui/material';

const SalonServices = () => {
  const servicesData = {
    women: [
      { name: 'Waxing', image: '/sallon1.png' },
      { name: 'Facial & cleanup', image: '/sallon2.png' },
      { name: 'Pedicure', image: '/sallon3.png' },
      { name: 'Manicure', image: '/sallon4.png' },
      { name: 'Hair care', image: '/sallon5.png' },
      { name: 'Massage', image: '/sallon6.png' },
      { name: 'Skin care', image: '/sallon7.png' },
    ],
    men: [
      { name: 'Waxing', image: '/sallonmen1.png' },
      { name: 'Facial & cleanup', image: '/sallonmen2.png' },
      { name: 'Pedicure', image: '/sallon6 (2).png' },
      { name: 'Manicure', image: '/sallonmen4.png' },
      { name: 'Hair care', image: '/sallon5.png' },
    ],
  };

  const itemsPerPage = 5;
  const [currentIndex, setCurrentIndex] = useState({ women: 0, men: 0 });

  const handleNavigation = (type, direction) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex[type] + direction * itemsPerPage;
      return {
        ...prevIndex,
        [type]: Math.max(0, Math.min(newIndex, servicesData[type].length - itemsPerPage)),
      };
    });
  };

  const renderServiceCards = (type, title) => (
    <Box sx={{ padding: { xs: 2, sm: 4 }, marginLeft: { xs: 0, sm: 5 }, mb: 5 }}>
      <Typography variant="h5" mb={2}>{title}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IconButton onClick={() => handleNavigation(type, -1)} disabled={currentIndex[type] === 0}>
          <ArrowBackIcon />
        </IconButton>
        <Grid container spacing={2} justifyContent="center">
          {servicesData[type].slice(currentIndex[type], currentIndex[type] + itemsPerPage).map((service, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Card
                sx={{
                  width: '100%',
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    border: '1px solid gray',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    {service.name}
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image={service.image}
                  alt={service.name}
                  sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
        <IconButton onClick={() => handleNavigation(type, 1)} disabled={currentIndex[type] + itemsPerPage >= servicesData[type].length}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <div>
      {renderServiceCards('women', 'Salon for Women')}
      {renderServiceCards('men', 'Salon for Men')}
    </div>
  );
};

export default SalonServices;
