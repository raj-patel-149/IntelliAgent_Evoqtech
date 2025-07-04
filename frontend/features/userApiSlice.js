import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "user/add-user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    getuser: builder.query({
      query: ({ status = "All", page = 0, limit = 5, search = "" }) => {
        const searchParam = search.length >= 2 ? `&search=${search}` : "";
        return `user/users?status=${status}&page=${page}&limit=${limit}${searchParam}`;
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `user/${id}`,
      providesTags: ["User"],
    }),
    getUserByEmail: builder.query({
      query: (email) => `user/${email}`,
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),
    editUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `user/edit-user/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserSkills: builder.mutation({
      query: ({ id, skills }) => ({
        url: `user/user/${id}/skills`,
        method: "PUT",
        body: { skills },
      }),
      invalidatesTags: ["User"],
    }),
    getUserCount: builder.query({
      query: () => "user/count",
      providesTags: ["User"],
    }),

    getDepartments: builder.query({
      query: () => "user/departments",
    }),

    getClientCount: builder.query({
      query: () => "/user/count-clients",
    }),
    getSkillsByDepartment: builder.query({
      query: (department) => `user/skills?department=${department}`,
    }),
    getEmployeeByDepartment: builder.query({
      query: (department) =>
        `user/get-employee-by-department?department=${department}`,
    }),
    getEmployeesByMoreDepartments: builder.query({
      query: (department) =>
        `user/get-employee-by-moredepartments?department=${department}`,
    }),
    getEmployeesByIds: builder.mutation({
      query: (ids) => ({
        url: "user/employees-by-ids",
        method: "POST",
        body: { ids },
      }),
    }),
    getEmployeeScheduleWithCases: builder.query({
      query: (empId) => ({
        url: `user/schedule/Employee?empId=${empId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetuserQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useEditUserMutation,
  useUpdateUserSkillsMutation,
  useGetDepartmentsQuery,
  useGetSkillsByDepartmentQuery,
  useGetEmployeeByDepartmentQuery,
  useGetEmployeesByIdsMutation,
  useGetUserCountQuery,
  useGetClientCountQuery,
  useGetEmployeesByMoreDepartmentsQuery,
  useGetEmployeeScheduleWithCasesQuery,
} = userApiSlice;
