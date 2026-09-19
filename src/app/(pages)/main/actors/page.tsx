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

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import {
  getFilms,
} from "@/app/redux/features/apiSlice/apiSlice";

import {
  useGoToDetail,
} from "@/app/hooks/utilis/goToDetail";

import "./actors.css";

interface ActorMovie {
  id: string;
  title: string;
  year: string;
}

interface ActorWithMovies {
  name: string;
  image: string;
  movies:
    ActorMovie[];
}

const ActorsPage =
  () => {
    const dispatch =
      useDispatch<AppDispatch>();

    const {
      data: films,
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

    const goToDetail =
      useGoToDetail();

    const [
      searchTerm,
      setSearchTerm,
    ] =
      useState("");

    const [
      currentPage,
      setCurrentPage,
    ] =
      useState(1);

    const actorsPerPage =
      15;

    useEffect(() => {
      dispatch(
        getFilms()
      );
    }, [dispatch]);

    const actors =
      useMemo<
        ActorWithMovies[]
      >(() => {
        const actorMap =
          new Map<
            string,
            ActorWithMovies
          >();

        films.forEach(
          (film) => {
            film.actors.forEach(
              (actor) => {
                const movie:
                  ActorMovie =
                  {
                    id:
                      film.id,

                    title:
                      film.title,

                    year:
                      film.year,
                  };

                const existing =
                  actorMap.get(
                    actor.name
                  );

                if (
                  existing
                ) {
                  existing.movies.push(
                    movie
                  );
                } else {
                  actorMap.set(
                    actor.name,
                    {
                      name:
                        actor.name,

                      image:
                        actor.image,

                      movies:
                        [
                          movie,
                        ],
                    }
                  );
                }
              }
            );
          }
        );

        return Array.from(
          actorMap.values()
        );
      }, [films]);

    const filteredActors =
      useMemo(
        () =>
          actors.filter(
            (actor) =>
              actor.name
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                )
          ),
        [
          actors,
          searchTerm,
        ]
      );

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredActors.length /
            actorsPerPage
        )
      );

    const firstIndex =
      (currentPage -
        1) *
      actorsPerPage;

    const currentActors =
      filteredActors.slice(
        firstIndex,
        firstIndex +
          actorsPerPage
      );

    useEffect(() => {
      setCurrentPage(
        1
      );
    }, [searchTerm]);

    return (
      <section className="actors-main-container">
        <h1 className="actors-main-title">
          🎭 Actors
          and Movies
        </h1>

        <p className="actors-main-description">
          Discover
          actors and the
          movies they
          appear in.
        </p>

        <input
          type="search"
          placeholder="🔍 Search actors..."
          className="actors-search-input"
          value={
            searchTerm
          }
          onChange={(
            event
          ) =>
            setSearchTerm(
              event.target
                .value
            )
          }
        />

        {loading && (
          <p className="actors-loading-text">
            Loading...
          </p>
        )}

        {error && (
          <p className="actors-error-text">
            Xəta baş
            verdi.
          </p>
        )}

        <div className="actors-grid-container">
          {currentActors.length ===
          0 ? (
            <p className="actors-no-results">
              Actor
              tapılmadı.
            </p>
          ) : (
            currentActors.map(
              (actor) => (
                <article
                  key={
                    actor.name
                  }
                  className="actors-card"
                >
                  <img
                    src={
                      actor.image
                    }
                    alt={
                      actor.name
                    }
                    className="actors-image"
                  />

                  <h3 className="actors-name">
                    {
                      actor.name
                    }
                  </h3>

                  <div className="actors-movies">
                    <h4>
                      🎬 Movies
                    </h4>

                    <ul>
                      {actor.movies.map(
                        (
                          movie
                        ) => (
                          <li
                            key={
                              movie.id
                            }
                            className="actors-film-item"
                            onClick={() =>
                              goToDetail(
                                movie.id
                              )
                            }
                          >
                            {
                              movie.title
                            }{" "}
                            (
                            {
                              movie.year
                            }
                            )
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </article>
              )
            )
          )}
        </div>

        {totalPages >
          1 && (
          <div className="actors-pagination">
            <button
              type="button"
              className="actors-page-button"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (
                    previous
                  ) =>
                    Math.max(
                      1,
                      previous -
                        1
                    )
                )
              }
            >
              ⬅
            </button>

            <span className="actors-page-number">
              {
                currentPage
              }{" "}
              /{" "}
              {
                totalPages
              }
            </span>

            <button
              type="button"
              className="actors-page-button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (
                    previous
                  ) =>
                    Math.min(
                      totalPages,
                      previous +
                        1
                    )
                )
              }
            >
              ➡
            </button>
          </div>
        )}
      </section>
    );
  };

export default ActorsPage;