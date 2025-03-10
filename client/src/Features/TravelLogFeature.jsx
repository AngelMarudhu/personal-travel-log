import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:9000/api/traveler";

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

export const getTravelLogs = createAsyncThunk(
  "/get-travel-logs",
  async ({ page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`/get-travel-logs/${page}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const createTraveLog = createAsyncThunk(
  "create/log",
  async (data, thunkAPI) => {
    try {
      // console.log(data);
      const response = await api.post(`/log`, data, {});
      console.log(response.data);
      return response.data.newTravelLog;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const searchLogByLocation = createAsyncThunk(
  "search-log-location",
  async (location, thunkAPI) => {
    // console.log(location);
    try {
      if (!location) {
        return thunkAPI.rejectWithValue({
          error: "Location is required",
        });
      }
      const response = await api.get(
        `/search-log-by-location?fromLocation=${location.fromLocation}&toLocation=${location.toLocation}`
      );

      // console.log(response.data);
      return response.data.searchLogs;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const getTrendingPlaces = createAsyncThunk(
  "get-trending-places",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/get-trending-logs`);

      // console.log(response.data.trendingPlaces);
      return response.data.trendingPlaces;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const getCommentTravelLog = createApi({
  reducerPath: "getCommentTravelLog",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      getCommentTravelLog: builder.query({
        query: (id) => {
          return {
            url: `/get-comment-travel-log/${id}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const getNearByPlaces = createAsyncThunk(
  "get-near-by-places",
  async (coordination, thunkAPI) => {
    try {
      const response = await api.get(
        `/get-nearby-location?lat=${coordination.lat}&lng=${coordination.lng}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const { useGetCommentTravelLogQuery } = getCommentTravelLog;
