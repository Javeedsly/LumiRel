"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { RegisterSchema } from "@/app/schema/registerSchema";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./register.css";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/redux/features/authSlice/registerSlice";

const Register = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { status, error } = useSelector((state) => state.register);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="register-container">
            <h2 className="register-title">🚀 LumiReel Dünyasına Addım At!</h2>

            <Formik
                initialValues={{ name: "", surname: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={RegisterSchema}
                onSubmit={(values, { setSubmitting }) => {
                    dispatch(registerUser(values)).finally(() => setSubmitting(false));
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="register-form">
                        <div className="input-group">
                            <label htmlFor="name"><FaUser className="icon" /> Name</label>
                            <Field id="name" name="name" type="text" className="input-field" />
                            <ErrorMessage name="name" component="div" className="error-message" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="surname"><FaUser className="icon" /> Surname</label>
                            <Field id="surname" name="surname" type="text" className="input-field" />
                            <ErrorMessage name="surname" component="div" className="error-message" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email"><FaEnvelope className="icon" /> Email</label>
                            <Field id="email" name="email" type="text" className="input-field" />
                            <ErrorMessage name="email" component="div" className="error-message" />
                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="password"><FaLock className="icon" /> Password</label>
                            <div className="password-wrapper">
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`input-field ${showPassword ? "matrix-mode" : ""}`}
                                />
                                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <ErrorMessage name="password" component="div" className="error-message" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword"><FaLock className="icon" /> Confirm Password</label>
                            <div className="password-wrapper">
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="input-field"
                                />
                                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                        </div>

                        <button type="submit" disabled={isSubmitting || status === "loading"} className="register-button">
                            {status === "loading" ? "⏳ Loading..." : "✨ Register"}
                        </button>
                    </Form>
                )}
            </Formik>

            <div className="login-link">
                <p>Already have an account?</p>
                <button onClick={() => router.push("/main/auth/login")} className="login-button-R">🔑 Sign in</button>
            </div>
        </div>
    );
};

export default Register;
