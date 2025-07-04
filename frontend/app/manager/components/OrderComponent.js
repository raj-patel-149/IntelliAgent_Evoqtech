"use client";

import { useCreateOrderMutation } from "@/features/bookingApiSlice";
import { Button } from "@mui/material";


export default function OrderComponent({ amt, pay }) {
    const [createOrder, { data, isLoading, error }] = useCreateOrderMutation();

    const handleOrder = async () => {
        await createOrder(amt || 100); // Example amount in INR

        pay(data.amount);
    };

    console.log("order data", data);


    return (
        <div>
            <Button variant="contained" onClick={handleOrder} disabled={isLoading}>
                {isLoading ? "Processing..." : "Create Order"}
            </Button>
            {error && <p>Error: {error.message}</p>}
            {data && <p>Order ID: {data.id}</p>}
        </div>
    );
}
