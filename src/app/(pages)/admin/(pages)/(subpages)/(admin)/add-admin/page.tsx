"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Snackbar, Alert, Button, Select, MenuItem } from "@mui/material";
import AsideLeft from "../../../../components/AsideLeft/AsideLeft";
import AsideRight from "../../../../components/AsideRight/AsideRight";
import { createAdmin } from "@/app/redux/features/adminSlice/adminSlice";
import "./addAdmin.css";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  avatar: Yup.string().url("Invalid URL").required("Avatar is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const AddAdmin = () => {
  const dispatch = useDispatch();
  const { loading, error, adminData } = useSelector((state: any) => state.admin);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleSubmit = (values: any, { resetForm }: any) => {
    const existingAdmin = adminData.find((admin: any) => admin.name.toLowerCase() === values.name.toLowerCase());

    if (existingAdmin) {
      setSnackbarMessage("This admin already exists!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    dispatch(createAdmin(values));
    setSnackbarMessage("Admin successfully added!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    resetForm();
  };

  return (
    <>
      <AsideLeft />
      <main>
        <div className="add-admin-container">
          <Formik
            initialValues={{ name: "", avatar: "", password: "", role: "superadmin" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            >
            {({ values, handleChange }) => (
              <Form className="add-admin-form">
                <h2>Add Admin</h2>
                <div className="input-group">
                  <label>Name</label>
                  <Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>

                <div className="input-group">
                  <label>Avatar URL</label>
                  <Field type="text" name="avatar" />
                  <ErrorMessage name="avatar" component="div" className="error" />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="input-group">
                  <label>Role</label>
                  <Select name="role" value={values.role} onChange={handleChange} className="select-role">
                    <MenuItem value="superadmin">Super Admin</MenuItem>
                    <MenuItem value="filmadmin">Film Admin</MenuItem>
                    <MenuItem value="useradmin">User Admin</MenuItem>
                  </Select>
                </div>

                <Button className="add-btn" type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Admin"}
                </Button>
              </Form>
            )}
          </Formik>

          <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
          </Snackbar>
        </div>
        <AsideRight />
      </main>
    </>
  );
};

export default AddAdmin;
