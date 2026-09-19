"use client";

import React from "react";

import {
  useGlobalState,
  useOptimizedMemo,
} from "@/app/hooks";

import type {
  Film,
} from "@/app/redux/features/apiSlice/apiSlice";

import WishlistButton from "../WishlistButton/WishlistButton";

import {
  useGoToDetail,
} from "@/app/hooks/utilis/goToDetail";

import "./box.css";

const Box = () => {
  const goToDetail =
    useGoToDetail();

  const {
    films: data,
    error,
    dispatch,
    getFilms,
  } = useGlobalState();

  React.useEffect(() => {
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

  const filteredFilms =
    useOptimizedMemo<
      Film[]
    >(() => {
      const filtered =
        data.filter(
          (film) =>
            Number(
              film.imdb
            ) >= 8.5 &&
            film.popular
        );

      const uniqueGenres =
        new Set<string>();

      const uniqueFilms:
        Film[] = [];

      for (
        const film of
        filtered
      ) {
        const genre =
          film.category?.[
            0
          ];

        if (
          !genre ||
          uniqueGenres.has(
            genre
          )
        ) {
          continue;
        }

        uniqueGenres.add(
          genre
        );

        uniqueFilms.push(
          film
        );

        if (
          uniqueFilms.length >=
          3
        ) {
          break;
        }
      }

      return uniqueFilms;
    }, [data]);

  if (error) {
    return (
      <p>
        Xəta baş verdi:{" "}
        {error}
      </p>
    );
  }

  return (
    <div className="custom-wrapper">
      {filteredFilms.map(
        (item) => (
          <div
            className="custom-box"
            key={
              item.id
            }
          >
            <div className="custom-item">
              <img
                src={
                  item.poster
                }
                alt={
                  item.title
                }
              />

              <div className="wishIcon">
                <WishlistButton
                  movie={
                    item
                  }
                />
              </div>

              <div className="custom-overlay" />

              <div
                className="custom-text"
                onClick={() =>
                  goToDetail(
                    item.id
                  )
                }
              >
                <h5>
                  {
                    item.title
                  }
                </h5>

                <div className="imdb">
                  <span>
                    Year:{" "}
                    <em>
                      {
                        item.year
                      }
                    </em>
                  </span>

                  {" / "}

                  <span>
                    IMDB:{" "}
                    <em>
                      {
                        item.imdb
                      }
                    </em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Box;