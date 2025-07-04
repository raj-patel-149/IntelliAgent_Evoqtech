"use client"; // Ensure client-side execution

import { useCreateOrderMutation, useVerifyPaymentMutation } from "@/features/bookingApiSlice";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";

const PaymentButton = ({ amount }) => {
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    console.log("amount from payment", amount);

    // ✅ Load Razorpay script dynamically if not already loaded
    useEffect(() => {
        const loadRazorpayScript = async () => {
            if (typeof window !== "undefined" && !window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                script.onload = () => {
                    console.log("✅ Razorpay script loaded");
                    setRazorpayLoaded(true);
                };
                script.onerror = () => console.error("❌ Razorpay script failed to load");
                document.body.appendChild(script);
            } else {
                setRazorpayLoaded(true);
            }
        };
        loadRazorpayScript();
    }, []);

    const handlePayment = async () => {
        try {
            if (!razorpayLoaded) {
                console.error("❌ Razorpay SDK is not loaded yet.");
                return;
            }

            // ✅ Fetch the order from the backend
            const orderResponse = await createOrder(amount).unwrap();
            console.log("🔹 Order Created:", orderResponse);

            // ✅ Set up the Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderResponse.amount,
                currency: orderResponse.currency,
                order_id: orderResponse.id,
                name: "Your Company",
                description: "Payment for services",
                handler: async (response) => {
                    console.log("🔹 Payment Response:", response);
                    const verificationResponse = await verifyPayment(response).unwrap();
                    if (verificationResponse.success) {
                        alert("✅ Payment Successful!");
                    } else {
                        alert("❌ Payment Failed!");
                    }
                },
                prefill: { email: "customer@example.com", contact: "9999999999" },
                theme: { color: "#3399cc" },
            };

            // ✅ Ensure `window.Razorpay` is defined
            if (!window.Razorpay) {
                console.error("❌ Razorpay SDK is not available on window.");
                return;
            }

            // ✅ Create a new Razorpay instance and open payment modal
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("❌ Payment error:", error);
        }
    };

    return (
        <Button variant="contained" onClick={handlePayment} disabled={isLoading || !razorpayLoaded}>
            {isLoading ? "Processing..." : "Pay Now"}
        </Button>
    );
};

export default PaymentButton;
