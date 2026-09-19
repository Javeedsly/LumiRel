import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";

import type { Film } from "../apiSlice/apiSlice";

const API_URL =
  "https://67bc3c07ed4861e07b39ba07.mockapi.io/user";

export interface CardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface User {
  id: string | number;

  name?: string;
  surname?: string;

  firstName?: string;
  lastName?: string;

  username?: string;

  email?: string;
  password?: string;
  confirmPassword?: string;

  profileImage?: string;

  isPremium?: boolean;

  premiumStartDate?: string | null;
  premiumCancelDate?: string | null;

  cardInfo?: CardInfo;

  cardNumber?: string;

  wishlist?: Film[];

  createdAt?: string;
  updatedAt?: string;

  role?: string;
}

export type AuthStatus =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed";

export interface AuthState {
  user: User | null;
  users: User[];
  status: AuthStatus;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UpdateUserProfileArgs {
  id: string | number;
  updatedData: Partial<User>;
}

interface UpdateWishlistArgs {
  userId: string | number;
  movie: Film;
}

const initialState: AuthState = {
  user: null,
  users: [],
  status: "idle",
  error: null,
};

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData
    ) {
      const message = (
        responseData as {
          message?: unknown;
        }
      ).message;

      if (typeof message === "string") {
        return message;
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  const parsedUser: unknown =
    JSON.parse(storedUser);

  if (
    !parsedUser ||
    typeof parsedUser !== "object"
  ) {
    return null;
  }

  return parsedUser as User;
};

const saveStoredUser = (
  user: User | null
) => {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  } else {
    localStorage.removeItem("user");
  }
};

export const getUserControl =
  createAsyncThunk<
    User | null,
    void,
    {
      rejectValue: string;
    }
  >(
    "auth/getUserControl",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return getStoredUser();
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "İstifadəçi məlumatı oxunmadı!"
          )
        );
      }
    }
  );

export const getLogin =
  createAsyncThunk<
    User[],
    void,
    {
      rejectValue: string;
    }
  >(
    "auth/getLogin",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.get<User[]>(
            API_URL
          );

        return Array.isArray(
          response.data
        )
          ? response.data
          : [];
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Məlumat yüklənmədi!"
          )
        );
      }
    }
  );

export const updateUserProfile =
  createAsyncThunk<
    User,
    UpdateUserProfileArgs,
    {
      rejectValue: string;
    }
  >(
    "auth/updateUserProfile",

    async (
      {
        id,
        updatedData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.put<User>(
            `${API_URL}/${id}`,
            updatedData
          );

        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "İstifadəçi məlumatları yenilənmədi!"
          )
        );
      }
    }
  );

export const updateWishlist =
  createAsyncThunk<
    User,
    UpdateWishlistArgs,
    {
      rejectValue: string;
    }
  >(
    "auth/updateWishlist",

    async (
      {
        userId,
        movie,
      },
      {
        getState,
        rejectWithValue,
      }
    ) => {
      try {
        const state =
          getState() as {
            auth: AuthState;
          };

        const user =
          state.auth.user;

        if (!user) {
          return rejectWithValue(
            "İstifadəçi daxil olmamışdır!"
          );
        }

        const currentWishlist =
          user.wishlist ?? [];

        const alreadyExists =
          currentWishlist.some(
            (item) =>
              String(item.id) ===
              String(movie.id)
          );

        const updatedWishlist =
          alreadyExists
            ? currentWishlist.filter(
                (item) =>
                  String(item.id) !==
                  String(movie.id)
              )
            : [
                ...currentWishlist,
                movie,
              ];

        const response =
          await axios.put<User>(
            `${API_URL}/${userId}`,
            {
              wishlist:
                updatedWishlist,
            }
          );

        return response.data;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Wishlist yenilənmədi!"
          )
        );
      }
    }
  );

export const logout =
  createAsyncThunk<
    null,
    void,
    {
      rejectValue: string;
    }
  >(
    "auth/logout",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        saveStoredUser(null);

        return null;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Çıxış zamanı xəta baş verdi"
          )
        );
      }
    }
  );

