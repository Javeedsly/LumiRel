"use client";
import React, { useEffect, useMemo, useState } from "react";
import "./actors.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";
import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

const ActorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: films, loading, error } = useSelector((state: RootState) => state.films);
  const goToDetail = useGoToDetail();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const actorsPerPage = 15;

  useEffect(() => {
    dispatch(getFilms());
  }, [dispatch]);

  const actors = useMemo(() => {
    const actorMap = new Map();

    films.forEach((film) => {
      film.actors.forEach((actor) => {
        if (!actorMap.has(actor.name)) {
          actorMap.set(actor.name, {
            ...actor,
            movies: [{ title: film.title, year: film.year, id: film.id }]
          });
        } else {
          actorMap.get(actor.name).movies.push({ title: film.title, year: film.year, id: film.id });
        }
      });
    });

    return Array.from(actorMap.values());
  }, [films]);


  const filteredActors = useMemo(() => {
    return actors.filter((actor) =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [actors, searchTerm]);

  const totalPages = Math.ceil(filteredActors.length / actorsPerPage);
  const indexOfLastActor = currentPage * actorsPerPage;
  const indexOfFirstActor = indexOfLastActor - actorsPerPage;
  const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <ProtectedRoute>
      <section className="actors-main-container">
        <h1 className="actors-main-title">🎭 Ünlü aktörler ve Filmleri</h1>
        <p className="actors-main-description">Aşağıdakı aktörlerın hangi filmlerde oynadıklarına bak!</p>

        <input
          type="text"
          placeholder="🔍 Actors..."
          className="actors-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && <p className="actors-loading-text">Məlumatlar yüklənir...</p>}
        {error && <p className="actors-error-text">Xəta baş verdi!</p>}

        <div className="actors-grid-container">
          {currentActors.length === 0 ? (
            <p className="actors-no-results">Bulunamadı! 🔍</p>
          ) : (
            currentActors.map((actor, index) => (
              <div key={index} className="actors-card">
                <img src={actor.image} alt={actor.name} className="actors-image" />
                <h3 className="actors-name">{actor.name}</h3>

                <div className="actors-movies">
                  <h4>🎬 Filmleri:</h4>
                  <ul>
                    {actor.movies.map((movie, i) => (
                      <li key={i} className="actors-film-item" onClick={() => goToDetail(movie.id)}>
                        {movie.title} ({movie.year})
                      </li>

                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="actors-pagination">
            <button
              className="actors-page-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ⬅ 
            </button>

            <span className="actors-page-number">
              {currentPage} / {totalPages}
            </span>

            <button
              className="actors-page-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
               ➡
            </button>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
};

export default ActorsPage;
