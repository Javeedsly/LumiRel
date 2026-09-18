"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "@/app/redux/store/store";
import { updateFilm } from "@/app/redux/features/apiSlice/apiSlice";
import "./edit.css";

const steps = ["Primary Info", "Secondary Info", "Additional Info"];

interface EditFilmModalProps {
  open: boolean;
  handleClose: () => void;
  film: any; 
}

const EditFilmModal: React.FC<EditFilmModalProps> = ({ open, handleClose, film }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState(false); 

  const formik = useFormik({
    initialValues: {
      title: film.title || "",
      year: film.year || "",
      poster: film.poster || "",
      trailer: film.trailer || "",
      full_movie_link: film.full_movie_link || "",
      genre: film.genre || "",
      popular: film.popular || false,
      imdb: film.imdb || "",
      director: film.director || "",
      production_company: film.production_company || "",
      duration: film.duration || "",
      rating: film.rating || "",
      language: film.language || "",
      country: film.country || "",
      summary: film.summary || "",
      category: film.category?.join(", ") || "",
      watch_with: film.watch_with?.join(", ") || "",
      subtitles: film.subtitles?.join(", ") || "",
      actors: film.actors || [{ name: "", image: "" }],
      deleted: film.deleted || false,
      drafts: film.drafts || false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      year: Yup.number().required("Year is required"),
      poster: Yup.string().url("Invalid URL").required("Poster URL is required"),
      trailer: Yup.string().url("Invalid URL").required("Trailer URL is required"),
      full_movie_link: Yup.string().url("Invalid URL").required("Full movie link is required"),
      genre: Yup.string().required("Genre is required"),
      imdb: Yup.number().min(0).max(10).required("IMDB rating is required"),
      director: Yup.string().required("Director is required"),
      production_company: Yup.string().required("Production company is required"),
      duration: Yup.number().required("Duration is required"),
      rating: Yup.number().min(0).max(5).required("Rating is required"),
      language: Yup.string().required("Language is required"),
      country: Yup.string().required("Country is required"),
      summary: Yup.string().required("Summary is required"),
    }),
    onSubmit: (values) => {
      const updatedFilm = {
        ...film,
        ...values,
        category: values.category.split(",").map((s) => s.trim()),
        watch_with: values.watch_with.split(",").map((s) => s.trim()),
        subtitles: values.subtitles.split(",").map((s) => s.trim()),
      };

      dispatch(updateFilm({ id: film.id, data: updatedFilm }))
        .then(() => {
          setSuccessMessage(true); 
          handleClose(); 
        });
    },
  });

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <Typography variant="h6" className="modal-title">
            Edit Film - {film.title}
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={formik.handleSubmit} className="edit-form">
            {activeStep === 0 && (
              <div className="step-container">
                <TextField label="Title" {...formik.getFieldProps("title")} />
                <TextField label="Year" {...formik.getFieldProps("year")} />
                <TextField label="Poster URL" {...formik.getFieldProps("poster")} />
                <TextField label="Trailer URL" {...formik.getFieldProps("trailer")} />
                <TextField label="Full Movie Link" {...formik.getFieldProps("full_movie_link")} />
                <TextField label="Genre" {...formik.getFieldProps("genre")} />
                <TextField label="IMDB" {...formik.getFieldProps("imdb")} />
              </div>
            )}

            {activeStep === 1 && (
              <div className="step-container">
                <TextField label="Director" {...formik.getFieldProps("director")} />
                <TextField label="Production Company" {...formik.getFieldProps("production_company")} />
                <TextField label="Duration (min)" {...formik.getFieldProps("duration")} />
                <TextField label="Rating" {...formik.getFieldProps("rating")} />
                <TextField label="Language" {...formik.getFieldProps("language")} />
                <TextField label="Country" {...formik.getFieldProps("country")} />
                <TextField label="Summary" {...formik.getFieldProps("summary")} multiline rows={3} />
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-container">
                <TextField label="Category" {...formik.getFieldProps("category")} />
                <TextField label="Watch With" {...formik.getFieldProps("watch_with")} />
                <TextField label="Subtitles" {...formik.getFieldProps("subtitles")} />
              </div>
            )}

            <div className="modal-actions">
              {activeStep > 0 && (
                <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
              ) : (
                <Button type="submit" color="primary" variant="contained">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: "100%" }}>
          Success! Film updated.
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditFilmModal;
