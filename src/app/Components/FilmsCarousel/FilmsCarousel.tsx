"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import "./filmscarousel.css";
import WishlistButton from "../WishlistButton/WishlistButton";
import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";
import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

const FilmsCarousel = () => {
  const goToDetail = useGoToDetail();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.films
  );

  const [slidesPerView, setSlidesPerView] = useState(5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (data.length === 0) {
      console.log("FilmsCarousel Component Mounted, dispatching getFilms()");
      dispatch(getFilms());
    }
  }, [dispatch, data.length]);

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 400) setSlidesPerView(1);
      else if (width < 768) setSlidesPerView(2);
      else if (width < 1024) setSlidesPerView(3);
      else if (width < 1280) setSlidesPerView(4);
      else setSlidesPerView(5);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const loopedMovies = data.length < slidesPerView
    ? [...data, ...data, ...data]
    : [...data, ...data];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        (prevIndex + 1) % loopedMovies.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [loopedMovies.length]);

  const popularMovies = data.filter((film) => film.popular === true);

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta baş verdi: {error}</p>;
  if (!popularMovies.length) return <p>Populyar filmlər tapılmadı.</p>;

  return (
    <div className="allfilms-container">
      <div className="allfilms-slide">
        {loopedMovies
          .slice(index, index + slidesPerView)
          .map((film, i) => (
            <div key={i} className="film-card">
              <img src={film.poster} alt={film.title} className="film-image" />
              <div className="film-info-carousel">
                <h2 onClick={() => goToDetail(film.id)}>{film.title}</h2>
                <p>
                  <strong>IMDb:</strong> {film.imdb || "7.5"}
                </p>
              </div>
              <div className="wishicon">
                <WishlistButton movie={film} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FilmsCarousel;
