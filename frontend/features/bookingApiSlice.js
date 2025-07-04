// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/booking' }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/create-order',
        method: 'POST',
        body,
      }),
    }),
    calculatePrice: builder.mutation({
      query: ({id}) => ({
        url: '/calculate-price',
        method: 'POST',
        body:{id},
      }),
    }),

    verifyPayment: builder.mutation({
      query: (body) => ({
        url: '/verify-payment',
        method: 'POST',
        body,
      }),
    }),
    getAllBookings: builder.query({
      query: () => ({
        url: '/bookings',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetAllBookingsQuery,
useCalculatePriceMutation,
}
  = bookingApi;