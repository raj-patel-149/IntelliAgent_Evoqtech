import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamServiceApi = createApi({
  reducerPath: "teamServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api",
  }), // Change base URL if needed
  tagTypes: ["teamService"],
  endpoints: (builder) => ({
    assignEmployeesToCase: builder.mutation({
      query: (data) => ({
        url: "teamService/assign",
        method: "POST",
        body: data,
      }),
    }),
    getEmployeesByCaseId: builder.query({
      query: (caseId) => `teamService/${caseId}`,
    }),
    getTeamServicesByEmployeeId: builder.query({
      query: (EmployeeId) => `teamService/data/${EmployeeId}`,
    }),
    removeEmployee: builder.mutation({
      query: (body) => ({
        url: "teamService/team-remove-employee",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TeamService"],
    }),
    updateTeamServiceStatus: builder.mutation({
      query: ({ id, service_status, receiver_id }) => ({
        url: `teamService/update-team-service-status/${id}`,
        method: "PATCH",
        body: { service_status, receiver_id },
      }),
      invalidatesTags: ["ServiceStatus"],
    }),
    getTeamServiceById: builder.query({
      query: (id) => ({
        url: `/teamService/teamSerice-findById/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAssignEmployeesToCaseMutation,
  useGetEmployeesByCaseIdQuery,
  useGetTeamServicesByEmployeeIdQuery,
  useRemoveEmployeeMutation,
  useUpdateTeamServiceStatusMutation,
  useGetTeamServiceByIdQuery,
} = teamServiceApi;
