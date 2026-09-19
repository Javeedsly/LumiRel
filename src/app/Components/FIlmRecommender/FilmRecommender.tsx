"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaLightbulb,
  FaTimes,
} from "react-icons/fa";

import { IoDiceOutline } from "react-icons/io5";

import type { Film } from "@/app/redux/features/apiSlice/apiSlice";

import { useGlobalState } from "@/app/hooks";

import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

import WishlistButton from "../WishlistButton/WishlistButton";

import "./filmRecommender.css";

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question:
      "Kendini nasıl hissediyorsun?",
    options: [
      "Mutlu",
      "Üzgün",
      "Normal",
    ],
  },
  {
    id: 2,
    question:
      "Hangi türde filmleri seviyorsun?",
    options: [
      "Macera & Fantastik",
      "Aksiyon & Suç",
      "Korku & Gerilim",
      "Aile & Komedi",
      "Dram & Romantik",
    ],
  },
  {
    id: 3,
    question:
      "Hangi yıldan sonra olan filmler olsun?",
    options: [
      "2010’dan sonra",
      "2010’dan önce",
      "Fark etmez",
    ],
  },
  {
    id: 4,
    question:
      "Filmi kiminle izleyeceksin?",
    options: [
      "Ailem ile",
      "Sevgilim ile",
      "Arkadaşlarımla",
      "Tek",
    ],
  },
];

