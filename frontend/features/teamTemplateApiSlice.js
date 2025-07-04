import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamTemplateApiSlice = createApi({
  reducerPath: "teamTemplateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    credentials: "include",
  }),
  tagTypes: ["TeamTemplates"],
  endpoints: (builder) => ({
    getAllTemplates: builder.query({
      query: () => "TeamServiceTemplate/allTeamServicesTemplates",
    }),
    getTeamServiceTemplateById: builder.query({
      query: (id) => `TeamServiceTemplate/teamServiceTemplate-data-Byid/${id}`,
    }),
    addTemplate: builder.mutation({
      query: (formData) => ({
        url: "TeamServiceTemplate/store-teamService-template",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["TeamTemplates"],
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `TeamServiceTemplate/delete-team-service-template/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeamTemplates"],
    }),
  }),
});

export const {
  useGetAllTemplatesQuery,
  useGetTeamServiceTemplateByIdQuery,
  useAddTemplateMutation,
  useDeleteTemplateMutation,
} = teamTemplateApiSlice;
