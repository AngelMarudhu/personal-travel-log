import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:9000/api/traveler";
const API_URL = "https://personal-travel-log.onrender.com/api/traveler";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
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

export const getUserTravelLogs = createAsyncThunk(
  "get-user-travel-logs",
  async (thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/get-user-travel-logs`);
      // console.log(response);
      return response.data.yourTravelLogs;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const updateTravelLog = createAsyncThunk(
  "/update-log",
  async ({ id, data }, thunkAPI) => {
    // console.log(id, data);
    try {
      const response = await api.put(
        `${API_URL}//update-travel-log/${id}`,
        data
      );

      // console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const deleteTravelLog = createAsyncThunk(
  "delete-log",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/delete-travel-log/${id}`);

      // console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const addExpensesToDB = createAsyncThunk(
  "add/expenses",
  async ({ data }, thunkAPI) => {
    // console.log(data);
    try {
      const response = await api.post(`add-user-expenses`, data);
      // console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);
