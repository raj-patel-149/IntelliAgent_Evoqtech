'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme
} from '@mui/material';
import { useCalculatePriceMutation, useCreateOrderMutation, useVerifyPaymentMutation } from '@/features/bookingApiSlice';
import { useGetSkillsQuery } from '@/features/skillApiSlice';

export default function ServicesPage() {
    const theme = useTheme();
    const pathname = window.location.pathname;
    const [createOrder] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const { data: skills, isLoading, error, refetch } = useGetSkillsQuery();
    const [servicesWithPrice, setServicesWithPrice] = useState([]);

    const [calculatePrice] = useCalculatePriceMutation();
    // State for checkout dialog
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [price, setPrice] = useState(null);

 

    // const servicesWithPrice = skills?.map(async(service) => {
    //     setPrice( await calculatePrice({ id: service._id }))

    //     return {
    //         ...service,
    //         price: service.pricePerHour,
    //     };
    // });

    const handleCheckoutOpen = async (service) => {
        setSelectedService(service);
        // const totalPrice = await calculatePrice({ id: service._id });
        // console.log("totalPrice", totalPrice?.data?.resp.totalPrice);

        // setPrice(totalPrice?.data?.resp.totalPrice);
        setCheckoutOpen(true);
    };

    const handleCheckoutClose = () => {
        setCheckoutOpen(false);
        setSelectedService(null);
    };

    const handlePayment = async () => {
        const user = 'david@evoqtech.com';
        const { skill_Name } = selectedService;

        try {
            const { data: order } = await createOrder({
                amount: price,
                currency: 'INR',
                user,
                service: skill_Name,
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Service Booking',
                description: `Booking for ${skill_Name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const result = await verifyPayment({
                            ...response,
                            user,
                            service: skill_Name,
                            amount: price,
                        }).unwrap();

                        if (result.success) {
                            window.location.href = `${pathname}/booking-success?service=${skill_Name}&amount=${price}&paymentId=${response.razorpay_payment_id}`;
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                    }
                },
                prefill: {
                    name: 'David Evoqtech',
                    email: user,
                },
                theme: {
                    color: theme.palette.primary.main,
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            handleCheckoutClose();
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Choose a Service to Book
            </Typography>

            <Grid container spacing={3}>
                {skills?.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {service.skill_Name}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    ₹{service.totalPrice.toLocaleString()}
                                </Typography>
                                <Typography color="text.tertiary" gutterBottom>
                                    {service.duration.value} {service.duration.unit}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={() => handleCheckoutOpen(service)}
                                    sx={{ mt: 1 }}
                                >
                                    Book Now
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Checkout Dialog */}
            <Dialog open={checkoutOpen} onClose={handleCheckoutClose} maxWidth="sm" fullWidth>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                    {selectedService && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Service Details
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography><strong>Service:</strong> {selectedService.skill_Name}</Typography>
                                <Typography><strong>Duration:</strong> {selectedService.duration.value} {selectedService.duration.unit}</Typography>
                                <Box>
                                    <Typography><strong>Base Price:</strong> ₹{selectedService.basePrice}</Typography>
                                    <Typography><strong>GST:</strong> ₹{selectedService.gstAmount}</Typography>
                                    <Typography><strong>total Price:</strong> ₹{selectedService.totalPrice}</Typography>
                                </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                                By proceeding, you agree to our terms and conditions.
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCheckoutClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePayment}
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                        Proceed to Payment
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}