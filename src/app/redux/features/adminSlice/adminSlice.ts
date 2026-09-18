  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";

  const API_URL = "https://67bf658db2320ee05013999b.mockapi.io/admin";

  interface Admin {
    id: number;
    name: string;
    avatar: string;
    password: string;
    role: "superadmin" | "filmadmin" | "useradmin";
  }

  interface AdminState {
    adminData: Admin[];
    currentAdmin: Admin | null;
    loading: boolean;
    error: string | null;
  }

  const initialState: AdminState = {
    adminData: [],
    currentAdmin: typeof window !== "undefined" 
      ? JSON.parse(localStorage.getItem("admin") || "null") 
      : null,
    loading: false,
    error: null,
  };

  export const fetchAdmins = createAsyncThunk(
    "admin/fetchAdmins",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(API_URL);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const createAdmin = createAsyncThunk(
    "admin/createAdmin",
    async (newAdmin: Admin, { rejectWithValue }) => {
      try {
        const response = await axios.post(API_URL, newAdmin);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const updateAdmin = createAsyncThunk(
    "admin/updateAdmin",
    async ({ id, updatedData }: { id: number; updatedData: Partial<Admin> }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const deleteAdmin = createAsyncThunk(
    "admin/deleteAdmin",
    async (adminId: number, { rejectWithValue }) => {
      try {
        await axios.delete(`${API_URL}/${adminId}`);
        return adminId;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
      loginAdmin: (state, action) => {
        state.currentAdmin = action.payload;
        localStorage.setItem("admin", JSON.stringify(action.payload));
      },

      logoutAdmin: (state) => {
        state.currentAdmin = null;
        localStorage.removeItem("admin");
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAdmins.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAdmins.fulfilled, (state, action) => {
          state.adminData = action.payload;
          state.loading = false;
        })
        .addCase(fetchAdmins.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || "An error occurred";
        })
        .addCase(createAdmin.fulfilled, (state, action) => {
          state.adminData.push(action.payload);
        })
        .addCase(updateAdmin.fulfilled, (state, action) => {
          const index = state.adminData.findIndex((admin) => admin.id === action.payload.id);
          if (index !== -1) {
            state.adminData[index] = action.payload;
          }
        })
        .addCase(deleteAdmin.fulfilled, (state, action) => {
          state.adminData = state.adminData.filter((admin) => admin.id !== action.payload);
        });
    },
  });

  export const { loginAdmin, logoutAdmin } = adminSlice.actions;
  export default adminSlice.reducer;
