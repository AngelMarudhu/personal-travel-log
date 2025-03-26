import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = "http://localhost:9000/api/traveler";

const API_URL = "https://personal-travel-log.onrender.com/api/traveler";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Optionally add any code before the request is sent, like adding token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export const postSavedLog = createAsyncThunk(
  "post-saved-log",
  async (id, thunkAPI) => {
    try {
      console.log(id);
      const response = await api.post("/post-saved-log", { travelLogId: id });
      // console.log(response.data);
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const deleteSavedLog = createAsyncThunk(
  "delete-saved-log",
  async (id, thunkAPI) => {
    console.log(id);
    try {
      const response = await api.delete(`/delete-saved-log/${id}`);
      //   console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const getSavedLogFeature = createApi({
  reducerPath: "getSavedLogFeature",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSavedLogs: builder.query({
      query: () => ({
        url: "/get-saved-log",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSavedLogsQuery } = getSavedLogFeature;
