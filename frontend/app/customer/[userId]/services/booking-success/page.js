"use client";
import { useSearchParams } from "next/navigation";

export default function BookingSuccess() {
  const searchParams = useSearchParams();

  const service = searchParams.get("service");
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600">Booking Confirmed ✅</h1>
        <p className="mt-2 text-gray-700">Service: {service}</p>
        <p className="mt-1 text-gray-700">Amount Paid: ₹{amount}</p>
        <p className="mt-1 text-gray-700">Payment ID: {paymentId}</p>
        <p className="mt-4 text-sm text-gray-500">Thank you for booking with us!</p>
      </div>
    </div>
  );
}
