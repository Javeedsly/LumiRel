"use client";

import {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";

import {
  useRouter,
} from "next/navigation";

import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import {
  RegisterSchema,
} from "@/app/schema/registerSchema";

import {
  registerUser,
} from "@/app/redux/features/authSlice/registerSlice";

import type {
  RegisterUserData,
} from "@/app/redux/features/authSlice/registerSlice";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import "./register.css";

const Register = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const router =
    useRouter();

  const {
    status,
    error,
  } = useSelector(
    (state: RootState) =>
      state.register
  );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const initialValues:
    RegisterUserData = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <div className="register-container">
      <h2 className="register-title">
        🚀 LumiReel Dünyasına Addım At!
      </h2>

      <Formik<RegisterUserData>
        initialValues={
          initialValues
        }
        validationSchema={
          RegisterSchema
        }
        onSubmit={async (
          values,
          {
            setSubmitting,
          }
        ) => {
          try {
            await dispatch(
              registerUser(
                values
              )
            ).unwrap();

            router.push(
              "/main/auth/login"
            );
          } catch (submitError) {
            console.error(
              "Register error:",
              submitError
            );
          } finally {
            setSubmitting(
              false
            );
          }
        }}
      >
        {({
          isSubmitting,
        }) => (
          <Form className="register-form">
            <div className="input-group">
              <label htmlFor="name">
                <FaUser className="icon" />{" "}
                Name
              </label>

              <Field
                id="name"
                name="name"
                type="text"
                className="input-field"
              />

              <ErrorMessage
                name="name"
                component="div"
                className="error-message"
              />
            </div>

            <div className="input-group">
              <label htmlFor="surname">
                <FaUser className="icon" />{" "}
                Surname
              </label>

              <Field
                id="surname"
                name="surname"
                type="text"
                className="input-field"
              />

              <ErrorMessage
                name="surname"
                component="div"
                className="error-message"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">
                <FaEnvelope className="icon" />{" "}
                Email
              </label>

              <Field
                id="email"
                name="email"
                type="email"
                className="input-field"
              />

              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <FaLock className="icon" />{" "}
                Password
              </label>

              <div className="password-wrapper">
                <Field
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className={`input-field ${
                    showPassword
                      ? "matrix-mode"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">
                <FaLock className="icon" />{" "}
                Confirm Password
              </label>

              <div className="password-wrapper">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="input-field"
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                status ===
                  "loading"
              }
              className="register-button"
            >
              {status ===
              "loading"
                ? "⏳ Loading..."
                : "✨ Register"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="login-link">
        <p>
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/main/auth/login"
            )
          }
          className="login-button-R"
        >
          🔑 Sign in
        </button>
      </div>
    </div>
  );
};

export default Register;