const FilmRecommender = () => {
  const goToDetail =
    useGoToDetail();

  const {
    films,
    filmsLoading,
    dispatch,
    getFilms,
  } =
    useGlobalState();

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] =
    useState(0);

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] =
    useState<string[]>(
      Array(
        questions.length
      ).fill("")
    );

  const [
    showMovies,
    setShowMovies,
  ] =
    useState(false);

  const [
    shuffleIndex,
    setShuffleIndex,
  ] =
    useState(0);

  useEffect(() => {
    if (
      films.length ===
      0
    ) {
      dispatch(
        getFilms()
      );
    }
  }, [
    dispatch,
    films.length,
    getFilms,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleEscape =
      (
        event:
          KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setIsOpen(
            false
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen]);

  const openModal =
    useCallback(() => {
      setSelectedAnswers(
        Array(
          questions.length
        ).fill("")
      );

      setCurrentQuestionIndex(
        0
      );

      setShuffleIndex(
        0
      );

      setShowMovies(
        false
      );

      setIsOpen(
        true
      );
    }, []);

  const closeModal =
    useCallback(() => {
      setIsOpen(
        false
      );
    }, []);

  const handleAnswerSelect =
    useCallback(
      (
        answer:
          string
      ) => {
        const nextAnswers =
          [
            ...selectedAnswers,
          ];

        nextAnswers[
          currentQuestionIndex
        ] =
          answer;

        setSelectedAnswers(
          nextAnswers
        );

        if (
          currentQuestionIndex <
          questions.length -
            1
        ) {
          setCurrentQuestionIndex(
            (previous) =>
              previous + 1
          );

          return;
        }

        setShuffleIndex(
          0
        );

        setShowMovies(
          true
        );
      },
      [
        currentQuestionIndex,
        selectedAnswers,
      ]
    );

  const filteredMovies =
    useMemo<Film[]>(() => {
      if (
        !showMovies
      ) {
        return [];
      }

      return films.filter(
        (film) => {
          if (
            film.deleted ||
            film.drafts
          ) {
            return false;
          }

          const categories =
            film.category ??
            [];

          const watchWith =
            film.watch_with ??
            [];

          const mood =
            selectedAnswers[
              0
            ];

          const category =
            selectedAnswers[
              1
            ];

          const yearAnswer =
            selectedAnswers[
              2
            ];

          const watchingWith =
            selectedAnswers[
              3
            ];

          const matchesMood =
            (mood ===
              "Mutlu" &&
              categories.includes(
                "Komedi"
              )) ||
            (mood ===
              "Üzgün" &&
              categories.includes(
                "Dram"
              )) ||
            mood ===
              "Normal";

          const matchesCategory =
            (category ===
              "Macera & Fantastik" &&
              categories.some(
                (item) =>
                  [
                    "Macera",
                    "Fantastik",
                    "Bilim Kurgu",
                  ].includes(
                    item
                  )
              )) ||
            (category ===
              "Aksiyon & Suç" &&
              categories.some(
                (item) =>
                  [
                    "Aksiyon",
                    "Suç",
                  ].includes(
                    item
                  )
              )) ||
            (category ===
              "Korku & Gerilim" &&
              categories.some(
                (item) =>
                  [
                    "Korku",
                    "Gerilim",
                    "Psikolojik",
                  ].includes(
                    item
                  )
              )) ||
            (category ===
              "Aile & Komedi" &&
              categories.some(
                (item) =>
                  [
                    "Aile",
                    "Komedi",
                  ].includes(
                    item
                  )
              )) ||
            (category ===
              "Dram & Romantik" &&
              categories.some(
                (item) =>
                  [
                    "Dram",
                    "Romantik",
                  ].includes(
                    item
                  )
              ));

          const movieYear =
            Number(
              film.year
            );

          const matchesYear =
            (yearAnswer ===
              "2010’dan sonra" &&
              movieYear >=
                2010) ||
            (yearAnswer ===
              "2010’dan önce" &&
              movieYear <
                2010) ||
            yearAnswer ===
              "Fark etmez";

          const matchesWatchingWith =
            (watchingWith ===
              "Ailem ile" &&
              watchWith.some(
                (item) =>
                  item.includes(
                    "Aile"
                  )
              )) ||
            (watchingWith ===
              "Sevgilim ile" &&
              watchWith.some(
                (item) =>
                  item.includes(
                    "Sevgilim"
                  )
              )) ||
            (watchingWith ===
              "Arkadaşlarımla" &&
              watchWith.some(
                (item) =>
                  item.includes(
                    "Arkadaş"
                  )
              )) ||
            (watchingWith ===
              "Tek" &&
              watchWith.some(
                (item) =>
                  [
                    "Tek",
                    "Tek Başına",
                  ].includes(
                    item
                  )
              ));

          return (
            matchesMood &&
            matchesCategory &&
            matchesYear &&
            matchesWatchingWith
          );
        }
      );
    }, [
      films,
      selectedAnswers,
      showMovies,
    ]);

  const visibleMovies =
    useMemo(() => {
      if (
        filteredMovies.length ===
        0
      ) {
        return [];
      }

      const count =
        Math.min(
          3,
          filteredMovies.length
        );

      return Array.from(
        {
          length:
            count,
        },
        (
          _,
          offset
        ) =>
          filteredMovies[
            (shuffleIndex +
              offset) %
              filteredMovies.length
          ]
      );
    }, [
      filteredMovies,
      shuffleIndex,
    ]);

  const shuffleMovies =
    () => {
      if (
        filteredMovies.length <=
        3
      ) {
        return;
      }

      setShuffleIndex(
        (previous) =>
          (previous + 3) %
          filteredMovies.length
      );
    };

  const progress =
    showMovies
      ? 100
      : ((currentQuestionIndex +
          1) /
          questions.length) *
        100;

  const currentQuestion =
    questions[
      currentQuestionIndex
    ];

  return (
    <div className="recommender-container">
      <button
        type="button"
        onClick={
          openModal
        }
        className="open-button"
        aria-label="Open movie recommender"
        title="Movie recommender"
      >
        <FaLightbulb className="bulb" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <motion.div
              className="modal"
              initial={{
                opacity: 0,
                y: 25,
                scale:
                  0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale:
                  0.98,
              }}
              transition={{
                duration:
                  0.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <button
                type="button"
                onClick={
                  closeModal
                }
                className="close-button"
                aria-label="Close recommender"
              >
                <FaTimes />
              </button>

              <div className="recommender-heading">
                <span>
                  LumiReel Match
                </span>

                <h2>
                  Find your movie
                </h2>

                <p>
                  Answer a few questions and
                  we&apos;ll suggest movies
                  from the LumiReel catalog.
                </p>
              </div>

              <div className="recommender-progress">
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              {filmsLoading &&
              films.length ===
                0 ? (
                <div className="recommender-loading">
                  <div className="loading-icon" />

                  Loading movies...
                </div>
              ) : showMovies ? (
                <div className="movies-container">
                  <div className="movies-result-heading">
                    <h3>
                      Recommended for you
                    </h3>

                    <span>
                      {filteredMovies.length} matches
                    </span>
                  </div>

                  {visibleMovies.length >
                  0 ? (
                    <div className="movies-list">
                      {visibleMovies.map(
                        (film) => (
                          <article
                            key={
                              film.id
                            }
                            className="movie-card"
                          >
                            <button
                              type="button"
                              className="movie-card-main"
                              onClick={() => {
                                goToDetail(
                                  film.id
                                );

                                closeModal();
                              }}
                            >
                              <img
                                src={
                                  film.poster
                                }
                                alt={
                                  film.title
                                }
                              />

                              <div className="select-info">
                                <span>
                                  {film.year}
                                </span>

                                <h3>
                                  {film.title}
                                </h3>

                                <p>
                                  {film.category
                                    ?.slice(
                                      0,
                                      2
                                    )
                                    .join(
                                      " • "
                                    ) ||
                                    film.genre}
                                </p>
                              </div>
                            </button>

                            <div className="favIcon">
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
                  ) : (
                    <div className="recommender-empty">
                      <h3>
                        No exact match
                      </h3>

                      <p>
                        Try different answers to get
                        another recommendation.
                      </p>

                      <button
                        type="button"
                        onClick={
                          openModal
                        }
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {filteredMovies.length >
                    3 && (
                    <button
                      type="button"
                      onClick={
                        shuffleMovies
                      }
                      className="shuffle-button"
                    >
                      <IoDiceOutline className="dice-icon" />

                      Shuffle
                    </button>
                  )}
                </div>
              ) : (
                <motion.div
                  key={
                    currentQuestion.id
                  }
                  className="question-container"
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                >
                  <span className="question-number">
                    0
                    {currentQuestionIndex +
                      1}
                    /0
                    {
                      questions.length
                    }
                  </span>

                  <h2 className="question">
                    {
                      currentQuestion.question
                    }
                  </h2>

                  <div className="options">
                    {currentQuestion.options.map(
                      (
                        option
                      ) => (
                        <button
                          type="button"
                          key={
                            option
                          }
                          onClick={() =>
                            handleAnswerSelect(
                              option
                            )
                          }
                          className="option-button"
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilmRecommender;