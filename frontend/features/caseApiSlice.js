import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const caseApiSlice = createApi({
  reducerPath: "caseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api",
    credentials: "include",
  }),
  tagTypes: ["Case", "ServiceStatus"],
  endpoints: (builder) => ({
    addCase: builder.mutation({
      query: (newCase) => ({
        url: "case/add-case",
        method: "POST",
        body: newCase,
      }),
      invalidatesTags: ["Case"],
    }),

    getCases: builder.query({
      query: (id) => `case/${id}/cases`,
      providesTags: ["Case"],
    }),

    updateCase: builder.mutation({
      query: ({ id, case_status, receiver, receiver_id }) => ({
        url: `case/update-caseStatus/${id}`,
        method: "PATCH",
        body: { case_status, receiver, receiver_id },
      }),
      invalidatesTags: ["Case"],
    }),

    updateServiceStatus: builder.mutation({
      query: ({ id, service_status, receiver, receiver_id }) => ({
        url: `case/update-service-status/${id}`,
        method: "PATCH",
        body: { service_status, receiver, receiver_id },
      }),
      invalidatesTags: ["ServiceStatus"],
    }),
    updateServiceManagerStatus: builder.mutation({
      query: ({ id, service_status }) => ({
        url: `case/update-service-status-manager/${id}`,
        method: "PATCH",
        body: { service_status },
      }),
      invalidatesTags: ["ServiceStatus"],
    }),

    getAcceptedCases: builder.query({
      query: (id) => `case/accepted-cases/${id}`,
      providesTags: ["Case"],
    }),
    getCaseDetails: builder.query({
      query: (id) => `case/case-details/${id}`,
      providesTags: ["Case"],
    }),
    getTeamCases: builder.query({
      query: () => `case/team-cases`,
      providesTags: ["Case"],
    }),

    getAllServices: builder.query({
      query: (service) => `case/manager-services/${service}`,
      providesTags: ["Case"],
    }),
    getAllServices2: builder.query({
      query: ({ service, id }) => `case/employee-services/${id}/${service}`,
      providesTags: ["Case"],
    }),
    getAllServices3: builder.query({
      query: ({ service, id }) => `case/customer-services/${id}/${service}`,
      providesTags: ["Case"],
    }),
    getServicesHistory: builder.query({
      query: () => `case/service-history`,
      providesTags: ["Case"],
    }),

    getTodaysServices: builder.query({
      query: () => `case/todays-services`,
      providesTags: ["Case"],
    }),
    getEmployeeTodayTask: builder.query({
      query: (id) => `case/employee/todays-services?id=${id}`,
    }),
    getFilterCases: builder.query({
      query: ({ id, service_status }) =>
        `case//filterCases?id=${id}&status=${service_status}`,
    }),
    getClientCases: builder.query({
      query: (name) => `case/client/cases?name=${name}`,
    }),
    getCasesById: builder.query({
      query: (id) => `case/getCaseById/${id}`,
    }),
    getCasesByIds: builder.mutation({
      query: (ids) => ({
        url: "case/cases-by-ids",
        method: "POST",
        body: { ids },
      }),
    }),
  }),
});

export const {
  useAddCaseMutation,
  useGetCasesQuery,
  useGetCaseDetailsQuery,
  useGetAcceptedCasesQuery,
  useGetAllServicesQuery,
  useGetAllServices2Query,
  useGetServicesHistoryQuery,
  useGetTodaysServicesQuery,
  useUpdateCaseMutation,
  useGetEmployeeTodayTaskQuery,
  useUpdateServiceStatusMutation,
  useUpdateServiceManagerStatusMutation,
  useGetFilterCasesQuery,
  useGetClientCasesQuery,
  useGetCasesByIdQuery,
  useGetTeamCasesQuery,
  useGetCasesByIdsMutation,
  useGetAllServices3Query,
} = caseApiSlice;
