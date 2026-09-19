"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import {
  getUserControl,
} from "@/app/redux/features/authSlice/loginSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const router =
    useRouter();

  const dispatch =
    useDispatch<AppDispatch>();

  const user =
    useSelector(
      (
        state:
          RootState
      ) =>
        state.auth
          .user
    );

  const [
    checked,
    setChecked,
  ] =
    useState(false);

  useEffect(() => {
    let mounted =
      true;

    dispatch(
      getUserControl()
    ).finally(
      () => {
        if (
          mounted
        ) {
          setChecked(
            true
          );
        }
      }
    );

    return () => {
      mounted =
        false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      checked &&
      !user
    ) {
      router.replace(
        "/main/auth/login"
      );
    }
  }, [
    checked,
    user,
    router,
  ]);

  if (
    !checked ||
    !user
  ) {
    return (
      <div
        style={{
          minHeight:
            "70vh",

          display:
            "grid",

          placeItems:
            "center",

          color:
            "#8d8993",

          background:
            "#000",
        }}
      >
        Checking
        session...
      </div>
    );
  }

  return (
    <>
      {
        children
      }
    </>
  );
};

export default ProtectedRoute;