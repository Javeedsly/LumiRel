"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";

import type {
  AppDispatch,
} from "@/app/redux/store/store";

import {
  updateFilm,
} from "@/app/redux/features/apiSlice/apiSlice";

import type {
  Film,
  Actor,
} from "@/app/redux/features/apiSlice/apiSlice";

import "./edit.css";

const steps = [
  "Primary Info",
  "Secondary Info",
  "Additional Info",
];

interface EditFilmModalProps {
  open: boolean;
  handleClose: () => void;
  film: Film;
}

interface FilmFormValues {
  title: string;
  year: string;
  poster: string;
  trailer: string;
  full_movie_link: string;
  genre: string;
  popular: boolean;
  imdb: string;
  director: string;
  production_company: string;
  duration: string;
  rating: string;
  language: string;
  country: string;
  summary: string;

  category: string;
  watch_with: string;
  subtitles: string;

  actors: Actor[];

  deleted: boolean;
  drafts: boolean;
}

const validationSchema =
  Yup.object({
    title: Yup.string()
      .trim()
      .required(
        "Title is required"
      ),

    year: Yup.string()
      .trim()
      .required(
        "Year is required"
      ),

    poster: Yup.string()
      .trim()
      .url(
        "Invalid URL"
      )
      .required(
        "Poster URL is required"
      ),

    trailer: Yup.string()
      .trim()
      .url(
        "Invalid URL"
      )
      .required(
        "Trailer URL is required"
      ),

    full_movie_link:
      Yup.string()
        .trim()
        .url(
          "Invalid URL"
        )
        .required(
          "Full movie link is required"
        ),

    genre: Yup.string()
      .trim()
      .required(
        "Genre is required"
      ),

    imdb: Yup.number()
      .typeError(
        "IMDB must be a number"
      )
      .min(
        0,
        "IMDB cannot be less than 0"
      )
      .max(
        10,
        "IMDB cannot be greater than 10"
      )
      .required(
        "IMDB rating is required"
      ),

    director: Yup.string()
      .trim()
      .required(
        "Director is required"
      ),

    production_company:
      Yup.string()
        .trim()
        .required(
          "Production company is required"
        ),

    duration: Yup.number()
      .typeError(
        "Duration must be a number"
      )
      .positive(
        "Duration must be greater than 0"
      )
      .required(
        "Duration is required"
      ),

    rating: Yup.number()
      .typeError(
        "Rating must be a number"
      )
      .min(
        0,
        "Rating cannot be less than 0"
      )
      .max(
        5,
        "Rating cannot be greater than 5"
      )
      .required(
        "Rating is required"
      ),

    language: Yup.string()
      .trim()
      .required(
        "Language is required"
      ),

    country: Yup.string()
      .trim()
      .required(
        "Country is required"
      ),

    summary: Yup.string()
      .trim()
      .required(
        "Summary is required"
      ),

    category: Yup.string(),

    watch_with:
      Yup.string(),

    subtitles:
      Yup.string(),
  });

