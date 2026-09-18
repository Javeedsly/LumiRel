import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://67bc3c07ed4861e07b39ba07.mockapi.io/user";

const initialState = {
  user: null,
  status: "idle", 
  error: null,
};

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const { data: users } = await axios.get(API_URL);

      const emailExists = users.some((user) => user.email === newUser.email);
      if (emailExists) {
        return rejectWithValue("Bu email artıq istifadə olunur. Zəhmət olmasa başqa email seçin.");
      }

      const { data } = await axios.post(API_URL, newUser);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Qeydiyyat uğursuz oldu!");
    }
  }
);

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        localStorage.setItem("user", JSON.stringify(action.payload));

        window.location.href = "/main/auth/login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default registerSlice.reducer;
