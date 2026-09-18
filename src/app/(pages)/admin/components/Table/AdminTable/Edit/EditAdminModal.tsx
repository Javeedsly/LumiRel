"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";

import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

import {
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";

import {
  updateAdmin,
} from "@/app/redux/features/adminSlice/adminSlice";

import type {
  AppDispatch,
} from "@/app/redux/store/store";

import "./edit.css";

type AdminRole =
  | "superadmin"
  | "filmadmin"
  | "useradmin";

interface AdminData {
  id: number;
  name: string;
  avatar: string;
  password: string;
  role: AdminRole;

  email?: string;
  createdAt?: string;
}

interface EditAdminModalProps {
  open: boolean;
  handleClose: () => void;
  admin: AdminData | null;
}

interface AdminFormValues {
  name: string;
  avatar: string;
  password: string;
  role: AdminRole;
}

const emptyInitialValues: AdminFormValues = {
  name: "",
  avatar: "",
  password: "",
  role: "superadmin",
};

const validationSchema =
  Yup.object({
    name: Yup.string()
      .trim()
      .required(
        "Name is required"
      ),

    avatar: Yup.string()
      .trim()
      .url(
        "Invalid URL"
      )
      .required(
        "Avatar is required"
      ),

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
      .required(
        "Password is required"
      ),

    role: Yup.string()
      .oneOf([
        "superadmin",
        "filmadmin",
        "useradmin",
      ])
      .required(
        "Role is required"
      ),
  });

const EditAdminModal = ({
  open,
  handleClose,
  admin,
}: EditAdminModalProps) => {
  const dispatch =
    useDispatch<AppDispatch>();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const initialValues:
    AdminFormValues =
    admin
      ? {
          name:
            admin.name ??
            "",

          avatar:
            admin.avatar ??
            "",

          password:
            admin.password ??
            "",

          role:
            admin.role ??
            "superadmin",
        }
      : emptyInitialValues;

  const handleSubmit =
    async (
      values: AdminFormValues,
      {
        setSubmitting,
      }: FormikHelpers<AdminFormValues>
    ) => {
      if (!admin) {
        setSubmitting(
          false
        );

        return;
      }

      try {
        await dispatch(
          updateAdmin({
            id: admin.id,

            updatedData: {
              name:
                values.name.trim(),

              avatar:
                values.avatar.trim(),

              password:
                values.password,

              role:
                values.role,
            },
          })
        ).unwrap();

        handleClose();
      } catch (error) {
        console.error(
          "Admin update error:",
          error
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  const handleModalClose =
    () => {
      setShowPassword(
        false
      );

      handleClose();
    };

  return (
    <Modal
      open={open}
      onClose={
        handleModalClose
      }
    >
      <Box className="modal-box">
        <Typography variant="h6">
          Edit Admin
        </Typography>

        <Formik<AdminFormValues>
          initialValues={
            initialValues
          }
          enableReinitialize
          validationSchema={
            validationSchema
          }
          onSubmit={
            handleSubmit
          }
        >
          {({
            values,
            handleChange,
            isSubmitting,
          }) => (
            <Form className="modal-form">
              <div className="input-group">
                <label htmlFor="admin-name">
                  Name
                </label>

                <Field
                  id="admin-name"
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
                <label htmlFor="admin-avatar">
                  Avatar URL
                </label>

                <Field
                  id="admin-avatar"
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
                <label htmlFor="admin-password">
                  Password
                </label>

                <div className="password-container">
                  <Field
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                  />

                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible
                        size={20}
                      />
                    ) : (
                      <AiFillEye
                        size={20}
                      />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              <div className="input-group">
                <label htmlFor="admin-role">
                  Role
                </label>

                <Select
                  id="admin-role"
                  name="role"
                  value={
                    values.role
                  }
                  onChange={
                    handleChange
                  }
                  fullWidth
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

              <div className="modal-actions">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting ||
                    !admin
                  }
                >
                  {isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  onClick={
                    handleModalClose
                  }
                  variant="contained"
                  className="cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditAdminModal;