"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "./add.css";
import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";
import { AppDispatch } from "@/app/redux/store/store";
import { postFilm } from "@/app/redux/features/apiSlice/apiSlice";
import { Snackbar, Alert } from "@mui/material";

const AddFilmMultiStep = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [filmData, setFilmData] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    year: Yup.string().required("Year is required"),
    poster: Yup.string().url("Invalid URL").required("Poster URL is required"),
    trailer: Yup.string()
      .url("Invalid URL")
      .required("Trailer URL is required"),
    full_movie_link: Yup.string()
      .url("Invalid URL")
      .required("Full movie link is required"),
    genre: Yup.string().required("Genre is required"),
    imdb: Yup.number().min(0).max(10).required("IMDB rating is required"),
    director: Yup.string().required("Director is required"),
    production_company: Yup.string().required("Production company is required"),
    duration: Yup.number().required("Duration is required"),
    rating: Yup.number().min(0).max(5).required("Rating is required"),
    language: Yup.string().required("Language is required"),
    country: Yup.string().required("Country is required"),
    summary: Yup.string().required("Summary is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      title: "",
      year: "",
      poster: "",
      trailer: "",
      full_movie_link: "",
      genre: "",
      popular: false,
      imdb: "",
      category: [],
      director: "",
      production_company: "",
      actors: [{ name: "", image: "" }],
      summary: "",
      duration: "",
      rating: "",
      is_family_friendly: false,
      watch_with: [],
      language: "",
      subtitles: [],
      country: "",
      comments: [],
      deleted: false,
      drafts: true,
    },

    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const processedValues = {
        ...values,
        category: values.category
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        watch_with: values.watch_with
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        subtitles: values.subtitles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      try {
        await dispatch(postFilm(processedValues)).unwrap();
        setFilmData(processedValues);
        setSnackbar({
          open: true,
          message: "Film successfully added!",
          severity: "success",
        });
        resetForm();
      } catch (error) {
        console.error("Error adding film:", error);
        setSnackbar({
          open: true,
          message: "Failed to add film!",
          severity: "error",
        });
      }
    },
  });

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      let stepErrors: any = {};
      if (currentStep === 1) {
        stepErrors = {
          title: errors.title,
          year: errors.year,
          poster: errors.poster,
          trailer: errors.trailer,
          full_movie_link: errors.full_movie_link,
          genre: errors.genre,
          imdb: errors.imdb,
        };
      } else if (currentStep === 2) {
        stepErrors = {
          director: errors.director,
          production_company: errors.production_company,
          duration: errors.duration,
          rating: errors.rating,
          language: errors.language,
          country: errors.country,
          summary: errors.summary,
        };
      }
      const hasError = Object.values(stepErrors).some((err) => err);
      if (!hasError) {
        setCurrentStep((prev) => prev + 1);
      } else {
        alert("Please fill in all required fields in this step.");
      }
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="layout">
      <Aside />
      <main>
        <div className="add-film-container">
          <h2>Add New Film</h2>
          <form onSubmit={formik.handleSubmit} className="add-film-form">
            {currentStep === 1 && (
              <div className="form-step">
                <h3>Primary Information</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="error">{formik.errors.title}</div>
                )}
                <input
                  name="year"
                  placeholder="Year"
                  {...formik.getFieldProps("year")}
                />
                {formik.touched.year && formik.errors.year && (
                  <div className="error">{formik.errors.year}</div>
                )}
                <input
                  type="text"
                  name="poster"
                  placeholder="Poster URL"
                  {...formik.getFieldProps("poster")}
                />
                {formik.touched.poster && formik.errors.poster && (
                  <div className="error">{formik.errors.poster}</div>
                )}
                {formik.values.poster && (
                  <img
                    src={formik.values.poster}
                    alt="Poster Preview"
                    className="poster-preview"
                  />
                )}
                <input
                  type="text"
                  name="trailer"
                  placeholder="Trailer URL"
                  {...formik.getFieldProps("trailer")}
                />
                {formik.touched.trailer && formik.errors.trailer && (
                  <div className="error">{formik.errors.trailer}</div>
                )}
                {formik.values.trailer && (
                  <iframe
                    src={formik.values.trailer}
                    title="Trailer Preview"
                    className="trailer-preview"
                  ></iframe>
                )}
                <input
                  type="text"
                  name="full_movie_link"
                  placeholder="Full Movie Link"
                  {...formik.getFieldProps("full_movie_link")}
                />
                {formik.touched.full_movie_link &&
                  formik.errors.full_movie_link && (
                    <div className="error">{formik.errors.full_movie_link}</div>
                  )}
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  {...formik.getFieldProps("genre")}
                />
                {formik.touched.genre && formik.errors.genre && (
                  <div className="error">{formik.errors.genre}</div>
                )}
                <input
                  name="imdb"
                  placeholder="IMDB Rating"
                  {...formik.getFieldProps("imdb")}
                />
                {formik.touched.imdb && formik.errors.imdb && (
                  <div className="error">{formik.errors.imdb}</div>
                )}
              </div>
            )}
            {currentStep === 2 && (
              <div className="form-step">
                <h3>Secondary Information</h3>
                <input
                  type="text"
                  name="director"
                  placeholder="Director"
                  {...formik.getFieldProps("director")}
                />
                {formik.touched.director && formik.errors.director && (
                  <div className="error">{formik.errors.director}</div>
                )}
                <input
                  type="text"
                  name="production_company"
                  placeholder="Production Company"
                  {...formik.getFieldProps("production_company")}
                />
                {formik.touched.production_company &&
                  formik.errors.production_company && (
                    <div className="error">
                      {formik.errors.production_company}
                    </div>
                  )}
                <input
                  name="duration"
                  placeholder="Duration (minutes)"
                  {...formik.getFieldProps("duration")}
                />
                {formik.touched.duration && formik.errors.duration && (
                  <div className="error">{formik.errors.duration}</div>
                )}
                <input
                  name="rating"
                  placeholder="Rating (out of 5)"
                  {...formik.getFieldProps("rating")}
                />
                {formik.touched.rating && formik.errors.rating && (
                  <div className="error">{formik.errors.rating}</div>
                )}
                <input
                  type="text"
                  name="language"
                  placeholder="Language"
                  {...formik.getFieldProps("language")}
                />
                {formik.touched.language && formik.errors.language && (
                  <div className="error">{formik.errors.language}</div>
                )}
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  {...formik.getFieldProps("country")}
                />
                {formik.touched.country && formik.errors.country && (
                  <div className="error">{formik.errors.country}</div>
                )}
                <textarea
                  name="summary"
                  placeholder="Summary"
                  {...formik.getFieldProps("summary")}
                />
                {formik.touched.summary && formik.errors.summary && (
                  <div className="error">{formik.errors.summary}</div>
                )}
              </div>
            )}
            {currentStep === 3 && (
              <div className="form-step">
                <h3>Additional Information</h3>
                <label>
                  <input type="checkbox" {...formik.getFieldProps("popular")} />
                  Popular
                </label>
                <label>
                  <input
                    type="checkbox"
                    {...formik.getFieldProps("is_family_friendly")}
                  />
                  Family Friendly
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="Category (comma separated)"
                  {...formik.getFieldProps("category")}
                />
                <input
                  type="text"
                  name="watch_with"
                  placeholder="Watch With (comma separated)"
                  {...formik.getFieldProps("watch_with")}
                />
                <input
                  type="text"
                  name="subtitles"
                  placeholder="Subtitles (comma separated)"
                  {...formik.getFieldProps("subtitles")}
                />
                <div className="actor-section">
                  <h4>Actors</h4>
                  {formik.values.actors.map((actor, index) => (
                    <div key={index} className="actor-item">
                      <input
                        type="text"
                        placeholder="Actor Name"
                        value={actor.name}
                        onChange={(e) => {
                          const newActors = [...formik.values.actors];
                          newActors[index].name = e.target.value;
                          formik.setFieldValue("actors", newActors);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Actor Image URL"
                        value={actor.image}
                        onChange={(e) => {
                          const newActors = [...formik.values.actors];
                          newActors[index].image = e.target.value;
                          formik.setFieldValue("actors", newActors);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("actors", [
                        ...formik.values.actors,
                        { name: "", image: "" },
                      ]);
                    }}
                  >
                    + Add Actor
                  </button>
                </div>
              </div>
            )}
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="next-button"
                >
                  Next
                </button>
              ) : (
                <button type="submit" className="submit-button">
                  Add Film
                </button>
              )}
            </div>
          </form>
          {filmData && (
            <div className="added-film-preview">
              <h3>Preview:</h3>
              <pre>{JSON.stringify(filmData, null, 2)}</pre>
            </div>
          )}
        </div>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity as any} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default AddFilmMultiStep;
