"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import FilmsCarousel from "@/app/Components/FilmsCarousel/FilmsCarousel";

import WishlistButton from "@/app/Components/WishlistButton/WishlistButton";

import {
  useGlobalState,
  useOptimizedMemo,
} from "@/app/hooks";

import {
  useGoToDetail,
} from "@/app/hooks/utilis/goToDetail";

import "./allfilms.css";

const AllFilmsContent =
  () => {
    const {
      films: data,
      error,
      dispatch,
      getFilms,
    } = useGlobalState();

    const searchParams =
      useSearchParams();

    const selectedCategory =
      searchParams.get(
        "genre"
      ) || "all";

    const goToDetail =
      useGoToDetail();

    const [
      visibleCount,
      setVisibleCount,
    ] =
      useState(20);

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
      getFilms,
    ]);

    const filteredFilms =
      useOptimizedMemo(
        () => {
          if (
            selectedCategory ===
            "all"
          ) {
            return data;
          }

          return data.filter(
            (film) =>
              film.genre ===
              selectedCategory
          );
        },
        [
          selectedCategory,
          data,
        ]
      );

    const latestMovies =
      useOptimizedMemo(
        () =>
          data.filter(
            (film) =>
              Number(
                film.year
              ) >=
              2020
          ),
        [data]
      );

    if (error) {
      return (
        <p className="allfilms-message">
          Xəta baş
          verdi:{" "}
          {error}
        </p>
      );
    }

    if (
      !data.length
    ) {
      return (
        <p className="allfilms-message">
          Filmlər
          yüklənir...
        </p>
      );
    }

    return (
      <main className="main-allfilms">
        <section className="section-allfilms">
          <section>
            <h4>
              Popular
              Movies
            </h4>

            <FilmsCarousel />
          </section>

          <section className="poster-section">
            <h4>
              Recent
              Movies
            </h4>

            <div className="posters">
              {latestMovies
                .slice(
                  0,
                  12
                )
                .map(
                  (film) => (
                    <article
                      key={
                        film.id
                      }
                      className="poster-item"
                    >
                      <div className="imgP">
                        <img
                          src={
                            film.poster
                          }
                          alt={
                            film.title
                          }
                        />
                      </div>

                      <div className="poster-info">
                        <h5
                          onClick={() =>
                            goToDetail(
                              film.id
                            )
                          }
                        >
                          {
                            film.title
                          }
                        </h5>

                        <span>
                          {
                            film.year
                          }
                        </span>

                        <span>
                          IMDb:{" "}
                          {
                            film.imdb
                          }
                        </span>
                      </div>

                      <div className="like-section">
                        <WishlistButton
                          movie={
                            film
                          }
                        />
                      </div>
                    </article>
                  )
                )}
            </div>
          </section>

          <section className="category-film-section">
            <h4>
              {selectedCategory ===
              "all"
                ? "All Movies"
                : `${selectedCategory} Movies`}
            </h4>

            <div className="category-films-container">
              {filteredFilms
                .slice(
                  0,
                  visibleCount
                )
                .map(
                  (film) => (
                    <article
                      key={
                        film.id
                      }
                      className="category-film-item"
                    >
                      <img
                        src={
                          film.poster
                        }
                        alt={
                          film.title
                        }
                      />

                      <div
                        className="film-info"
                        onClick={() =>
                          goToDetail(
                            film.id
                          )
                        }
                      >
                        <h5>
                          {
                            film.title
                          }
                        </h5>

                        <span>
                          {
                            film.year
                          }
                        </span>

                        <span>
                          IMDb:{" "}
                          {
                            film.imdb
                          }
                        </span>
                      </div>

                      <div className="wish-icon">
                        <WishlistButton
                          movie={
                            film
                          }
                        />
                      </div>
                    </article>
                  )
                )}
            </div>

            {visibleCount <
              filteredFilms.length && (
              <button
                type="button"
                className="unveil-more-btn"
                onClick={() =>
                  setVisibleCount(
                    (
                      previous
                    ) =>
                      previous +
                      8
                  )
                }
              >
                Daha fazla
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
        Yüklənir...
      </div>
    }
  >
    <AllFilmsContent />
  </Suspense>
);

export default Page;