import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:9000/api/admin";
// const API_URL = "https://personal-travel-log.onrender.com/api/admin";

export const getNotificationApi = createApi({
  reducerPath: "getNotificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => {
        return {
          url: "/get-notification",
          method: "GET",
        };
      },
    }),

    markAsReadAllNotification: builder.mutation({
      query: () => {
        return {
          url: "/mark-notification-as-read",
          method: "PUT",
        };
      },
    }),
  }),
});

export const { useGetNotificationQuery, useMarkAsReadAllNotificationMutation } =
  getNotificationApi;
