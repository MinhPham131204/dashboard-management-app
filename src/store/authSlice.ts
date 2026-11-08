import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleLogin } from '../mockResponse'
import User from '../model/User'

type AuthState = {
  loading: boolean;
  isAuth: boolean;
  error: string | undefined;
};

const initialState: AuthState = {
  loading: false,
  isAuth: false,
  error: undefined
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async (user: User) => {
  try {
    const response = await handleLogin(user);

    if (response.statusCode !== 200) {
      throw new Error(response.body.message || "User Not Found");
    }

    return true;
  } 
  catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Thêm reducer logout
    logout: (state) => {
      state.isAuth = false;
      state.error = undefined;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
      builder
          .addCase(fetchUser.pending, (state) => {
              state.loading = true;
          })
          .addCase(fetchUser.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuth = action.payload;
          })
          .addCase(fetchUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          });
  }
});

// Export action logout
export const { logout } = authSlice.actions;

export default authSlice.reducer;