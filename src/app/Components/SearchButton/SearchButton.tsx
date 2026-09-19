"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useGlobalState,
  useOptimizedMemo,
} from "@/app/hooks";

import type {
  Film,
} from "@/app/redux/features/apiSlice/apiSlice";

import "./searchButton.css";

const SearchComponent = () => {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    debouncedQuery,
    setDebouncedQuery,
  ] =
    useState("");

  const [
    isExpanded,
    setIsExpanded,
  ] =
    useState(false);

  const {
    films: allMovies,
    dispatch,
    getFilms,
  } = useGlobalState();

  const router =
    useRouter();

  useEffect(() => {
    if (
      allMovies.length ===
      0
    ) {
      dispatch(
        getFilms()
      );
    }
  }, [
    dispatch,
    allMovies.length,
    getFilms,
  ]);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedQuery(
            query
          );
        },
        300
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [query]);

  const filteredMovies =
    useOptimizedMemo<
      Film[]
    >(() => {
      const normalized =
        debouncedQuery
          .trim()
          .toLowerCase();

      if (!normalized) {
        return [];
      }

      return allMovies.filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(
              normalized
            )
      );
    }, [
      debouncedQuery,
      allMovies,
    ]);

  const handleSuggestionClick =
    useCallback(
      (
        movie: Film
      ) => {
        router.push(
          `/main/${movie.id}`
        );

        setQuery("");

        setDebouncedQuery(
          ""
        );

        setIsExpanded(
          false
        );
      },
      [router]
    );

  const handleSearchButtonClick =
    () => {
      const firstMovie =
        filteredMovies[0];

      if (firstMovie) {
        handleSuggestionClick(
          firstMovie
        );
      }
    };

  return (
    <div className="search-container">
      <div
        className={`search-box ${
          isExpanded
            ? "expanded"
            : "collapsed"
        }`}
      >
        <input
          ref={
            inputRef
          }
          type="text"
          className="search-input"
          placeholder="Film adı yaz..."
          value={
            query
          }
          onChange={(
            event
          ) =>
            setQuery(
              event.target
                .value
            )
          }
          onFocus={() =>
            setIsExpanded(
              true
            )
          }
          onBlur={() => {
            window.setTimeout(
              () => {
                setIsExpanded(
                  false
                );

                setQuery("");
              },
              200
            );
          }}
          onKeyDown={(
            event
          ) => {
            if (
              event.key ===
              "Enter"
            ) {
              const firstMovie =
                filteredMovies[
                  0
                ];

              if (
                firstMovie
              ) {
                handleSuggestionClick(
                  firstMovie
                );
              }
            }
          }}
        />

        <button
          type="button"
          className="search-button"
          onClick={
            handleSearchButtonClick
          }
        >
          🔍
        </button>
      </div>

      {debouncedQuery.trim() !==
        "" && (
        <div className="search-results">
          {filteredMovies.length >
          0 ? (
            <ul className="search-suggestions">
              {filteredMovies.map(
                (movie) => (
                  <li
                    key={
                      movie.id
                    }
                    className="search-suggestion-item"
                    onClick={() =>
                      handleSuggestionClick(
                        movie
                      )
                    }
                  >
                    <div className="sugItem">
                      <img
                        src={
                          movie.poster
                        }
                        alt={
                          movie.title
                        }
                      />

                      {
                        movie.title
                      }
                    </div>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="no-results">
              Film tapılmadı
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;