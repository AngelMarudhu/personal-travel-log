import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9000/api/admin";
// const API_URL = "https://personal-travel-log.onrender.com/api/admin";

export const getAllUserDetails = createAsyncThunk(
  "get-user-details",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/get-all-users`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const deleteUserData = createAsyncThunk(
  "delete-user",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/delete-user/${id}`, {
        params: { id },
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const blockUserFeature = createAsyncThunk(
  "block-user",
  async (id, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/block-user/${id}`,
        {
          params: { id },
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);

export const unBlockUserFeature = createAsyncThunk(
  "unblock-user",
  async (id, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/unblock-user/${id}`,
        {
          params: { id },
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);
