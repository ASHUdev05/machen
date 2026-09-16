import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { UserProfile, AuthResponse } from '../types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, Record<string, string>>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);

      const payload = response.data;

      // Extract token across various JSON casing and property names
      const token =
        payload?.token ||
        payload?.accessToken ||
        payload?.jwt ||
        payload?.Token ||
        payload?.AccessToken ||
        payload?.data?.token ||
        payload?.data?.accessToken;

      if (!token) {
        return rejectWithValue('No token received from server.');
      }

      return {
        ...payload,
        token, // Standardize token key for Redux state
      } as AuthResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed.');
    }
  }
);

export const fetchProfile = createAsyncThunk<UserProfile>(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      const data = response.data?.data || response.data;
      return data as UserProfile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user profile.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed.';
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        // Clear session if token is invalid or expired
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;