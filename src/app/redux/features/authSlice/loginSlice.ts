

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://67bc3c07ed4861e07b39ba07.mockapi.io/user";

const initialState = {
  user: null,
  users: [],
  status: "idle",
  error: null,
};

export const getUserControl = createAsyncThunk(
  "auth/getUserControl",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return rejectWithValue("İstifadəçi məlumatı oxunmadı!");
    }
  }
);

export const getLogin = createAsyncThunk(
  "getLogin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Məlumat yüklənmədi!");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    { id, updatedData }: { id: string; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔹 GÖNDƏRİLƏN ID:", id);
      console.log("🔹 GÖNDƏRİLƏN DATA:", updatedData);

      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "İstifadəçi məlumatları yenilənmədi!"
      );
    }
  }
);

export const updateWishlist = createAsyncThunk(
  "auth/updateWishlist",
  async (
    { userId, movie }: { userId: number; movie: any },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const user = state.auth.user;

      if (!user) return rejectWithValue("İstifadəçi daxil olmamışdır!");

      const updatedWishlist = user.wishlist.some(
        (item: any) => item.id === movie.id
      )
        ? user.wishlist.filter((item: any) => item.id !== movie.id)
        : [...user.wishlist, movie];

      const response = await axios.put(`${API_URL}/${userId}`, {
        wishlist: updatedWishlist,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Wishlist yenilənmədi!");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("user");  
      return null; 
    } catch (error) {
      return rejectWithValue("Çıxış zamanı xəta baş verdi");
    }
  }
);

export const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    checkUser: (state, action) => {
      state.status = "loading";
      const foundUser = state.users.find(
        (item) =>
          item.email === action.payload.email &&
          item.password === action.payload.password
      );

      if (foundUser) {
        state.user = foundUser;
        state.status = "succeeded";
        localStorage.setItem("user", JSON.stringify(foundUser));
        window.location.href = "/main/profile";
      } else {
        state.user = null;
        state.status = "failed";
        state.error = "E-poçt və ya şifrə yanlışdır!";
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload || [];
      })
      .addCase(getLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserControl.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserControl.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle"; 
        localStorage.removeItem("user"); 
      })
      .addCase(getUserControl.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser, checkUser } = loginSlice.actions;
export default loginSlice.reducer;

