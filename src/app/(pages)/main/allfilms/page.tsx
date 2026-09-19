"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import { motion } from "framer-motion";

import {
  FaFilm,
  FaStar,
} from "react-icons/fa";

import FilmsCarousel from "@/app/Components/FilmsCarousel/FilmsCarousel";

import WishlistButton from "@/app/Components/WishlistButton/WishlistButton";

import { useGlobalState } from "@/app/hooks";

import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

import "./allfilms.css";

const AllFilmsContent = () => {
  const {
    films,
    error,
    dispatch,
    getFilms,
  } = useGlobalState();

  const searchParams = useSearchParams();

  const selectedCategory =
    searchParams.get("genre") || "all";

  const goToDetail = useGoToDetail();

  const [visibleCount, setVisibleCount] =
    useState(18);

  useEffect(() => {
    if (films.length === 0) {
      dispatch(getFilms());
    }
  }, [
    dispatch,
    films.length,
    getFilms,
  ]);

  useEffect(() => {
    setVisibleCount(18);
  }, [selectedCategory]);

  const activeFilms = useMemo(
    () =>
      films.filter(
        (film) =>
          !film.deleted &&
          !film.drafts
      ),
    [films]
  );

  const filteredFilms = useMemo(() => {
    if (
      selectedCategory.toLowerCase() ===
      "all"
    ) {
      return activeFilms;
    }

    const normalized =
      selectedCategory.toLowerCase();

    return activeFilms.filter((film) => {
      const genreMatch =
        film.genre
          ?.toLowerCase()
          .includes(normalized);

      const categoryMatch =
        film.category?.some(
          (category) =>
            category
              .toLowerCase()
              .includes(normalized)
        );

      return genreMatch || categoryMatch;
    });
  }, [
    activeFilms,
    selectedCategory,
  ]);

  const latestMovies = useMemo(
    () =>
      [...activeFilms]
        .sort((a, b) => {
          const yearDifference =
            Number(b.year) -
            Number(a.year);

          if (yearDifference !== 0) {
            return yearDifference;
          }

          return (
            Number(b.imdb) -
            Number(a.imdb)
          );
        })
        .slice(0, 8),
    [activeFilms]
  );

  if (error) {
    return (
      <div className="allfilms-message allfilms-message--error">
        <span>Something went wrong</span>
        <p>{error}</p>
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="allfilms-message">
        <div className="allfilms-loader" />
        <span>Loading movies...</span>
      </div>
    );
  }

  return (
    <main className="main-allfilms">
      <div className="allfilms-ambient allfilms-ambient--one" />
      <div className="allfilms-ambient allfilms-ambient--two" />

      <section className="allfilms-hero">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <div className="allfilms-eyebrow">
            <FaFilm />
            LumiReel Library
          </div>

          <h1>
            Find something
            worth watching.
          </h1>

          <p>
            Explore the complete LumiReel
            catalog, discover new releases
            and revisit movies worth seeing
            again.
          </p>

          <div className="allfilms-stats">
            <div>
              <strong>
                {activeFilms.length}
              </strong>

              <span>
                Movies
              </span>
            </div>

            <div>
              <strong>
                {
                  new Set(
                    activeFilms.flatMap(
                      (film) =>
                        film.category ??
                        []
                    )
                  ).size
                }
              </strong>

              <span>
                Categories
              </span>
            </div>

            <div>
              <strong>
                Free
              </strong>

              <span>
                Access
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="allfilms-shell">
        <div className="allfilms-section-heading">
          <div>
            <span>Trending now</span>

            <h2>
              Popular Movies
            </h2>
          </div>
        </div>

        <FilmsCarousel />

        <section className="recent-section">
          <div className="allfilms-section-heading">
            <div>
              <span>
                Fresh picks
              </span>

              <h2>
                Recent Movies
              </h2>
            </div>
          </div>

          <div className="recent-grid">
            {latestMovies.map(
              (film, index) => (
                <motion.article
                  key={film.id}
                  className="recent-card"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.035,
                  }}
                >
                  <button
                    type="button"
                    className="recent-card-main"
                    onClick={() =>
                      goToDetail(film.id)
                    }
                  >
                    <img
                      src={film.poster}
                      alt={film.title}
                    />

                    <div className="recent-card-copy">
                      <span>
                        {film.year}
                      </span>

                      <h3>
                        {film.title}
                      </h3>

                      <div className="recent-rating">
                        <FaStar />

                        {film.imdb || "N/A"}
                      </div>
                    </div>
                  </button>

                  <div className="recent-wishlist">
                    <WishlistButton
                      movie={film}
                    />
                  </div>
                </motion.article>
              )
            )}
          </div>
        </section>

        <section className="catalog-section">
          <div className="allfilms-section-heading">
            <div>
              <span>
                Browse library
              </span>

              <h2>
                {selectedCategory === "all"
                  ? "All Movies"
                  : selectedCategory}
              </h2>
            </div>

            <span className="results-count">
              {filteredFilms.length} results
            </span>
          </div>

          {filteredFilms.length === 0 ? (
            <div className="catalog-empty">
              No movies found in this category.
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredFilms
                .slice(0, visibleCount)
                .map((film, index) => (
                  <motion.article
                    key={film.id}
                    className="catalog-card"
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                    transition={{
                      delay:
                        Math.min(
                          index,
                          8
                        ) * 0.025,
                    }}
                  >
                    <button
                      type="button"
                      className="catalog-card-main"
                      onClick={() =>
                        goToDetail(
                          film.id
                        )
                      }
                    >
                      <img
                        src={film.poster}
                        alt={film.title}
                      />

                      <div className="catalog-gradient" />

                      <div className="catalog-rating">
                        <FaStar />

                        {film.imdb || "N/A"}
                      </div>

                      <div className="catalog-copy">
                        <span>
                          {film.year}
                        </span>

                        <h3>
                          {film.title}
                        </h3>

                        <small>
                          {film.category
                            ?.slice(0, 2)
                            .join(" • ") ||
                            film.genre}
                        </small>
                      </div>
                    </button>

                    <div className="catalog-wishlist">
                      <WishlistButton
                        movie={film}
                      />
                    </div>
                  </motion.article>
                ))}
            </div>
          )}

          {visibleCount <
            filteredFilms.length && (
            <button
              type="button"
              className="load-more-button"
              onClick={() =>
                setVisibleCount(
                  (previous) =>
                    previous + 12
                )
              }
            >
              Load more movies
            </button>
          )}
        </section>
      </section>
    </main>
  );
};

const Page = () => (
  <Suspense
    fallback={
      <div className="allfilms-message">
        Loading...
      </div>
    }
  >
    <AllFilmsContent />
  </Suspense>
);

export default Page;