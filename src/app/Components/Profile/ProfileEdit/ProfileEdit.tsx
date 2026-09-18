"use client";

import { useState } from "react";
import { TextField, Button, Snackbar, Alert, Avatar, Card, CardContent } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./profileEdit.css";

interface ProfileEditProps {
    user: {
        name?: string;
        surname?: string;
        email?: string;
        profileImage?: string;
    };
    handleUpdateProfile: (values: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, handleUpdateProfile }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            surname: user?.surname || "",
            email: user?.email || "",
            profileImage: user?.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Adınızı daxil edin"),
            surname: Yup.string().required("Soyadınızı daxil edin"),
            email: Yup.string().email("Düzgün e-poçt daxil edin").required("E-poçt vacibdir"),
            profileImage: Yup.string().url("Düzgün URL daxil edin"),
        }),
        onSubmit: (values) => {
            handleUpdateProfile(values);
            setOpenSnackbar(true);
        },
    });

    return (
        <div className="profile-edit-container">
            <Card className="profile-card">
                <CardContent>
                    <div className="profile-avatar-container">
                        <Avatar src={formik.values.profileImage} alt="Profil Şəkli" className="profile-avatar" />
                    </div>
                    <h2>✏️ Profili Düzenle</h2>

                    <form onSubmit={formik.handleSubmit} className="profile-form">
                        <TextField
                            fullWidth
                            label="Ad"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            margin="dense"
                            className="profile-input"
                        />
                        <TextField
                            fullWidth
                            label="Soyad"
                            name="surname"
                            value={formik.values.surname}
                            onChange={formik.handleChange}
                            error={formik.touched.surname && Boolean(formik.errors.surname)}
                            helperText={formik.touched.surname && formik.errors.surname}
                            margin="dense"
                            className="profile-input"
                        />
                        <TextField
                            fullWidth
                            label="E-poçt"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="dense"
                            className="profile-input"
                        />
                        <TextField
                            fullWidth
                            label="Profil Şəkli URL"
                            name="profileImage"
                            value={formik.values.profileImage}
                            onChange={formik.handleChange}
                            error={formik.touched.profileImage && Boolean(formik.errors.profileImage)}
                            helperText={formik.touched.profileImage && formik.errors.profileImage}
                            margin="dense"
                            className="profile-input"
                        />
                        <Button type="submit" color="primary" variant="contained" className="save-button">
                            💾 Kayd et
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
                    ✅ Profil  yenilendi!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProfileEdit;
