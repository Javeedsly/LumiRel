"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalState, useOptimizedMemo, useOptimizedCallback } from "@/app/hooks";
import debounce from "lodash.debounce";
import "./searchButton.css";

interface Movie {
  id: number;
  title: string;
  poster?: string;
}

const SearchComponent: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); 
  const [isExpanded, setIsExpanded] = useState(false);
  const { films: allMovies, dispatch, getFilms } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    if (!allMovies.length) {
      dispatch(getFilms());
    }
  }, [dispatch, allMovies.length]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query);
    }, 300);

    handler();
    return () => handler.cancel();
  }, [query]);

  const filteredMovies = useOptimizedMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allMovies]);

  const handleSuggestionClick = useOptimizedCallback((movie: Movie) => {
    router.push(`/main/${movie.id}`);
    setQuery("");
    setIsExpanded(false);
  }, []);

  const handleSearchButtonClick = () => {
    if (filteredMovies.length > 0) {
      handleSuggestionClick(filteredMovies[0]);
    }
  };

  return (
    <div className="search-container">
      <div className={`search-box ${isExpanded ? "expanded" : "collapsed"}`}>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Film adı yaz..."
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onFocus={() => setIsExpanded(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsExpanded(false);
              setQuery(""); 
            }, 200);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredMovies.length > 0) {
              handleSuggestionClick(filteredMovies[0]);
            }
          }}
        />
        <button
          className="search-button"
          onClick={handleSearchButtonClick}
        >
          🔍
        </button>
      </div>

      {(debouncedQuery.trim() !== "") && (
        <div className="search-results">
          {filteredMovies.length > 0 ? (
            <ul className="search-suggestions">
              {filteredMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="search-suggestion-item"
                  onClick={() => handleSuggestionClick(movie)}
                >
                  <div className="sugItem">
                    <img src={movie.poster} alt="" />
                    {movie.title}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results">Film tapılmadı</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