export const loginSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      setUser: (
        state,
        action: PayloadAction<
          User | null
        >
      ) => {
        state.user =
          action.payload;

        saveStoredUser(
          action.payload
        );
      },

      checkUser: (
        state,
        action: PayloadAction<LoginCredentials>
      ) => {
        state.status =
          "loading";

        state.error = null;

        const foundUser =
          state.users.find(
            (item) =>
              item.email ===
                action.payload.email &&
              item.password ===
                action.payload.password
          );

        if (foundUser) {
          state.user =
            foundUser;

          state.status =
            "succeeded";

          state.error =
            null;

          saveStoredUser(
            foundUser
          );
        } else {
          state.user =
            null;

          state.status =
            "failed";

          state.error =
            "E-poçt və ya şifrə yanlışdır!";
        }
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        .addCase(
          getLogin.pending,
          (state) => {
            state.status =
              "loading";

            state.error =
              null;
          }
        )

        .addCase(
          getLogin.fulfilled,
          (
            state,
            action
          ) => {
            state.status =
              "succeeded";

            state.users =
              action.payload;

            state.error =
              null;
          }
        )

        .addCase(
          getLogin.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "Məlumat yüklənmədi!";
          }
        )

        .addCase(
          updateUserProfile.pending,
          (state) => {
            state.status =
              "loading";

            state.error =
              null;
          }
        )

        .addCase(
          updateUserProfile.fulfilled,
          (
            state,
            action
          ) => {
            state.status =
              "succeeded";

            state.error =
              null;

            const updatedUser =
              action.payload;

            const userIndex =
              state.users.findIndex(
                (user) =>
                  String(
                    user.id
                  ) ===
                  String(
                    updatedUser.id
                  )
              );

            if (
              userIndex !== -1
            ) {
              state.users[
                userIndex
              ] =
                updatedUser;
            }

            if (
              state.user &&
              String(
                state.user.id
              ) ===
                String(
                  updatedUser.id
                )
            ) {
              state.user =
                updatedUser;

              saveStoredUser(
                updatedUser
              );
            }
          }
        )

        .addCase(
          updateUserProfile.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "İstifadəçi məlumatları yenilənmədi!";
          }
        )

        .addCase(
          updateWishlist.pending,
          (state) => {
            state.status =
              "loading";

            state.error =
              null;
          }
        )

        .addCase(
          updateWishlist.fulfilled,
          (
            state,
            action
          ) => {
            state.status =
              "succeeded";

            state.error =
              null;

            const updatedUser =
              action.payload;

            state.user =
              updatedUser;

            const userIndex =
              state.users.findIndex(
                (user) =>
                  String(
                    user.id
                  ) ===
                  String(
                    updatedUser.id
                  )
              );

            if (
              userIndex !== -1
            ) {
              state.users[
                userIndex
              ] =
                updatedUser;
            }

            saveStoredUser(
              updatedUser
            );
          }
        )

        .addCase(
          updateWishlist.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "Wishlist yenilənmədi!";
          }
        )

        .addCase(
          getUserControl.pending,
          (state) => {
            state.status =
              "loading";

            state.error =
              null;
          }
        )

        .addCase(
          getUserControl.fulfilled,
          (
            state,
            action
          ) => {
            state.status =
              "succeeded";

            state.user =
              action.payload;

            state.error =
              null;

            saveStoredUser(
              action.payload
            );
          }
        )

        .addCase(
          getUserControl.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "İstifadəçi məlumatı oxunmadı!";
          }
        )

        .addCase(
          logout.fulfilled,
          (state) => {
            state.user =
              null;

            state.status =
              "idle";

            state.error =
              null;

            saveStoredUser(
              null
            );
          }
        )

        .addCase(
          logout.rejected,
          (
            state,
            action
          ) => {
            state.status =
              "failed";

            state.error =
              action.payload ??
              "Çıxış zamanı xəta baş verdi";
          }
        );
    },
  });

export const {
  setUser,
  checkUser,
} = loginSlice.actions;

export default loginSlice.reducer;