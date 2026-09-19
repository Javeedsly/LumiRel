import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type {
  RootState,
} from "@/app/redux/store/store";

import type {
  Film,
} from "@/app/redux/features/apiSlice/apiSlice";

interface FavoriteState {
  favorites: Film[];
}

const initialState:
  FavoriteState = {
  favorites: [],
};

const favoritesSlice =
  createSlice({
    name: "favorites",

    initialState,

    reducers: {
      addToFavorites: (
        state,
        action:
          PayloadAction<Film>
      ) => {
        const exists =
          state.favorites.some(
            (film) =>
              String(
                film.id
              ) ===
              String(
                action.payload
                  .id
              )
          );

        if (!exists) {
          state.favorites.push(
            action.payload
          );
        }
      },

      removeFromFavorites: (
        state,
        action:
          PayloadAction<
            string | number
          >
      ) => {
        state.favorites =
          state.favorites.filter(
            (film) =>
              String(
                film.id
              ) !==
              String(
                action.payload
              )
          );
      },
    },
  });

export const {
  addToFavorites,
  removeFromFavorites,
} =
  favoritesSlice.actions;

// Store-da ayrıca favorites reducer yoxdur.
// Hazırkı wishlist auth user daxilində saxlanılır.
export const selectFavorites =
  (
    state: RootState
  ): Film[] =>
    state.auth.user
      ?.wishlist ?? [];

export default favoritesSlice.reducer;