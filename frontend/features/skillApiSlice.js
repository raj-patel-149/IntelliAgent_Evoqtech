import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const skillApi = createApi({
  reducerPath: "skillApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api",
  }), // Change base URL if needed
  tagTypes: ["skill"],
  endpoints: (builder) => ({
    addSkill: builder.mutation({
      query: (newSkill) => ({
        url: "skill/add-skill",
        method: "POST",
        body: newSkill,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    addSkillRequest: builder.mutation({
      query: (skillData) => ({
        url: "skill/add-skill-employee",
        method: "POST",
        body: skillData,
      }),
      invalidatesTags: ["skill"],
    }),

    // 2️⃣ Manager Approves or Rejects a Skill
    updateSkillStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `skill/update-skill-status/${id}`,
        method: "PUT",
        body: { status },
      }),
    }),

    // 3️⃣ Fetch All Skill Approval Requests (Optional Filter by Status)
    fetchApprovalSkills: builder.query({
      query: (status) => ({
        url: `skill/approval-skills${status ? `?status=${status}` : ""}`,
        method: "GET",
      }),
    }),
    fetchApprovalSkillsById: builder.query({
      query: (employeeId) => ({
        url: `skill/approval-skills/employee/${employeeId}`,
        method: "GET",
      }),
    }),

    getSkills: builder.query({
      query: () => ({
        url: "/skill/skills",
        method: "GET",
      }),
    }),
    getSkillById: builder.query({
      query: (id) => ({
        url: `/skill/skills/${id}`,
        method: "GET",
      }),
    }),
    addDepartment: builder.mutation({
      query: (newDepartment) => ({
        url: "skill/add-department", // Change path if different
        method: "POST",
        body: newDepartment,
      }),
      invalidatesTags: ["skill"], // Optionally update tag to "department" if you define one
    }),
    addNewSkill: builder.mutation({
      query: (newSkill) => ({
        url: "skill/add-New-skill", // Change path if different
        method: "POST",
        body: newSkill,
      }),
      invalidatesTags: ["skill"], // Optionally update tag to "department" if you define one
    }),
  }),
});

export const {
  useAddSkillMutation,
  useAddSkillRequestMutation,
  useUpdateSkillStatusMutation,
  useFetchApprovalSkillsQuery,
  useFetchApprovalSkillsByIdQuery,
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useAddDepartmentMutation,
  useAddNewSkillMutation,
} = skillApi;
