import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

import type {
  User,
  AuthStatus,
} from "./loginSlice";

const API_URL =
  "https://67bc3c07ed4861e07b39ba07.mockapi.io/user";

export interface RegisterUserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

const initialState:
  RegisterState = {
  user: null,
  status: "idle",
  error: null,
};

const getErrorMessage = (
  error: unknown
): string => {
  if (
    axios.isAxiosError(
      error
    )
  ) {
    if (
      typeof error
        .response
        ?.data ===
      "string"
    ) {
      return error
        .response
        .data;
    }

    return (
      error.message ||
      "Qeydiyyat uğursuz oldu!"
    );
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Qeydiyyat uğursuz oldu!";
};

export const registerUser =
  createAsyncThunk<
    User,
    RegisterUserData,
    {
      rejectValue: string;
    }
  >(
    "register/registerUser",

    async (
      newUser,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.get<
            User[]
          >(API_URL);

        const users =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        const emailExists =
          users.some(
            (user) =>
              user.email?.toLowerCase() ===
              newUser.email.toLowerCase()
          );

        if (emailExists) {
          return rejectWithValue(
            "Bu email artıq istifadə olunur. Zəhmət olmasa başqa email seçin."
          );
        }

        const {
          confirmPassword:
            _confirmPassword,
          ...userData
        } = newUser;

        const createResponse =
          await axios.post<User>(
            API_URL,
            {
              ...userData,
              isPremium:
                false,
              wishlist: [],
            }
          );

        return createResponse.data;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error
          )
        );
      }
    }
  );

export const registerSlice =
  createSlice({
    name: "register",

    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          registerUser.pending,
          (state) => {
            state.status =
              "loading";

            state.error =
              null;
          }
        )

        .addCase(
          registerUser.fulfilled,
          (
            state,
            action
          ) => {
            state.user =
              action.payload;

            state.status =
              "succeeded";

            state.error =
              null;
          }
        )

        .addCase(
          registerUser.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "Qeydiyyat uğursuz oldu!";
          }
        );
    },
  });

export default registerSlice.reducer;