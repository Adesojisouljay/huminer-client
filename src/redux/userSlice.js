import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  claimRewards,
  addBankAccount,
  deleteBankAccount
} from "../api/userApi";

const initialState = {
  activeUser: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

// =============== Thunks ===============

// Register
export const registerUserThunk = createAsyncThunk(
  "activeUser/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Registering user:", userData);
      const data = await registerUser(userData); // ✅ data is already .data from axios
      console.log("Register success:", data);
      return data.message || "Registration successful";
    } catch (err) {
      console.error("Register error:", err);
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// Login
export const loginUserThunk = createAsyncThunk(
  "activeUser/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      console.log(data)
      localStorage.setItem("huminerToken", data?.token);
      return data;
    } catch (err) {
      console.error("Login error:", err);
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Fetch user profile
export const fetchUserProfileThunk = createAsyncThunk(
  "activeUser/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getUserProfile(id);
      console.log("profthunk", data)
      return data; // user data
    } catch (err) {
      console.error("Fetch profile error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// Update profile
export const updateUserProfileThunk = createAsyncThunk(
  "huminer/updateUserProfile",
  async ({ id, updates }, thunkAPI) => {
    try {
      // send raw updates
      return await updateUserProfile(id, updates);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);


// Follow user
export const followUserThunk = createAsyncThunk(
  "activeUser/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await followUser(userId);
      return data.updatedUser; // Expect backend to return the updated active user
    } catch (err) {
      console.error("Follow user error:", err);
      return rejectWithValue(err.response?.data?.message || "Follow failed");
    }
  }
);

// Unfollow user
export const unfollowUserThunk = createAsyncThunk(
  "activeUser/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await unfollowUser(userId);
      return data.updatedUser; // Expect backend to return the updated active user
    } catch (err) {
      console.error("Unfollow user error:", err);
      return rejectWithValue(err.response?.data?.message || "Unfollow failed");
    }
  }
);

// 🆕 Claim rewards thunk
export const claimRewardsThunk = createAsyncThunk(
  "activeUser/claimRewards",
  async (_, { rejectWithValue }) => {
    try {
      const data = await claimRewards(); // call the API from userApi.js
      return data; // the backend returns the updated user object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to claim rewards");
    }
  }
);

// 🆕 Add Bank Account thunk
export const addBankAccountThunk = createAsyncThunk(
  "huminer/addBankAccount",
  async (bankData, { rejectWithValue }) => {
    try {
      const data = await addBankAccount(bankData);
      return data; // returns { message, bankAccounts }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add bank account");
    }
  }
);

// 🆕 Delete Bank Account thunk
export const deleteBankAccountThunk = createAsyncThunk(
  "huminer/deleteBankAccount",
  async (bankId, { rejectWithValue }) => {
    try {
      const data = await deleteBankAccount(bankId);
      return data; // returns { message, bankAccounts }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete bank account");
    }
  }
);

// =============== Slice ===============
const userSlice = createSlice({
  name: "activeUser",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.activeUser = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUser = action?.payload?.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Profile
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.activeUser = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.activeUser = action.payload.user; // update profile in global state
      })

      // Follow User
      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.activeUser = action.payload;
      })

      // Unfollow User
      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        state.activeUser = action.payload;
      })

      // Claim rewards
      .addCase(claimRewardsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimRewardsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUser = action.payload; // updated user with new balances
      })
      .addCase(claimRewardsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Bank Account
      .addCase(addBankAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBankAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update bank accounts in activeUser
        if (state.activeUser) {
          state.activeUser.bankAccounts = action.payload.bankAccounts;
        }
      })
      .addCase(addBankAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Bank Account
      .addCase(deleteBankAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBankAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.activeUser) {
          state.activeUser.bankAccounts = action.payload.bankAccounts;
        }
      })
      .addCase(deleteBankAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { logoutUser, resetRegistration } = userSlice.actions;
export const userReducer = userSlice.reducer;
