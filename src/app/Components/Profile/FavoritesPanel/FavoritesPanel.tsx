"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaArrowLeft,
  FaArrowRight,
  FaHeartBroken,
  FaStar,
} from "react-icons/fa";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import { updateWishlist } from "@/app/redux/features/authSlice/loginSlice";

import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

import "./favorites.css";

const FavoritesPanel = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const goToDetail =
    useGoToDetail();

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

  const [
    removingId,
    setRemovingId,
  ] =
    useState<
      string | null
    >(null);

  const favorites =
    user?.wishlist ??
    [];

  const favoritesPerPage =
    6;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        favorites.length /
          favoritesPerPage
      )
    );

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

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

      setRemovingId(
        String(
          movie.id
        )
      );

      try {
        await dispatch(
          updateWishlist({
            userId:
              user.id,

            movie,
          })
        ).unwrap();
      } catch (error) {
        console.error(
          "Favorite remove error:",
          error
        );
      } finally {
        setRemovingId(
          null
        );
      }
    };

  return (
    <section className="favorites-container">
      <div className="favorites-heading">
        <span>
          Your collection
        </span>

        <h2>
          Favorite Movies
        </h2>

        <p>
          {favorites.length} saved movies
        </p>
      </div>

      {favorites.length ===
      0 ? (
        <div className="no-favorites">
          <div>
            ♡
          </div>

          <h3>
            No favorites yet
          </h3>

          <p>
            Save movies from the catalog and
            they will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="favorites-grid">
            {currentFavorites.map(
              (movie) => (
                <article
                  key={
                    movie.id
                  }
                  className="favorite-card"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    goToDetail(
                      movie.id
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      goToDetail(
                        movie.id
                      );
                    }
                  }}
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

                  <div className="favorite-gradient" />

                  <div className="favorite-info">
                    <span>
                      {
                        movie.year
                      }
                    </span>

                    <h3>
                      {
                        movie.title
                      }
                    </h3>

                    <small>
                      <FaStar />

                      {movie.imdb ||
                        "N/A"}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="remove-favorite"
                    disabled={
                      removingId ===
                      String(
                        movie.id
                      )
                    }
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      handleRemove(
                        movie
                      );
                    }}
                    aria-label={`Remove ${movie.title} from favorites`}
                  >
                    <FaHeartBroken />
                  </button>
                </article>
              )
            )}
          </div>

          {totalPages > 1 && (
            <div className="favorites-pagination">
              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.max(
                        1,
                        previous - 1
                      )
                  )
                }
              >
                <FaArrowLeft />
              </button>

              <span>
                {currentPage}

                <small>
                  /
                  {totalPages}
                </small>
              </span>

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.min(
                        totalPages,
                        previous + 1
                      )
                  )
                }
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FavoritesPanel;