import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:9000/api/login";
const API_URL = "https://personal-travel-log.onrender.com/api/login";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post(`/register`, userData, {
        withCredentials: true,
      });
      //   console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post(`/login`, userData, {
        withCredentials: true,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "get-user-info",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/user-info`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);
