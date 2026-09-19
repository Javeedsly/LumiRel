"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  motion,
} from "framer-motion";

import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import {
  getFilms,
} from "@/app/redux/features/apiSlice/apiSlice";

import {
  useGoToDetail,
} from "@/app/hooks/utilis/goToDetail";

import WishlistButton from "../WishlistButton/WishlistButton";

import "./filmscarousel.css";

const FilmsCarousel = () => {
  const goToDetail =
    useGoToDetail();

  const dispatch =
    useDispatch<AppDispatch>();

  const {
    data,
    loading,
    error,
  } =
    useSelector(
      (
        state:
          RootState
      ) =>
        state.films
    );

  const [
    slidesPerView,
    setSlidesPerView,
  ] =
    useState(5);

  const [
    index,
    setIndex,
  ] =
    useState(0);

  const [
    paused,
    setPaused,
  ] =
    useState(false);

  useEffect(() => {
    if (
      data.length ===
      0
    ) {
      dispatch(
        getFilms()
      );
    }
  }, [
    dispatch,
    data.length,
  ]);

  useEffect(() => {
    const update =
      () => {
        const width =
          window.innerWidth;

        if (
          width <
          520
        ) {
          setSlidesPerView(
            1
          );
        } else if (
          width <
          760
        ) {
          setSlidesPerView(
            2
          );
        } else if (
          width <
          1050
        ) {
          setSlidesPerView(
            3
          );
        } else if (
          width <
          1350
        ) {
          setSlidesPerView(
            4
          );
        } else {
          setSlidesPerView(
            5
          );
        }
      };

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  const popularMovies =
    useMemo(
      () =>
        data
          .filter(
            (film) =>
              film.popular &&
              !film.deleted &&
              !film.drafts
          )
          .sort(
            (a, b) =>
              Number(
                b.imdb
              ) -
              Number(
                a.imdb
              )
          ),
      [data]
    );

  useEffect(() => {
    if (
      paused ||
      popularMovies.length <=
        1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setIndex(
            (
              previous
            ) =>
              (previous +
                1) %
              popularMovies.length
          );
        },
        4500
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    paused,
    popularMovies.length,
  ]);

  useEffect(() => {
    if (
      index >=
      popularMovies.length
    ) {
      setIndex(
        0
      );
    }
  }, [
    index,
    popularMovies.length,
  ]);

  const visibleMovies =
    useMemo(
      () => {
        if (
          popularMovies.length ===
          0
        ) {
          return [];
        }

        const count =
          Math.min(
            slidesPerView,
            popularMovies.length
          );

        return Array.from(
          {
            length:
              count,
          },
          (
            _,
            offset
          ) =>
            popularMovies[
              (index +
                offset) %
                popularMovies.length
            ]
        );
      },
      [
        popularMovies,
        slidesPerView,
        index,
      ]
    );

  const previous =
    () => {
      if (
        popularMovies.length ===
        0
      ) {
        return;
      }

      setIndex(
        (
          current
        ) =>
          (current -
            1 +
            popularMovies.length) %
          popularMovies.length
      );
    };

  const next =
    () => {
      if (
        popularMovies.length ===
        0
      ) {
        return;
      }

      setIndex(
        (
          current
        ) =>
          (current +
            1) %
          popularMovies.length
      );
    };

  if (loading) {
    return (
      <div className="films-carousel-status">
        Popular movies
        loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="films-carousel-status">
        Movies could
        not be loaded.
      </div>
    );
  }

  if (
    popularMovies.length ===
    0
  ) {
    return (
      <div className="films-carousel-status">
        Popular movies
        not found.
      </div>
    );
  }

  return (
    <div
      className="allfilms-container"
      onMouseEnter={() =>
        setPaused(
          true
        )
      }
      onMouseLeave={() =>
        setPaused(
          false
        )
      }
    >
      <button
        type="button"
        className="films-nav films-nav--left"
        onClick={
          previous
        }
        aria-label="Previous movies"
      >
        <FaChevronLeft />
      </button>

      <div className="allfilms-slide">
        {visibleMovies.map(
          (
            film,
            position
          ) => (
            <motion.article
              key={`${film.id}-${position}`}
              className="film-card"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration:
                  0.3,

                delay:
                  position *
                  0.035,
              }}
            >
              <button
                type="button"
                className="film-card-main"
                onClick={() =>
                  goToDetail(
                    film.id
                  )
                }
              >
                <img
                  src={
                    film.poster
                  }
                  alt={
                    film.title
                  }
                  className="film-image"
                />

                <div className="film-card-gradient" />

                <div className="film-rating-badge">
                  <FaStar />

                  {
                    film.imdb
                  }
                </div>

                <div className="film-info-carousel">
                  <span className="film-year">
                    {
                      film.year
                    }
                  </span>

                  <h3>
                    {
                      film.title
                    }
                  </h3>

                  <span className="film-genre">
                    {film.category
                      ?.slice(
                        0,
                        2
                      )
                      .join(
                        " • "
                      ) ||
                      film.genre}
                  </span>
                </div>
              </button>

              <div
                className="wishicon"
                onClick={(
                  event
                ) =>
                  event.stopPropagation()
                }
              >
                <WishlistButton
                  movie={
                    film
                  }
                />
              </div>
            </motion.article>
          )
        )}
      </div>

      <button
        type="button"
        className="films-nav films-nav--right"
        onClick={
          next
        }
        aria-label="Next movies"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default FilmsCarousel;