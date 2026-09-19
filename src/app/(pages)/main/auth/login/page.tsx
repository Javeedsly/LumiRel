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
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import {
  LoginSchema,
} from "@/app/schema/loginSchema";

import {
  checkUser,
  getLogin,
} from "@/app/redux/features/authSlice/loginSlice";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import "./login.css";

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const router =
    useRouter();

  const {
    user,
    status,
    error,
  } = useSelector(
    (state: RootState) =>
      state.auth
  );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.replace(
        "/main/profile"
      );
    }
  }, [
    user,
    router,
  ]);

  const initialValues:
    LoginValues = {
    email: "",
    password: "",
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        🔐 Sign in
      </h2>

      <Formik<LoginValues>
        initialValues={
          initialValues
        }
        validationSchema={
          LoginSchema
        }
        onSubmit={(
          values,
          {
            setSubmitting,
          }
        ) => {
          dispatch(
            checkUser(
              values
            )
          );

          setSubmitting(
            false
          );
        }}
      >
        {({
          isSubmitting,
        }) => (
          <Form className="login-form">
            <div className="input-group">
              <label htmlFor="email">
                <FaEnvelope className="icon" />{" "}
                Email
              </label>

              <Field
                id="email"
                type="email"
                name="email"
                className="input-field"
              />

              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">
                <FaLock className="icon" />{" "}
                Password
              </label>

              <div className="password-wrapper">
                <Field
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  className="input-field"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                  className="eye-icon"
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

            <button
              type="submit"
              disabled={
                isSubmitting ||
                status ===
                  "loading"
              }
              className="login-button"
            >
              {status ===
              "loading"
                ? "⏳ Loading..."
                : "🚀 Sign in"}
            </button>

            {status ===
              "failed" &&
              error && (
                <p className="error-message">
                  {error}
                </p>
              )}
          </Form>
        )}
      </Formik>

      <div className="register-link">
        <p>
          Don&apos;t have an
          account?
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/main/auth/register"
            )
          }
          className="register-button-L"
        >
          ✨ Register
        </button>
      </div>
    </div>
  );
};

export default LoginPage;