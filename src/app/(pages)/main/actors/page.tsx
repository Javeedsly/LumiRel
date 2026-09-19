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

import { motion } from "framer-motion";

import {
  FaFilm,
  FaSearch,
  FaStar,
  FaUser,
} from "react-icons/fa";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";

import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

import "./actors.css";

interface ActorMovie {
  id: string;
  title: string;
  year: string;
  imdb: string;
}

interface ActorWithMovies {
  name: string;
  image: string;
  movies: ActorMovie[];
}

const ActorsPage = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    data: films,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
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

  const actorsPerPage = 12;

  useEffect(() => {
    if (films.length === 0) {
      dispatch(getFilms());
    }
  }, [
    dispatch,
    films.length,
  ]);

  const actors = useMemo<
    ActorWithMovies[]
  >(() => {
    const actorMap =
      new Map<
        string,
        ActorWithMovies
      >();

    films
      .filter(
        (film) =>
          !film.deleted &&
          !film.drafts
      )
      .forEach((film) => {
        (
          film.actors ??
          []
        ).forEach((actor) => {
          if (!actor.name) {
            return;
          }

          const movie: ActorMovie = {
            id: film.id,
            title: film.title,
            year: film.year,
            imdb: film.imdb,
          };

          const existing =
            actorMap.get(
              actor.name
            );

          if (existing) {
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

                movies: [
                  movie,
                ],
              }
            );
          }
        });
      });

    return Array.from(
      actorMap.values()
    ).sort(
      (a, b) =>
        b.movies.length -
        a.movies.length
    );
  }, [films]);

  const filteredActors =
    useMemo(() => {
      const normalized =
        searchTerm
          .trim()
          .toLowerCase();

      if (!normalized) {
        return actors;
      }

      return actors.filter(
        (actor) =>
          actor.name
            .toLowerCase()
            .includes(
              normalized
            )
      );
    }, [
      actors,
      searchTerm,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredActors.length /
          actorsPerPage
      )
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    actorsPerPage;

  const currentActors =
    filteredActors.slice(
      startIndex,
      startIndex +
        actorsPerPage
    );

  return (
    <main className="actors-page">
      <section className="actors-hero">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="actors-eyebrow">
            <FaUser />
            LumiReel Cast
          </div>

          <h1>
            Meet the faces
            behind the stories.
          </h1>

          <p>
            Search actors and discover the
            movies they appear in across the
            LumiReel catalog.
          </p>

          <div className="actors-search">
            <FaSearch />

            <input
              type="search"
              placeholder="Search actors..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <section className="actors-content">
        <div className="actors-content-header">
          <div>
            <span>
              Directory
            </span>

            <h2>
              {filteredActors.length} Actors
            </h2>
          </div>
        </div>

        {loading &&
        films.length === 0 ? (
          <div className="actors-state">
            Loading actors...
          </div>
        ) : error ? (
          <div className="actors-state actors-state--error">
            {error}
          </div>
        ) : currentActors.length ===
          0 ? (
          <div className="actors-state">
            No actors found.
          </div>
        ) : (
          <div className="actors-grid">
            {currentActors.map(
              (actor, index) => (
                <motion.article
                  key={actor.name}
                  className="actor-card"
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
                      Math.min(
                        index,
                        8
                      ) *
                      0.03,
                  }}
                >
                  <div className="actor-image-wrap">
                    <img
                      src={actor.image}
                      alt={actor.name}
                    />

                    <div className="actor-movie-count">
                      <FaFilm />

                      {actor.movies.length}
                    </div>
                  </div>

                  <div className="actor-card-content">
                    <h3>
                      {actor.name}
                    </h3>

                    <span>
                      Featured movies
                    </span>

                    <div className="actor-film-list">
                      {actor.movies
                        .slice(0, 3)
                        .map(
                          (movie) => (
                            <button
                              key={
                                movie.id
                              }
                              type="button"
                              onClick={() =>
                                goToDetail(
                                  movie.id
                                )
                              }
                            >
                              <span>
                                {
                                  movie.title
                                }
                              </span>

                              <small>
                                <FaStar />

                                {movie.imdb ||
                                  movie.year}
                              </small>
                            </button>
                          )
                        )}
                    </div>

                    {actor.movies.length >
                      3 && (
                      <p className="actor-more">
                        +
                        {actor.movies.length -
                          3}{" "}
                        more movies
                      </p>
                    )}
                  </div>
                </motion.article>
              )
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="actors-pagination">
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
              Previous
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
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default ActorsPage;