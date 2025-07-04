import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api",
    credentials: "include",
  }),
  tagTypes: ["User", "Case"],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
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
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "user/forgot-password",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedData }) => {
        const isFormData = updatedData instanceof FormData;
        return {
          url: `user/${id}`,
          method: "PUT",
          body: updatedData,
          headers: isFormData ? {} : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["User"],
    }),

    acceptEmail: builder.mutation({
      query: (token) => ({
        url: `user/accept-email/${token}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "user/reset-password",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),
    addCase: builder.mutation({
      query: (newUser) => ({
        url: "case/add-case",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),

    getCases: builder.query({
      query: (id) => `case/${id}/cases`,
      providesTags: ["Case"],
    }),
    updateCase: builder.mutation({
      query: ({ id, case_Status, receiver, receiver_id }) => ({
        url: `case/cases/${id}`,
        method: "PATCH",
        body: { case_Status, receiver, receiver_id },
      }),
      invalidatesTags: ["Case"],
    }),
    uploadImage: builder.mutation({
      query: (imageData) => ({
        url: "image/upload",
        method: "POST",
        body: imageData,
      }),
    }),
    updateUserSkills: builder.mutation({
      query: ({ id, skills }) => ({
        url: `user/user/${id}/skills`,
        method: "PUT",
        body: { skills },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useAddUserMutation,
  useGetuserQuery,
  useForgotPasswordMutation,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAcceptEmailMutation,
  useResetPasswordMutation,
  useAddCaseMutation,
  useGetCasesQuery,
  useUpdateCaseMutation,
  useUploadImageMutation,
  useUpdateUserSkillsMutation,
} = apiSlice;
