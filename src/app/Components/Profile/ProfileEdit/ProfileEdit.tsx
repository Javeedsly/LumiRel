"use client";

import {
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
} from "@mui/material";

import {
  useFormik,
} from "formik";

import * as Yup from "yup";

import type {
  User,
} from "@/app/redux/features/authSlice/loginSlice";

import "./profileEdit.css";

interface ProfileValues {
  name: string;
  surname: string;
  email: string;
  profileImage: string;
}

interface ProfileEditProps {
  user: User;

  handleUpdateProfile:
    (
      values:
        Partial<User>
    ) =>
      Promise<void> |
      void;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const ProfileEdit = ({
  user,
  handleUpdateProfile,
}: ProfileEditProps) => {
  const [
    snackbar,
    setSnackbar,
  ] =
    useState<{
      open: boolean;
      message: string;
      severity:
        | "success"
        | "error";
    }>({
      open: false,
      message: "",
      severity:
        "success",
    });

  const formik =
    useFormik<
      ProfileValues
    >({
      enableReinitialize:
        true,

      initialValues: {
        name:
          user.name ??
          "",

        surname:
          user.surname ??
          "",

        email:
          user.email ??
          "",

        profileImage:
          user.profileImage ??
          DEFAULT_AVATAR,
      },

      validationSchema:
        Yup.object({
          name:
            Yup.string()
              .trim()
              .required(
                "Adınızı daxil edin"
              ),

          surname:
            Yup.string()
              .trim()
              .required(
                "Soyadınızı daxil edin"
              ),

          email:
            Yup.string()
              .trim()
              .email(
                "Düzgün e-poçt daxil edin"
              )
              .required(
                "E-poçt vacibdir"
              ),

          profileImage:
            Yup.string()
              .trim()
              .url(
                "Düzgün URL daxil edin"
              ),
        }),

      onSubmit:
        async (
          values,
          {
            setSubmitting,
          }
        ) => {
          try {
            await handleUpdateProfile(
              {
                name:
                  values.name.trim(),

                surname:
                  values.surname.trim(),

                email:
                  values.email.trim(),

                profileImage:
                  values.profileImage.trim(),
              }
            );

            setSnackbar({
              open: true,

              message:
                "Profil uğurla yeniləndi.",

              severity:
                "success",
            });
          } catch (
            error
          ) {
            console.error(
              "Profile update error:",
              error
            );

            setSnackbar({
              open: true,

              message:
                "Profil yenilənə bilmədi.",

              severity:
                "error",
            });
          } finally {
            setSubmitting(
              false
            );
          }
        },
    });

  return (
    <div className="profile-edit-container">
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-edit-heading">
            <span>
              Account
            </span>

            <h2>
              Edit Profile
            </h2>

            <p>
              Keep your LumiReel
              profile up to date.
            </p>
          </div>

          <div className="profile-avatar-container">
            <Avatar
              src={
                formik.values
                  .profileImage ||
                DEFAULT_AVATAR
              }
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="profile-form"
          >
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={
                formik.values
                  .name
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              error={
                formik.touched
                  .name &&
                Boolean(
                  formik.errors
                    .name
                )
              }
              helperText={
                formik.touched
                  .name &&
                formik.errors
                  .name
              }
              className="profile-input"
            />

            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={
                formik.values
                  .surname
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              error={
                formik.touched
                  .surname &&
                Boolean(
                  formik.errors
                    .surname
                )
              }
              helperText={
                formik.touched
                  .surname &&
                formik.errors
                  .surname
              }
              className="profile-input"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={
                formik.values
                  .email
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              error={
                formik.touched
                  .email &&
                Boolean(
                  formik.errors
                    .email
                )
              }
              helperText={
                formik.touched
                  .email &&
                formik.errors
                  .email
              }
              className="profile-input"
            />

            <TextField
              fullWidth
              label="Profile Image URL"
              name="profileImage"
              value={
                formik.values
                  .profileImage
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              error={
                formik.touched
                  .profileImage &&
                Boolean(
                  formik.errors
                    .profileImage
                )
              }
              helperText={
                formik.touched
                  .profileImage &&
                formik.errors
                  .profileImage
              }
              className="profile-input"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={
                formik.isSubmitting
              }
              className="save-button"
            >
              {formik.isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          3200
        }
        onClose={() =>
          setSnackbar(
            (
              previous
            ) => ({
              ...previous,
              open:
                false,
            })
          )
        }
      >
        <Alert
          variant="filled"
          severity={
            snackbar.severity
          }
          onClose={() =>
            setSnackbar(
              (
                previous
              ) => ({
                ...previous,
                open:
                  false,
              })
            )
          }
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileEdit;