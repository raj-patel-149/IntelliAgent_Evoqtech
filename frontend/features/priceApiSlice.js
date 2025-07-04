// features/price/priceApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const priceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api/price", // Your backend base URL
  }),
  endpoints: (builder) => ({
    calculatePrice: builder.mutation({
      query: ({ lat, lng, id }) => ({
        url: "/calculate-price",
        method: "POST",
        body: { lat, lng, id },
      }),
    }),
  }),
});

export const { useCalculatePriceMutation } = priceApi;
