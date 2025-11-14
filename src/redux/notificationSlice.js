import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../api/notificationApi";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Fetch notifications for active user
// Fetch notifications for active user
export const fetchNotificationsThunk = createAsyncThunk(
    "notifications/fetchAll",
    async (userId, { rejectWithValue }) => {
      try {
        const data = await getNotifications(userId); // pass userId
        return data.notifications; // array of notification objects
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
      }
    }
  );
  
  // Mark all notifications as read
  export const markAllNotificationsReadThunk = createAsyncThunk(
    "notifications/markAllRead",
    async (userId, { rejectWithValue }) => {
      try {
        const data = await markAllNotificationsRead(userId); // pass userId
        return data.notifications; // updated notifications array
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to mark all notifications as read");
      }
    }
  );
  

// Mark a notification as read
export const markNotificationReadThunk = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const data = await markNotificationRead(notificationId);
      
      return data.notification; // updated notification object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark notification read");
    }
  }
);
  
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) state.notifications[index] = action.payload;
      });
      builder
      .addCase(markAllNotificationsReadThunk.fulfilled, (state, action) => {
        state.notifications = action.payload; // replace with updated notifications
      });

  },
});

export const { clearNotifications } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
