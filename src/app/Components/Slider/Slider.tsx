"use client";

import React, { useEffect, useState } from "react";
import { useGlobalState, useOptimizedMemo, useOptimizedCallback } from "@/app/hooks";
import "./slider.css";
import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

const Slider: React.FC = () => {
  const goToDetail = useGoToDetail();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { films: data, error, dispatch, getFilms } = useGlobalState();

  useEffect(() => {
    if (!data.length) {
      dispatch(getFilms());
    }
  }, [dispatch, data.length]);

  const displayedSlides = useOptimizedMemo(() => {
    const filtered = data.filter(
      (film) => film.popular && film.year >= 2022 && film.imdb >= 7.5
    );

    const uniqueGenres = new Set();
    const uniqueFilms = [];

    for (const film of filtered) {
      const genre = film.category[0]; 
      if (!uniqueGenres.has(genre)) {
        uniqueGenres.add(genre);
        uniqueFilms.push(film);
      }
      if (uniqueFilms.length >= 4) break;
    }

    return uniqueFilms;
  }, [data]);

  useEffect(() => {
    if (displayedSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayedSlides.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [displayedSlides]);

  const handleThumbnailClick = useOptimizedCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  if (error) return <p>Xəta baş verdi: {error}</p>;

  return (
    <div className="slider">
      <div className="container">
        {displayedSlides.map((item, index) => (
          <div
            key={item.id}
            className={`slide ${currentSlide === index ? "active" : ""}`}
            style={{ transform: `translateX(${-currentSlide * 100}%)` }}
          >
            <div className="content">
              <h2>{item.title}</h2>
              <p>{item.category.join(", ")}</p>
            </div>
            {item.poster && (
              <div
                className="image"
                style={{
                  backgroundImage: `url(${item.poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  borderRadius: "10px",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: -1,
                  backgroundBlendMode: "overlay",
                  opacity: 0.7,
                  transition: "opacity 1.5s ease-in-out",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="thumbnails">
        {displayedSlides.map((item, index) => (
          <div
            key={`thumbnail-${index}`}
            className={`thumbnail ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <div className="thumbnail-bg"></div>
            {item.poster && <img src={item.poster} alt={item.title} />}
            <h3 onClick={() => goToDetail(item.id)}>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;

