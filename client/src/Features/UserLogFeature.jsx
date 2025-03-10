import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9000/api/traveler";

export const getUserTravelLogs = createAsyncThunk(
  "get-user-travel-logs",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/get-user-travel-logs`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

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
      const response = await axios.put(
        `${API_URL}//update-travel-log/${id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
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
      const response = await axios.delete(
        `${API_URL}/delete-travel-log/${id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      console.log(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response.data,
      });
    }
  }
);
