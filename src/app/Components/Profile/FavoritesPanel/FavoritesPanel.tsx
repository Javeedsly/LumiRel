"use client";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useState,
} from "react";

import {
  Button,
} from "@mui/material";

import {
  FaHeartBroken,
} from "react-icons/fa";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import {
  updateWishlist,
} from "@/app/redux/features/authSlice/loginSlice";

import "./favorites.css";

const FavoritesPanel = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(1);

  const favoritesPerPage =
    5;

  const favorites =
    user?.wishlist ?? [];

  const totalPages =
    Math.ceil(
      favorites.length /
        favoritesPerPage
    );

  const startIndex =
    (currentPage - 1) *
    favoritesPerPage;

  const currentFavorites =
    favorites.slice(
      startIndex,
      startIndex +
        favoritesPerPage
    );

  const handleRemove =
    async (
      movie:
        (typeof favorites)[number]
    ) => {
      if (!user) {
        return;
      }

      await dispatch(
        updateWishlist({
          userId:
            user.id,

          movie,
        })
      );
    };

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">
        ❤️ Beyenilen Filmler
      </h2>

      {currentFavorites.length >
      0 ? (
        <>
          <div className="favorites-grid">
            {currentFavorites.map(
              (movie) => (
                <div
                  key={
                    movie.id
                  }
                  className="favorite-card"
                >
                  <img
                    src={
                      movie.poster
                    }
                    alt={
                      movie.title
                    }
                    className="favorite-poster"
                  />

                  <div className="favorite-info">
                    <h3 className="favorite-title">
                      {
                        movie.title
                      }
                    </h3>

                    <p className="favorite-year">
                      📅{" "}
                      {
                        movie.year
                      }
                    </p>

                    <Button
                      onClick={() =>
                        handleRemove(
                          movie
                        )
                      }
                      color="error"
                      variant="contained"
                      size="small"
                      className="remove-favorite"
                    >
                      <FaHeartBroken />{" "}
                      Sil
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>

          {totalPages >
            1 && (
            <div className="favorites-pagination">
              <button
                className="pagination-button"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      previous
                    ) =>
                      previous -
                      1
                  )
                }
              >
                ⬅
              </button>

              <span className="pagination-info">
                {currentPage} /{" "}
                {totalPages}
              </span>

              <button
                className="pagination-button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      previous
                    ) =>
                      previous +
                      1
                  )
                }
              >
                ➡
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="no-favorites">
          Favoriler boş.
        </p>
      )}
    </div>
  );
};

export default FavoritesPanel;