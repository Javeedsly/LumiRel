"use client";

import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useRouter } from "next/navigation";

import "./cards.css";

import {
  getFilms,
} from "@/app/redux/features/apiSlice/apiSlice";

import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

export default function FilmsPage() {
  const dispatch =
    useDispatch<AppDispatch>();

  const router = useRouter();

  const films = useSelector(
    (state: RootState) =>
      state.films.data
  );

  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const filmsPerPage = 10;

  useEffect(() => {
    dispatch(getFilms());
  }, [dispatch]);

  const filteredFilms =
    films.filter((film) =>
      film.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const indexOfLastFilm =
    currentPage * filmsPerPage;

  const indexOfFirstFilm =
    indexOfLastFilm -
    filmsPerPage;

  const currentFilms =
    filteredFilms.slice(
      indexOfFirstFilm,
      indexOfLastFilm
    );

  const totalPages =
    Math.ceil(
      filteredFilms.length /
        filmsPerPage
    );

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);

    setCurrentPage(1);
  };

  const handlePageChange = (
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="layout">
      <Aside />

      <main>
        <div className="films-container">
          <h1 className="films-title">
            Filmlər
          </h1>

          <input
            type="text"
            className="search-bar"
            placeholder="Film axtar..."
            value={search}
            onChange={
              handleSearch
            }
          />

          <div className="card-grid">
            {currentFilms.length >
            0 ? (
              currentFilms.map(
                (film) => (
                  <div
                    key={film.id}
                    className="custom-card"
                    onClick={() =>
                      router.push(
                        `/admin/films/${film.id}`
                      )
                    }
                  >
                    <img
                      src={
                        film.poster ||
                        "/default-movie.png"
                      }
                      alt={
                        film.title ||
                        "Film"
                      }
                      className="film-image"
                    />

                    <div className="card-content">
                      <h3 className="film-title">
                        {
                          film.title
                        }
                      </h3>

                      <p className="film-info">
                        {film.year} -{" "}
                        {film.genre}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p>
                Film tapılmadı.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) => {
                  const pageNumber =
                    index + 1;

                  return (
                    <button
                      key={
                        pageNumber
                      }
                      type="button"
                      className="page-button"
                      onClick={() =>
                        handlePageChange(
                          pageNumber
                        )
                      }
                    >
                      {
                        pageNumber
                      }
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}