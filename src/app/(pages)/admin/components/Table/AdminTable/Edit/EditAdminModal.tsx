import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateAdmin } from "@/app/redux/features/adminSlice/adminSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./edit.css";

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

const EditAdminModal = ({ open, handleClose, admin }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = (values) => {
    dispatch(updateAdmin({ id: admin.id, updatedData: values }));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <Typography variant="h6">Edit Admin</Typography>
        <Formik initialValues={admin} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange }) => (
            <Form className="modal-form">
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
                <div className="password-container">
                  <Field type={showPassword ? "text" : "password"} name="password" />
                  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="input-group">
                <label>Role</label>
                <Select name="role" value={values.role} onChange={handleChange} fullWidth>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                  <MenuItem value="filmadmin">Film Admin</MenuItem>
                  <MenuItem value="useradmin">User Admin</MenuItem>
                </Select>
              </div>

              <div className="modal-actions">
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
                <Button onClick={handleClose} variant="contained" className="cancel-btn">
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
