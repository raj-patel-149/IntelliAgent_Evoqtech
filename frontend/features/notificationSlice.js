import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApiSlice = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://intelliagent-evoqtech.onrender.com/api",
  }), // Change base URL if needed
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (name) => `notification/notifications?name=${name}`,
      providesTags: ["Notifications"],
    }),
    clearNotifications: builder.mutation({
      query: (name) => ({
        url: `notification/notifications/clear?name=${name}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `notification/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
      // Optimistic update configuration
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApiSlice.util.updateQueryData(
            "getNotifications",
            undefined, // You might need to pass the name parameter here if your query uses it
            (draftNotifications) => {
              const notification = draftNotifications.find(
                (n) => n._id === notificationId
              );
              if (notification) {
                notification.read = true;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useClearNotificationsMutation,
  useMarkNotificationAsReadMutation,
} = notificationApiSlice;
