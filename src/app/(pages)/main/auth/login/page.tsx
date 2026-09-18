"use client";

import { useState, useEffect } from "react";
import { LoginSchema } from "@/app/schema/loginSchema";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import "./login.css";
import { checkUser, getLogin } from "@/app/redux/features/authSlice/loginSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((state) => state.auth.users || []);
  const user = useSelector((state) => state.auth.user || null);
  const loginStatus = useSelector((state) => state.auth.status);
  const loginError = useSelector((state) => state.auth.error); 

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.push("/main/profile");
    }
  }, [user, router]);

  return (
    <div className="login-container">
      <h2 className="login-title">🔐 Sign in</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(checkUser(values));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="input-group">
              <label htmlFor="email"><FaEnvelope className="icon" /> Email</label>
              <Field id="email" type="text" name="email" className="input-field" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="input-group password-group">
              <label htmlFor="password"><FaLock className="icon" /> Password</label>
              <div className="password-wrapper">
                <Field
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input-field"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loginStatus === "loading"}
              className="login-button"
            >
              {loginStatus === "loading" ? "⏳ Loading..." : "🚀Sign in"}
            </button>

            {loginStatus === "failed" && <p className="error-message">{loginError}</p>}
          </Form>
        )}
      </Formik>

      <div className="register-link">
        <p>Don't have an account?</p>
        <button onClick={() => router.push("/main/auth/register")} className="register-button-L">✨ Register</button>
      </div>
    </div>
  );
};

export default LoginPage;
