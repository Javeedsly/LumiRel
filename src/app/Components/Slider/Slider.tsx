"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  motion,
} from "framer-motion";

import {
  FaArrowRight,
  FaPlay,
  FaStar,
} from "react-icons/fa";

import {
  useGlobalState,
  useOptimizedCallback,
  useOptimizedMemo,
} from "@/app/hooks";

import type {
  Film,
} from "@/app/redux/features/apiSlice/apiSlice";

import {
  useGoToDetail,
} from "@/app/hooks/utilis/goToDetail";

import "./slider.css";

const Slider = () => {
  const goToDetail =
    useGoToDetail();

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);

  const {
    films: data,
    filmsLoading,
    error,
    dispatch,
    getFilms,
  } = useGlobalState();

  useEffect(() => {
    if (
      data.length === 0
    ) {
      dispatch(
        getFilms()
      );
    }
  }, [
    dispatch,
    data.length,
    getFilms,
  ]);

  const displayedSlides =
    useOptimizedMemo<
      Film[]
    >(() => {
      const preferred =
        data
          .filter(
            (film) =>
              film.popular &&
              Number(
                film.year
              ) >= 2020
          )
          .sort(
            (a, b) =>
              Number(
                b.imdb
              ) -
              Number(
                a.imdb
              )
          );

      const fallback =
        [...data].sort(
          (a, b) =>
            Number(
              b.imdb
            ) -
            Number(
              a.imdb
            )
        );

      const combined = [
        ...preferred,
        ...fallback,
      ];

      const unique:
        Film[] = [];

      const ids =
        new Set<string>();

      for (
        const film of
        combined
      ) {
        if (
          ids.has(
            String(
              film.id
            )
          )
        ) {
          continue;
        }

        ids.add(
          String(
            film.id
          )
        );

        unique.push(
          film
        );

        if (
          unique.length ===
          4
        ) {
          break;
        }
      }

      return unique;
    }, [data]);

  useEffect(() => {
    if (
      displayedSlides.length <=
      1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setCurrentSlide(
            (previous) =>
              (previous +
                1) %
              displayedSlides.length
          );
        },
        9000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    displayedSlides.length,
  ]);

  useEffect(() => {
    if (
      currentSlide >=
      displayedSlides.length
    ) {
      setCurrentSlide(
        0
      );
    }
  }, [
    currentSlide,
    displayedSlides.length,
  ]);

  const handleThumbnailClick =
    useOptimizedCallback(
      (
        index: number
      ) => {
        setCurrentSlide(
          index
        );
      },
      []
    );

  if (
    filmsLoading &&
    displayedSlides.length ===
      0
  ) {
    return (
      <div className="slider slider--loading">
        <div className="hero-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="slider-error">
        Filmlər yüklənə
        bilmədi.
      </div>
    );
  }

  if (
    displayedSlides.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="slider">
      <div className="hero-frame">
        <div className="hero-noise" />

        <div className="container">
          {displayedSlides.map(
            (
              item,
              index
            ) => {
              const isActive =
                currentSlide ===
                index;

              return (
                <article
                  key={
                    item.id
                  }
                  className={`slide ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  style={{
                    transform: `translateX(${
                      -currentSlide *
                      100
                    }%)`,
                  }}
                >
                  <div
                    className="hero-image-backdrop"
                    style={{
                      backgroundImage:
                        `url(${item.poster})`,
                    }}
                    aria-hidden="true"
                  />

                  <div
                    className="hero-image-full"
                    style={{
                      backgroundImage:
                        `url(${item.poster})`,
                    }}
                    role="img"
                    aria-label={
                      item.title
                    }
                  />

                  <div className="hero-vignette" />

                  <motion.div
                    className="content"
                    animate={{
                      opacity:
                        isActive
                          ? 1
                          : 0.35,

                      y:
                        isActive
                          ? 0
                          : 12,
                    }}
                    transition={{
                      duration: 0.6,
                    }}
                  >
                    <div className="hero-kicker">
                      <span className="hero-dot" />

                      LumiReel Featured
                    </div>

                    <h1>
                      {
                        item.title
                      }
                    </h1>

                    <div className="hero-meta">
                      <span className="hero-rating">
                        <FaStar />

                        {item.imdb ||
                          "N/A"}
                      </span>

                      <span>
                        {
                          item.year
                        }
                      </span>

                      {item.duration && (
                        <span>
                          {
                            item.duration
                          }
                        </span>
                      )}

                      {item.language && (
                        <span>
                          {
                            item.language
                          }
                        </span>
                      )}
                    </div>

                    <div className="hero-genres">
                      {(
                        item.category ??
                        []
                      )
                        .slice(
                          0,
                          3
                        )
                        .map(
                          (
                            category
                          ) => (
                            <span
                              key={
                                category
                              }
                            >
                              {
                                category
                              }
                            </span>
                          )
                        )}
                    </div>

                    {item.summary && (
                      <p className="hero-summary">
                        {item.summary.length >
                        190
                          ? `${item.summary.slice(
                              0,
                              190
                            )}...`
                          : item.summary}
                      </p>
                    )}

                    <div className="hero-actions">
                      <button
                        type="button"
                        className="hero-primary"
                        onClick={() =>
                          goToDetail(
                            item.id
                          )
                        }
                      >
                        <FaPlay />

                        Watch Now
                      </button>

                      <Link
                        href="/main/allfilms"
                        className="hero-secondary"
                      >
                        Browse Movies

                        <FaArrowRight />
                      </Link>
                    </div>
                  </motion.div>
                </article>
              );
            }
          )}
        </div>
      </div>

      <div className="thumbnails">
        {displayedSlides.map(
          (
            item,
            index
          ) => (
            <button
              type="button"
              key={`thumbnail-${item.id}`}
              className={`thumbnail ${
                index ===
                currentSlide
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleThumbnailClick(
                  index
                )
              }
              aria-label={`${item.title} filmini göstər`}
            >
              <div className="thumbnail-bg" />

              <img
                src={
                  item.poster
                }
                alt=""
              />

              <div className="thumbnail-copy">
                <span>
                  {
                    item.title
                  }
                </span>

                <small>
                  IMDb{" "}
                  {
                    item.imdb
                  }
                </small>
              </div>
            </button>
          )
        )}
      </div>
    </section>
  );
};

export default Slider;