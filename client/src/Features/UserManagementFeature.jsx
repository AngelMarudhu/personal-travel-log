import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9000/api/traveler";

export const sentOTP = createAsyncThunk("otp-sent", async (data, thunkAPI) => {
  //   console.log(data);
  try {
    const response = await axios.post(`${API_URL}/user-sent-otp`, data, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    // console.log(error);
    return thunkAPI.rejectWithValue({
      error: error.response.data,
    });
  }
});

export const verifyOtp = createAsyncThunk(
  "verify-otp",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/user-verify-otp`, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const changePassword = createAsyncThunk(
  "change-password",
  async (data, thunkAPI) => {
    console.log(data);
    try {
      const response = await axios.put(
        `${API_URL}/change-user-password`,
        data,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );
      //   console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const changeEmail = createAsyncThunk(
  "change-email",
  async (data, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/change-user-email`, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);
