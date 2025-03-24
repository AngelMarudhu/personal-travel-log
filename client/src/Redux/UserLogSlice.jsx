import { createSlice } from "@reduxjs/toolkit";
import {
  deleteTravelLog,
  getUserTravelLogs,
  updateTravelLog,
  addExpensesToDB,
} from "../Features/UserLogFeature";

const initialState = {
  yourLogs: [],
  isLoading: false,
  error: null,
  isEditing: false,
  updateLog: null,
  deletedLog: null,
  isUpdated: false,
  addingExpense: {
    isAddedExpenses: false,
    expenseMessage: null,
  },
};

const userLogSlice = createSlice({
  name: "userLog",
  initialState,

  reducers: {
    showEditLog: (state, action) => {
      state.isEditing = !state.isEditing;
      if (!state.isEditing) {
        state.updateLog = null;
      }
    },

    setUpdateLog: (state, action) => {
      state.updateLog = action.payload ? action.payload : null;
    },

    removeLocalYourLogs: (state, action) => {
      state.yourLogs = state.yourLogs.filter(
        (log) => log._id !== action.payload
      );
    },

    filterUserLog: (state, action) => {
      console.log(action.payload);
      const filteredLogs = state.yourLogs.filter((log) => {
        return (
          log.location.toLowerCase() ===
            action.payload.toLocation.toLowerCase() &&
          log.fromLocation.toLowerCase() ===
            action.payload.fromLocation.toLowerCase()
        );
      });
      state.yourLogs = filteredLogs;
    },

    resetPreviousSession: (state) => {
      state.isEditing = false;
      state.updateLog = null;
      state.deletedLog = null;
      state.isUpdated = false;
      state.addingExpense.isAddedExpenses = false;
      state.addingExpense.expenseMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserTravelLogs.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getUserTravelLogs.fulfilled, (state, action) => {
      state.yourLogs = action.payload;
      state.isLoading = false;
    });

    builder.addCase(updateTravelLog.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateTravelLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isUpdated = true;
      state.updateLog = action.payload;
    });

    builder.addCase(updateTravelLog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    });

    builder.addCase(deleteTravelLog.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteTravelLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deletedLog = action.payload;
    });

    // expenses

    builder.addCase(addExpensesToDB.pending, (state) => {
      state.isLoading = true;
      state.addingExpense.isAddedExpenses = false;
      state.error = null;
    });

    builder.addCase(addExpensesToDB.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addingExpense.isAddedExpenses = true;
      state.addingExpense.expenseMessage = action.payload.message;
      state.error = null;
    });

    builder.addCase(addExpensesToDB.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.addingExpense.isAddedExpenses = false;
      state.addingExpense.expenseMessage = null;
    });
  },
});

export const {
  showEditLog,
  setUpdateLog,
  removeLocalYourLogs,
  filterUserLog,
  resetPreviousSession,
} = userLogSlice.actions;

export default userLogSlice.reducer;
