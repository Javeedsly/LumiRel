"use client";

import React, { useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
} from "formik";

import * as Yup from "yup";

import {
  Snackbar,
  Alert,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

import AsideLeft from "../../../../components/AsideLeft/AsideLeft";
import AsideRight from "../../../../components/AsideRight/AsideRight";

import {
  createAdmin,
} from "@/app/redux/features/adminSlice/adminSlice";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import "./addAdmin.css";

type AdminRole =
  | "superadmin"
  | "filmadmin"
  | "useradmin";

interface AdminFormValues {
  name: string;
  avatar: string;
  password: string;
  role: AdminRole;
}

const initialValues: AdminFormValues = {
  name: "",
  avatar: "",
  password: "",
  role: "superadmin",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required"),

  avatar: Yup.string()
    .trim()
    .url("Invalid URL")
    .required("Avatar is required"),

  password: Yup.string()
    .min(
      8,
      "Must be at least 8 characters"
    )
    .matches(
      /[A-Z]/,
      "Must contain at least one uppercase letter"
    )
    .matches(
      /\d/,
      "Must contain at least one number"
    )
    .required("Password is required"),

  role: Yup.string()
    .oneOf([
      "superadmin",
      "filmadmin",
      "useradmin",
    ])
    .required("Role is required"),
});

const AddAdmin = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    loading,
    adminData,
  } = useSelector(
    (state: RootState) =>
      state.admin
  );

  const [
    openSnackbar,
    setOpenSnackbar,
  ] = useState(false);

  const [
    snackbarMessage,
    setSnackbarMessage,
  ] = useState("");

  const [
    snackbarSeverity,
    setSnackbarSeverity,
  ] = useState<
    "success" | "error"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (
    values: AdminFormValues,
    {
      resetForm,
      setSubmitting,
    }: FormikHelpers<AdminFormValues>
  ) => {
    const existingAdmin =
      adminData.find(
        (admin) =>
          admin.name
            .trim()
            .toLowerCase() ===
          values.name
            .trim()
            .toLowerCase()
      );

    if (existingAdmin) {
      showSnackbar(
        "This admin already exists!",
        "error"
      );

      setSubmitting(false);

      return;
    }

    try {
      await dispatch(
        createAdmin(
          values as Parameters<
            typeof createAdmin
          >[0]
        )
      ).unwrap();

      showSnackbar(
        "Admin successfully added!",
        "success"
      );

      resetForm();
    } catch (error) {
      console.error(
        "Create admin error:",
        error
      );

      showSnackbar(
        "Failed to add admin!",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AsideLeft />

      <main>
        <div className="add-admin-container">
          <Formik<AdminFormValues>
            initialValues={
              initialValues
            }
            validationSchema={
              validationSchema
            }
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              isSubmitting,
            }) => (
              <Form className="add-admin-form">
                <h2>
                  Add Admin
                </h2>

                <div className="input-group">
                  <label htmlFor="name">
                    Name
                  </label>

                  <Field
                    id="name"
                    type="text"
                    name="name"
                  />

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="avatar">
                    Avatar URL
                  </label>

                  <Field
                    id="avatar"
                    type="text"
                    name="avatar"
                  />

                  <ErrorMessage
                    name="avatar"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    Password
                  </label>

                  <Field
                    id="password"
                    type="password"
                    name="password"
                  />

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="role">
                    Role
                  </label>

                  <Select
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={
                      handleChange
                    }
                    className="select-role"
                  >
                    <MenuItem value="superadmin">
                      Super Admin
                    </MenuItem>

                    <MenuItem value="filmadmin">
                      Film Admin
                    </MenuItem>

                    <MenuItem value="useradmin">
                      User Admin
                    </MenuItem>
                  </Select>

                  <ErrorMessage
                    name="role"
                    component="div"
                    className="error"
                  />
                </div>

                <Button
                  className="add-btn"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    loading ||
                    isSubmitting
                  }
                >
                  {loading ||
                  isSubmitting
                    ? "Adding..."
                    : "Add Admin"}
                </Button>
              </Form>
            )}
          </Formik>

          <Snackbar
            open={
              openSnackbar
            }
            autoHideDuration={
              4000
            }
            onClose={() =>
              setOpenSnackbar(
                false
              )
            }
          >
            <Alert
              severity={
                snackbarSeverity
              }
              onClose={() =>
                setOpenSnackbar(
                  false
                )
              }
            >
              {
                snackbarMessage
              }
            </Alert>
          </Snackbar>
        </div>

        <AsideRight />
      </main>
    </>
  );
};

export default AddAdmin;