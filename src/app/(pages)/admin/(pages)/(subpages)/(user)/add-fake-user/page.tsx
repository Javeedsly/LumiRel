"use client";

import React, { useState } from "react";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./add.css";

const FakeUserAdd = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    status: "normal",
    age: "",
    gender: "",
    country: "",
  });

  const handleAddUser = () => {
    console.log("New Fake User: ", newUser);
  };

  return (
    <Box className="fake-user-container">
      <Typography variant="h5" className="form-title">
        Add Fake User
      </Typography>

      <Paper className="fake-user-form" elevation={3}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          fullWidth
        />

        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
        />

        <TextField
          label="Age"
          type="number"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={newUser.gender}
            onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={newUser.country}
            onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
          >
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
            <MenuItem value="Germany">Germany</MenuItem>
            <MenuItem value="France">France</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
          </Select>
        </FormControl>

        <div className="form-buttons">
          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Save User
          </Button>
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
        </div>
      </Paper>
    </Box>
  );
};

export default FakeUserAdd;