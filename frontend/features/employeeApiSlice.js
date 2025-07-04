import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeeApi = createApi({
  reducerPath: "employeeApi",

  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api/employees" }),

  endpoints: (builder) => ({
    // ✅ Fetch Total Employee Count
    getEmployeeCount: builder.query({
      query: () => `/count`,
    }),

    getEmployeeScore: builder.query({
      query: (employeeId) => `/score/${employeeId}`,
    }),

    getEmployeesByDepartment: builder.query({
      query: () => "/departments",
    }),

    rejectService: builder.mutation({
      query: ({ employeeId }) => ({
        url: `/reject/${employeeId}`,
        method: "POST",
        body: { employeeId },
      }),
    }),
  }),
});

export const {
  useGetEmployeeCountQuery,
  useGetEmployeeScoreQuery,
  useRejectServiceMutation,
  useGetEmployeesByDepartmentQuery,
} = employeeApi;
