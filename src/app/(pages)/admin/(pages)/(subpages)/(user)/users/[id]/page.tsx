"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { getLogin, updateUserProfile } from "@/app/redux/features/authSlice/loginSlice";
import "./detail.css";

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    const foundUser = users.find((user: any) => user.id === id);
    if (foundUser) {
      setUser(foundUser);
      setFormData(foundUser);
    }
  }, [users, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile({ id, updatedData: formData }));
      setUser(formData);
      setEditMode(false);
      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to update user!");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <div className="user-detail-container">
      <Card className="user-detail-card">
        <CardContent>
          <Typography variant="h5" className="card-title">User Profile</Typography>
          <div className="user-avatar-section">
            <img src={user.profileImage || "/default-avatar.png"} alt={user.name} className="user-avatar" />
          </div>
          <div className="user-info">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Premium Status"
              value={formData.isPremium ? "Premium" : "Normal"}
              disabled
              fullWidth
              margin="normal"
            />
          </div>

          <div className="user-detail-actions">
            {editMode ? (
              <>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDetail;
