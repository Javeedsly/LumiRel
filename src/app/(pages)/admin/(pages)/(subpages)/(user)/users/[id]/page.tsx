"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useParams,
} from "next/navigation";

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

import type {
  User,
} from "@/app/redux/features/authSlice/loginSlice";

import "./detail.css";

type EditableField =
  | "name"
  | "surname"
  | "username"
  | "email"
  | "cardNumber"
  | "profileImage";

const createFormData = (
  user?: User | null
): User => ({
  id:
    user?.id ?? "",

  name:
    user?.name ??
    user?.firstName ??
    "",

  surname:
    user?.surname ??
    user?.lastName ??
    "",

  username:
    user?.username ??
    "",

  firstName:
    user?.firstName,

  lastName:
    user?.lastName,

  email:
    user?.email ??
    "",

  cardNumber:
    user?.cardNumber ??
    "",

  profileImage:
    user?.profileImage ??
    "",

  isPremium:
    user?.isPremium ??
    false,

  role:
    user?.role,

  password:
    user?.password,

  wishlist:
    user?.wishlist,

  premiumStartDate:
    user?.premiumStartDate,

  premiumCancelDate:
    user?.premiumCancelDate,

  cardInfo:
    user?.cardInfo,

  createdAt:
    user?.createdAt,

  updatedAt:
    user?.updatedAt,
});

const UserDetail = () => {
  const params =
    useParams();

  const rawId =
    params?.id;

  const id =
    Array.isArray(rawId)
      ? rawId[0] ?? ""
      : typeof rawId ===
          "string"
        ? rawId
        : "";

  const dispatch =
    useDispatch<AppDispatch>();

  const users =
    useSelector(
      (state: RootState) =>
        state.auth.users
    );

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null
    );

  const [
    formData,
    setFormData,
  ] =
    useState<User>(
      createFormData()
    );

  const [
    editMode,
    setEditMode,
  ] =
    useState(false);

  const [
    openSnackbar,
    setOpenSnackbar,
  ] =
    useState(false);

  const [
    snackbarMessage,
    setSnackbarMessage,
  ] =
    useState("");

  const [
    snackbarSeverity,
    setSnackbarSeverity,
  ] =
    useState<
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

    if (!foundUser) {
      return;
    }

    setUser(
      foundUser
    );

    setFormData(
      createFormData(
        foundUser
      )
    );
  }, [
    users,
    id,
  ]);

  const handleInputChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
  ) => {
    const field =
      event.target
        .name as EditableField;

    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  const handleSave =
    async () => {
      if (!id) {
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
          createFormData(
            updatedUser
          )
        );

        setEditMode(
          false
        );

        setSnackbarSeverity(
          "success"
        );

        setSnackbarMessage(
          "User updated successfully!"
        );
      } catch (error) {
        console.error(
          "User update error:",
          error
        );

        setSnackbarSeverity(
          "error"
        );

        setSnackbarMessage(
          "Failed to update user!"
        );
      }

      setOpenSnackbar(
        true
      );
    };

  const handleCancel = () => {
    setFormData(
      createFormData(
        user
      )
    );

    setEditMode(
      false
    );
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
    [
      user.name ??
        user.firstName,

      user.surname ??
        user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user.username ||
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
              alt={
                displayName
              }
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
              label="Username"
              name="username"
              value={
                formData.username ??
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
              label="Profile Image"
              name="profileImage"
              value={
                formData.profileImage ??
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
                  onClick={
                    handleSave
                  }
                >
                  Save Changes
                </Button>

                <Button
                  variant="outlined"
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
  );
};

export default UserDetail;