"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Snackbar, Alert } from "@mui/material";

import "./add.css";

import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";
import type { AppDispatch } from "@/app/redux/store/store";
import { postFilm } from "@/app/redux/features/apiSlice/apiSlice";

interface Actor {
  name: string;
  image: string;
}

interface FilmComment {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  flames: number;
  users_who_liked: number[];
}

interface AddFilmFormValues {
  id: string;
  title: string;
  year: string;
  poster: string;
  trailer: string;
  full_movie_link: string;
  genre: string;
  popular: boolean;
  imdb: string;

  // Form daxilində string saxlanılır.
  // Submit zamanı string[]-ə çevrilir.
  category: string;
  watch_with: string;
  subtitles: string;

  director: string;
  production_company: string;
  actors: Actor[];
  summary: string;
  duration: string;
  rating: string;
  is_family_friendly: boolean;
  language: string;
  country: string;

  comments: FilmComment[];
  favorites: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  drafts: boolean;
}

type SnackbarSeverity =
  | "success"
  | "error";

const initialValues: AddFilmFormValues = {
  id: "",
  title: "",
  year: "",
  poster: "",
  trailer: "",
  full_movie_link: "",
  genre: "",
  popular: false,
  imdb: "",

  category: "",

  director: "",
  production_company: "",

  actors: [
    {
      name: "",
      image: "",
    },
  ],

  summary: "",
  duration: "",
  rating: "",
  is_family_friendly: false,

  watch_with: "",

  language: "",

  subtitles: "",

  country: "",

  comments: [],
  favorites: 0,

  createdAt: "",
  updatedAt: "",

  deleted: false,
  drafts: true,
};

const AddFilmMultiStep = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    filmData,
    setFilmData,
  ] = useState<unknown>(null);

  const [
    snackbar,
    setSnackbar,
  ] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema =
    Yup.object({
      title: Yup.string().required(
        "Title is required"
      ),

      year: Yup.string().required(
        "Year is required"
      ),

      poster: Yup.string()
        .url("Invalid URL")
        .required(
          "Poster URL is required"
        ),

      trailer: Yup.string()
        .url("Invalid URL")
        .required(
          "Trailer URL is required"
        ),

      full_movie_link:
        Yup.string()
          .url("Invalid URL")
          .required(
            "Full movie link is required"
          ),

      genre: Yup.string().required(
        "Genre is required"
      ),

      imdb: Yup.number()
        .min(0)
        .max(10)
        .required(
          "IMDB rating is required"
        ),

      director:
        Yup.string().required(
          "Director is required"
        ),

      production_company:
        Yup.string().required(
          "Production company is required"
        ),

      duration:
        Yup.number().required(
          "Duration is required"
        ),

      rating: Yup.number()
        .min(0)
        .max(5)
        .required(
          "Rating is required"
        ),

      language:
        Yup.string().required(
          "Language is required"
        ),

      country:
        Yup.string().required(
          "Country is required"
        ),

      summary:
        Yup.string().required(
          "Summary is required"
        ),
    });

  const formik =
    useFormik<AddFilmFormValues>({
      initialValues,

      validationSchema,

      onSubmit: async (
        values,
        { resetForm }
      ) => {
        const now =
          new Date().toISOString();

        const processedValues = {
          ...values,

          category:
            values.category
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),

          watch_with:
            values.watch_with
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),

          subtitles:
            values.subtitles
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),

          createdAt:
            values.createdAt || now,

          updatedAt: now,
        };

        try {
          await dispatch(
            postFilm(processedValues)
          ).unwrap();

          setFilmData(
            processedValues
          );

          setSnackbar({
            open: true,
            message:
              "Film successfully added!",
            severity: "success",
          });

          resetForm();
          setCurrentStep(1);
        } catch (error) {
          console.error(
            "Error adding film:",
            error
          );

          setSnackbar({
            open: true,
            message:
              "Failed to add film!",
            severity: "error",
          });
        }
      },
    });

  const handleNext =
    async () => {
      const errors =
        await formik.validateForm();

      let stepErrors: Record<
        string,
        unknown
      > = {};

      if (currentStep === 1) {
        stepErrors = {
          title: errors.title,
          year: errors.year,
          poster: errors.poster,
          trailer:
            errors.trailer,
          full_movie_link:
            errors.full_movie_link,
          genre: errors.genre,
          imdb: errors.imdb,
        };
      }

      if (currentStep === 2) {
        stepErrors = {
          director:
            errors.director,

          production_company:
            errors.production_company,

          duration:
            errors.duration,

          rating:
            errors.rating,

          language:
            errors.language,

          country:
            errors.country,

          summary:
            errors.summary,
        };
      }

      const hasError =
        Object.values(
          stepErrors
        ).some(Boolean);

      if (hasError) {
        alert(
          "Please fill in all required fields in this step."
        );

        return;
      }

      setCurrentStep(
        (prev) => prev + 1
      );
    };

  const handleBack = () => {
    setCurrentStep(
      (prev) => prev - 1
    );
  };

  const handleCloseSnackbar =
    () => {
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }));
    };

  return (
    <div className="layout">
      <Aside />

      <main>
        <div className="add-film-container">
          <h2>
            Add New Film
          </h2>

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="add-film-form"
          >
            {currentStep === 1 && (
              <div className="form-step">
                <h3>
                  Primary Information
                </h3>

                <input
                  type="text"
                  placeholder="Title"
                  {...formik.getFieldProps(
                    "title"
                  )}
                />

                {formik.touched
                  .title &&
                  formik.errors
                    .title && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .title
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Year"
                  {...formik.getFieldProps(
                    "year"
                  )}
                />

                {formik.touched
                  .year &&
                  formik.errors
                    .year && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .year
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Poster URL"
                  {...formik.getFieldProps(
                    "poster"
                  )}
                />

                {formik.touched
                  .poster &&
                  formik.errors
                    .poster && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .poster
                      }
                    </div>
                  )}

                {formik.values
                  .poster && (
                  <img
                    src={
                      formik
                        .values
                        .poster
                    }
                    alt="Poster Preview"
                    className="poster-preview"
                  />
                )}

                <input
                  type="text"
                  placeholder="Trailer URL"
                  {...formik.getFieldProps(
                    "trailer"
                  )}
                />

                {formik.touched
                  .trailer &&
                  formik.errors
                    .trailer && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .trailer
                      }
                    </div>
                  )}

                {formik.values
                  .trailer && (
                  <iframe
                    src={
                      formik
                        .values
                        .trailer
                    }
                    title="Trailer Preview"
                    className="trailer-preview"
                  />
                )}

                <input
                  type="text"
                  placeholder="Full Movie Link"
                  {...formik.getFieldProps(
                    "full_movie_link"
                  )}
                />

                {formik.touched
                  .full_movie_link &&
                  formik.errors
                    .full_movie_link && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .full_movie_link
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Genre"
                  {...formik.getFieldProps(
                    "genre"
                  )}
                />

                {formik.touched
                  .genre &&
                  formik.errors
                    .genre && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .genre
                      }
                    </div>
                  )}

                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="IMDB Rating"
                  {...formik.getFieldProps(
                    "imdb"
                  )}
                />

                {formik.touched
                  .imdb &&
                  formik.errors
                    .imdb && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .imdb
                      }
                    </div>
                  )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h3>
                  Secondary Information
                </h3>

                <input
                  type="text"
                  placeholder="Director"
                  {...formik.getFieldProps(
                    "director"
                  )}
                />

                {formik.touched
                  .director &&
                  formik.errors
                    .director && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .director
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Production Company"
                  {...formik.getFieldProps(
                    "production_company"
                  )}
                />

                {formik.touched
                  .production_company &&
                  formik.errors
                    .production_company && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .production_company
                      }
                    </div>
                  )}

                <input
                  type="number"
                  min="1"
                  placeholder="Duration (minutes)"
                  {...formik.getFieldProps(
                    "duration"
                  )}
                />

                {formik.touched
                  .duration &&
                  formik.errors
                    .duration && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .duration
                      }
                    </div>
                  )}

                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Rating (out of 5)"
                  {...formik.getFieldProps(
                    "rating"
                  )}
                />

                {formik.touched
                  .rating &&
                  formik.errors
                    .rating && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .rating
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Language"
                  {...formik.getFieldProps(
                    "language"
                  )}
                />

                {formik.touched
                  .language &&
                  formik.errors
                    .language && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .language
                      }
                    </div>
                  )}

                <input
                  type="text"
                  placeholder="Country"
                  {...formik.getFieldProps(
                    "country"
                  )}
                />

                {formik.touched
                  .country &&
                  formik.errors
                    .country && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .country
                      }
                    </div>
                  )}

                <textarea
                  placeholder="Summary"
                  {...formik.getFieldProps(
                    "summary"
                  )}
                />

                {formik.touched
                  .summary &&
                  formik.errors
                    .summary && (
                    <div className="error">
                      {
                        formik
                          .errors
                          .summary
                      }
                    </div>
                  )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h3>
                  Additional Information
                </h3>

                <label>
                  <input
                    type="checkbox"
                    name="popular"
                    checked={
                      formik
                        .values
                        .popular
                    }
                    onChange={
                      formik
                        .handleChange
                    }
                    onBlur={
                      formik
                        .handleBlur
                    }
                  />
                  Popular
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="is_family_friendly"
                    checked={
                      formik
                        .values
                        .is_family_friendly
                    }
                    onChange={
                      formik
                        .handleChange
                    }
                    onBlur={
                      formik
                        .handleBlur
                    }
                  />
                  Family Friendly
                </label>

                <input
                  type="text"
                  placeholder="Category (comma separated)"
                  {...formik.getFieldProps(
                    "category"
                  )}
                />

                <input
                  type="text"
                  placeholder="Watch With (comma separated)"
                  {...formik.getFieldProps(
                    "watch_with"
                  )}
                />

                <input
                  type="text"
                  placeholder="Subtitles (comma separated)"
                  {...formik.getFieldProps(
                    "subtitles"
                  )}
                />

                <div className="actor-section">
                  <h4>
                    Actors
                  </h4>

                  {formik.values.actors.map(
                    (
                      actor,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="actor-item"
                      >
                        <input
                          type="text"
                          placeholder="Actor Name"
                          value={
                            actor.name
                          }
                          onChange={(
                            e
                          ) => {
                            const newActors =
                              [
                                ...formik
                                  .values
                                  .actors,
                              ];

                            newActors[
                              index
                            ] =
                              {
                                ...newActors[
                                  index
                                ],
                                name: e
                                  .target
                                  .value,
                              };

                            formik.setFieldValue(
                              "actors",
                              newActors
                            );
                          }}
                        />

                        <input
                          type="text"
                          placeholder="Actor Image URL"
                          value={
                            actor.image
                          }
                          onChange={(
                            e
                          ) => {
                            const newActors =
                              [
                                ...formik
                                  .values
                                  .actors,
                              ];

                            newActors[
                              index
                            ] =
                              {
                                ...newActors[
                                  index
                                ],
                                image:
                                  e
                                    .target
                                    .value,
                              };

                            formik.setFieldValue(
                              "actors",
                              newActors
                            );
                          }}
                        />
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue(
                        "actors",
                        [
                          ...formik
                            .values
                            .actors,
                          {
                            name: "",
                            image: "",
                          },
                        ]
                      );
                    }}
                  >
                    + Add Actor
                  </button>
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {currentStep >
                1 && (
                <button
                  type="button"
                  onClick={
                    handleBack
                  }
                  className="back-button"
                >
                  Back
                </button>
              )}

              {currentStep <
              3 ? (
                <button
                  type="button"
                  onClick={
                    handleNext
                  }
                  className="next-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-button"
                >
                  Add Film
                </button>
              )}
            </div>
          </form>

          {filmData !==
            null && (
            <div className="added-film-preview">
              <h3>
                Preview:
              </h3>

              <pre>
                {JSON.stringify(
                  filmData,
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        <Snackbar
          open={
            snackbar.open
          }
          autoHideDuration={
            3000
          }
          onClose={
            handleCloseSnackbar
          }
        >
          <Alert
            severity={
              snackbar.severity
            }
            onClose={
              handleCloseSnackbar
            }
            sx={{
              width: "100%",
            }}
          >
            {
              snackbar.message
            }
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default AddFilmMultiStep;