const EditFilmModal = ({
  open,
  handleClose,
  film,
}: EditFilmModalProps) => {
  const dispatch =
    useDispatch<AppDispatch>();

  const [
    activeStep,
    setActiveStep,
  ] = useState(0);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const initialValues:
    FilmFormValues = {
    title:
      film.title ?? "",

    year:
      film.year ?? "",

    poster:
      film.poster ?? "",

    trailer:
      film.trailer ?? "",

    full_movie_link:
      film.full_movie_link ??
      "",

    genre:
      film.genre ?? "",

    popular:
      film.popular ?? false,

    imdb:
      film.imdb ?? "",

    director:
      film.director ?? "",

    production_company:
      film.production_company ??
      "",

    duration:
      film.duration ?? "",

    rating:
      film.rating ?? "",

    language:
      film.language ?? "",

    country:
      film.country ?? "",

    summary:
      film.summary ?? "",

    category:
      Array.isArray(
        film.category
      )
        ? film.category.join(
            ", "
          )
        : "",

    watch_with:
      Array.isArray(
        film.watch_with
      )
        ? film.watch_with.join(
            ", "
          )
        : "",

    subtitles:
      Array.isArray(
        film.subtitles
      )
        ? film.subtitles.join(
            ", "
          )
        : "",

    actors:
      Array.isArray(
        film.actors
      )
        ? film.actors
        : [],

    deleted:
      film.deleted ?? false,

    drafts:
      film.drafts ?? false,
  };

  const formik =
    useFormik<FilmFormValues>({
      initialValues,

      enableReinitialize:
        true,

      validationSchema,

      onSubmit: async (
        values,
        {
          setSubmitting,
        }
      ) => {
        try {
          const category =
            values.category
              .split(",")
              .map(
                (
                  item: string
                ) =>
                  item.trim()
              )
              .filter(
                (
                  item: string
                ) =>
                  item.length >
                  0
              );

          const watchWith =
            values.watch_with
              .split(",")
              .map(
                (
                  item: string
                ) =>
                  item.trim()
              )
              .filter(
                (
                  item: string
                ) =>
                  item.length >
                  0
              );

          const subtitles =
            values.subtitles
              .split(",")
              .map(
                (
                  item: string
                ) =>
                  item.trim()
              )
              .filter(
                (
                  item: string
                ) =>
                  item.length >
                  0
              );

          const updatedFilm:
            Partial<Film> = {
            title:
              values.title.trim(),

            year:
              values.year.trim(),

            poster:
              values.poster.trim(),

            trailer:
              values.trailer.trim(),

            full_movie_link:
              values.full_movie_link.trim(),

            genre:
              values.genre.trim(),

            popular:
              values.popular,

            imdb:
              values.imdb.trim(),

            director:
              values.director.trim(),

            production_company:
              values.production_company.trim(),

            duration:
              values.duration.trim(),

            rating:
              values.rating.trim(),

            language:
              values.language.trim(),

            country:
              values.country.trim(),

            summary:
              values.summary.trim(),

            category,

            watch_with:
              watchWith,

            subtitles,

            actors:
              values.actors,

            deleted:
              values.deleted,

            drafts:
              values.drafts,

            updatedAt:
              new Date().toISOString(),
          };

          await dispatch(
            updateFilm({
              id: film.id,
              data:
                updatedFilm,
            })
          ).unwrap();

          setErrorMessage(
            ""
          );

          setSuccessMessage(
            true
          );

          setActiveStep(
            0
          );

          handleClose();
        } catch (error) {
          console.error(
            "Film update error:",
            error
          );

          setErrorMessage(
            typeof error ===
              "string"
              ? error
              : "Film could not be updated."
          );
        } finally {
          setSubmitting(
            false
          );
        }
      },
    });

  const getFieldError = (
    field:
      | "title"
      | "year"
      | "poster"
      | "trailer"
      | "full_movie_link"
      | "genre"
      | "imdb"
      | "director"
      | "production_company"
      | "duration"
      | "rating"
      | "language"
      | "country"
      | "summary"
  ): string => {
    const touched =
      formik.touched[
        field
      ];

    const error =
      formik.errors[
        field
      ];

    if (
      touched &&
      typeof error ===
        "string"
    ) {
      return error;
    }

    return "";
  };

  const handleBack = () => {
    setActiveStep(
      (previousStep) =>
        Math.max(
          previousStep - 1,
          0
        )
    );
  };

  const handleNext = async () => {
    const errors =
      await formik.validateForm();

    let fieldsToCheck:
      Array<
        keyof FilmFormValues
      > = [];

    if (
      activeStep === 0
    ) {
      fieldsToCheck = [
        "title",
        "year",
        "poster",
        "trailer",
        "full_movie_link",
        "genre",
        "imdb",
      ];
    }

    if (
      activeStep === 1
    ) {
      fieldsToCheck = [
        "director",
        "production_company",
        "duration",
        "rating",
        "language",
        "country",
        "summary",
      ];
    }

    const hasError =
      fieldsToCheck.some(
        (field) =>
          Boolean(
            errors[field]
          )
      );

    fieldsToCheck.forEach(
      (field) => {
        formik.setFieldTouched(
          field,
          true,
          false
        );
      }
    );

    if (hasError) {
      return;
    }

    setActiveStep(
      (previousStep) =>
        Math.min(
          previousStep + 1,
          steps.length - 1
        )
    );
  };

  const handleModalClose =
    () => {
      setActiveStep(0);

      formik.resetForm();

      setErrorMessage("");

      handleClose();
    };

  return (
    <>
      <Modal
        open={open}
        onClose={
          handleModalClose
        }
      >
        <Box className="modal-box">
          <Typography
            variant="h6"
            className="modal-title"
          >
            Edit Film -{" "}
            {film.title}
          </Typography>

          <Stepper
            activeStep={
              activeStep
            }
            alternativeLabel
          >
            {steps.map(
              (label) => (
                <Step
                  key={
                    label
                  }
                >
                  <StepLabel>
                    {
                      label
                    }
                  </StepLabel>
                </Step>
              )
            )}
          </Stepper>

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="edit-form"
          >
            {activeStep ===
              0 && (
              <div className="step-container">
                <TextField
                  label="Title"
                  {...formik.getFieldProps(
                    "title"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "title"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "title"
                    )
                  }
                />

                <TextField
                  label="Year"
                  {...formik.getFieldProps(
                    "year"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "year"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "year"
                    )
                  }
                />

                <TextField
                  label="Poster URL"
                  {...formik.getFieldProps(
                    "poster"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "poster"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "poster"
                    )
                  }
                />

                <TextField
                  label="Trailer URL"
                  {...formik.getFieldProps(
                    "trailer"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "trailer"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "trailer"
                    )
                  }
                />

                <TextField
                  label="Full Movie Link"
                  {...formik.getFieldProps(
                    "full_movie_link"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "full_movie_link"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "full_movie_link"
                    )
                  }
                />

                <TextField
                  label="Genre"
                  {...formik.getFieldProps(
                    "genre"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "genre"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "genre"
                    )
                  }
                />

                <TextField
                  label="IMDB"
                  {...formik.getFieldProps(
                    "imdb"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "imdb"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "imdb"
                    )
                  }
                />
              </div>
            )}

            {activeStep ===
              1 && (
              <div className="step-container">
                <TextField
                  label="Director"
                  {...formik.getFieldProps(
                    "director"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "director"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "director"
                    )
                  }
                />

                <TextField
                  label="Production Company"
                  {...formik.getFieldProps(
                    "production_company"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "production_company"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "production_company"
                    )
                  }
                />

                <TextField
                  label="Duration (min)"
                  {...formik.getFieldProps(
                    "duration"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "duration"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "duration"
                    )
                  }
                />

                <TextField
                  label="Rating"
                  {...formik.getFieldProps(
                    "rating"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "rating"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "rating"
                    )
                  }
                />

                <TextField
                  label="Language"
                  {...formik.getFieldProps(
                    "language"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "language"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "language"
                    )
                  }
                />

                <TextField
                  label="Country"
                  {...formik.getFieldProps(
                    "country"
                  )}
                  error={
                    Boolean(
                      getFieldError(
                        "country"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "country"
                    )
                  }
                />

                <TextField
                  label="Summary"
                  {...formik.getFieldProps(
                    "summary"
                  )}
                  multiline
                  rows={3}
                  error={
                    Boolean(
                      getFieldError(
                        "summary"
                      )
                    )
                  }
                  helperText={
                    getFieldError(
                      "summary"
                    )
                  }
                />
              </div>
            )}

            {activeStep ===
              2 && (
              <div className="step-container">
                <TextField
                  label="Category"
                  placeholder="Action, Drama, Comedy"
                  {...formik.getFieldProps(
                    "category"
                  )}
                />

                <TextField
                  label="Watch With"
                  placeholder="Family, Friends"
                  {...formik.getFieldProps(
                    "watch_with"
                  )}
                />

                <TextField
                  label="Subtitles"
                  placeholder="English, Azerbaijani"
                  {...formik.getFieldProps(
                    "subtitles"
                  )}
                />
              </div>
            )}

            <div className="modal-actions">
              {activeStep >
                0 && (
                <Button
                  type="button"
                  onClick={
                    handleBack
                  }
                >
                  Back
                </Button>
              )}

              {activeStep <
              steps.length -
                1 ? (
                <Button
                  type="button"
                  onClick={
                    handleNext
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={
                    formik.isSubmitting
                  }
                >
                  {formik.isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              )}

              <Button
                type="button"
                onClick={
                  handleModalClose
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={
          successMessage
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSuccessMessage(
            false
          )
        }
      >
        <Alert
          severity="success"
          onClose={() =>
            setSuccessMessage(
              false
            )
          }
          sx={{
            width: "100%",
          }}
        >
          Success! Film
          updated.
        </Alert>
      </Snackbar>

      <Snackbar
        open={
          Boolean(
            errorMessage
          )
        }
        autoHideDuration={
          4000
        }
        onClose={() =>
          setErrorMessage(
            ""
          )
        }
      >
        <Alert
          severity="error"
          onClose={() =>
            setErrorMessage(
              ""
            )
          }
          sx={{
            width: "100%",
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditFilmModal;