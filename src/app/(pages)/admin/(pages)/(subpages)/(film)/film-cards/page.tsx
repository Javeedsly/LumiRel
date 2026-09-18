"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import "./cards.css";
import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";
import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";

export default function FilmsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: films } = useSelector((state) => state.films);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 10;

  useEffect(() => {
    dispatch(getFilms());
  }, [dispatch]);

  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  return (
    <div className="layout">
      <Aside />
      <main>
        <div className="films-container">
          <h1 className="films-title">Filmlər</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Film axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="card-grid">
            {currentFilms.map((film) => (
              <div
                key={film.id}
                className="custom-card"
                onClick={() => router.push(`/admin/films/${film.id}`)}
              >
                <img
                  src={film.poster}
                  alt={film.title}
                  className="film-image"
                />
                <div className="card-content">
                  <h3 className="film-title">{film.title}</h3>
                  <p className="film-info">
                    {film.year} - {film.genre}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredFilms.length / filmsPerPage) },
              (_, index) => (
                <button
                  key={index}
                  className="page-button"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
