"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import {
  getLogin,
  updateUserProfile,
} from "@/app/redux/features/authSlice/loginSlice";

import "./detail.css";

interface UserData {
  id: string | number;
  name?: string;
  surname?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cardNumber?: string;
  profileImage?: string;
  isPremium?: boolean;
  role?: string;
  [key: string]: unknown;
}

const UserDetail = () => {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const dispatch =
    useDispatch<AppDispatch>();

  const users = useSelector(
    (state: RootState) =>
      state.auth.users
  ) as UserData[];

  const [
    user,
    setUser,
  ] = useState<UserData | null>(
    null
  );

  const [
    editMode,
    setEditMode,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState<UserData>({
    id: "",
    name: "",
    surname: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    profileImage: "",
    isPremium: false,
  });

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

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const foundUser =
      users.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    if (foundUser) {
      setUser(foundUser);

      setFormData({
        ...foundUser,

        name:
          foundUser.name ??
          foundUser.firstName ??
          "",

        surname:
          foundUser.surname ??
          foundUser.lastName ??
          "",

        username:
          foundUser.username ??
          "",

        email:
          foundUser.email ??
          "",

        cardNumber:
          foundUser.cardNumber ??
          "",

        profileImage:
          foundUser.profileImage ??
          "",

        isPremium:
          foundUser.isPremium ??
          false,
      });
    }
  }, [users, id]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  const handleSave =
    async () => {
      if (!id) {
        setSnackbarMessage(
          "User ID tapılmadı!"
        );

        setSnackbarSeverity(
          "error"
        );

        setOpenSnackbar(true);

        return;
      }

      try {
        const updatedUser =
          await dispatch(
            updateUserProfile({
              id,
              updatedData:
                formData,
            })
          ).unwrap();

        setUser(
          updatedUser
        );

        setFormData(
          updatedUser
        );

        setEditMode(false);

        setSnackbarMessage(
          "User updated successfully!"
        );

        setSnackbarSeverity(
          "success"
        );
      } catch (error) {
        console.error(
          "User update error:",
          error
        );

        setSnackbarMessage(
          "Failed to update user!"
        );

        setSnackbarSeverity(
          "error"
        );
      }

      setOpenSnackbar(true);
    };

  const handleCancel = () => {
    if (user) {
      setFormData({
        ...user,

        name:
          user.name ??
          user.firstName ??
          "",

        surname:
          user.surname ??
          user.lastName ??
          "",

        username:
          user.username ??
          "",

        email:
          user.email ??
          "",

        cardNumber:
          user.cardNumber ??
          "",

        profileImage:
          user.profileImage ??
          "",

        isPremium:
          user.isPremium ??
          false,
      });
    }

    setEditMode(false);
  };

  const handleCloseSnackbar =
    () => {
      setOpenSnackbar(false);
    };

  if (!id) {
    return (
      <Typography variant="h6">
        Invalid User ID
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6">
        User not found
      </Typography>
    );
  }

  const displayName =
    user.name ??
    user.firstName ??
    user.username ??
    "User";

  return (
    <div className="user-detail-container">
      <Card className="user-detail-card">
        <CardContent>
          <Typography
            variant="h5"
            className="card-title"
          >
            User Profile
          </Typography>

          <div className="user-avatar-section">
            <img
              src={
                user.profileImage ||
                "/default-avatar.png"
              }
              alt={displayName}
              className="user-avatar"
            />
          </div>

          <div className="user-info">
            <TextField
              label="Name"
              name="name"
              value={
                formData.name ??
                ""
              }
              onChange={
                handleInputChange
              }
              disabled={
                !editMode
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Surname"
              name="surname"
              value={
                formData.surname ??
                ""
              }
              onChange={
                handleInputChange
              }
              disabled={
                !editMode
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={
                formData.email ??
                ""
              }
              onChange={
                handleInputChange
              }
              disabled={
                !editMode
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Card Number"
              name="cardNumber"
              value={
                formData.cardNumber ??
                ""
              }
              onChange={
                handleInputChange
              }
              disabled={
                !editMode
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Premium Status"
              value={
                formData.isPremium
                  ? "Premium"
                  : "Normal"
              }
              disabled
              fullWidth
              margin="normal"
            />
          </div>

          <div className="user-detail-actions">
            {editMode ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    handleSave
                  }
                >
                  Save Changes
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={
                    handleCancel
                  }
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setEditMode(
                    true
                  )
                }
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Snackbar
        open={
          openSnackbar
        }
        autoHideDuration={
          4000
        }
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            snackbarSeverity
          }
          onClose={
            handleCloseSnackbar
          }
          sx={{
            width: "100%",
          }}
        >
          {
            snackbarMessage
          }
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDetail;