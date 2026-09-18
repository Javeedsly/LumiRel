"use client";

import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import "./dash.css";

import {
  getFilms,
} from "@/app/redux/features/apiSlice/apiSlice";

import {
  fetchAdmins,
} from "@/app/redux/features/adminSlice/adminSlice";

import {
  getLogin,
} from "@/app/redux/features/authSlice/loginSlice";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import Aside from "../../components/AsideLeft/AsideLeft";

interface DashboardUser {
  id: string | number;

  firstName?: string;
  lastName?: string;

  name?: string;
  surname?: string;

  username?: string;

  profileImage?: string;

  isPremium?: boolean;
}

type Film =
  RootState["films"]["data"][number];

export default function Dashboard() {
  const dispatch =
    useDispatch<AppDispatch>();

  const adminData =
    useSelector(
      (state: RootState) =>
        state.admin.adminData
    );

  const films =
    useSelector(
      (state: RootState) =>
        state.films.data
    );

  const users =
    useSelector(
      (state: RootState) =>
        state.auth.users
    ) as DashboardUser[];

  const [
    latestFilms,
    setLatestFilms,
  ] = useState<Film[]>([]);

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(getFilms());
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    if (films.length > 0) {
      const lastFiveFilms =
        [...films]
          .slice(-5)
          .reverse();

      setLatestFilms(
        lastFiveFilms
      );
    } else {
      setLatestFilms([]);
    }
  }, [films]);

  const superAdmins =
    adminData.filter(
      (admin) =>
        admin.role ===
        "superadmin"
    );

  const premiumUsers =
    users.filter(
      (user) =>
        user.isPremium === true
    );

  return (
    <main>
      <Aside />

      <div className="dashboard-container">
        <h1 className="dashboard-title">
          Admin Paneli
        </h1>

        <div className="card-grid">
          <div className="custom-card total-films">
            Filmlərin sayı:{" "}
            {films.length}
          </div>

          <div className="custom-card total-admins">
            Adminlərin sayı:{" "}
            {adminData.length}
          </div>

          <div className="custom-card total-users">
            İstifadəçilərin sayı:{" "}
            {users.length}
          </div>

          <div className="custom-card super-admins">
            Superadmin sayı:{" "}
            {superAdmins.length}
          </div>

          <div className="custom-card premium-users">
            Premium istifadəçilər:{" "}
            {premiumUsers.length}
          </div>
        </div>

        <h2 className="section-title">
          Son Əlavə Edilən 5 Film
        </h2>

        <div className="card-grid">
          {latestFilms.length > 0 ? (
            latestFilms.map(
              (film) => (
                <div
                  key={film.id}
                  className="custom-card film-card"
                >
                  <img
                    src={
                      film.poster ||
                      "/default-movie.png"
                    }
                    alt={
                      film.title ||
                      "Film"
                    }
                    className="film-image"
                  />

                  <div className="card-content">
                    <h3 className="film-title">
                      {film.title}
                    </h3>

                    <p className="film-info">
                      {film.year} -{" "}
                      {film.genre}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <p>
              Film tapılmadı.
            </p>
          )}
        </div>

        <h2 className="section-title">
          Super Adminlər
        </h2>

        <div className="list-container">
          {superAdmins.length > 0 ? (
            superAdmins.map(
              (admin) => (
                <div
                  key={admin.id}
                  className="list-item"
                >
                  <img
                    src={
                      admin.avatar ||
                      "/default-avatar.png"
                    }
                    alt={
                      admin.name ||
                      "Admin"
                    }
                    className="avatar"
                  />

                  <div className="list-info">
                    <p className="name">
                      {admin.name}
                    </p>

                    <p className="role">
                      Superadmin
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <p>
              Super Admin
              tapılmadı.
            </p>
          )}
        </div>

        <h2 className="section-title">
          Premium İstifadəçilər
        </h2>

        <div className="list-container">
          {premiumUsers.length > 0 ? (
            premiumUsers.map(
              (user) => {
                const fullName =
                  [
                    user.firstName ??
                      user.name,

                    user.lastName ??
                      user.surname,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  user.username ||
                  "İstifadəçi";

                return (
                  <div
                    key={user.id}
                    className="list-item"
                  >
                    <img
                      src={
                        user.profileImage ||
                        "/default-avatar.png"
                      }
                      alt={fullName}
                      className="avatar"
                    />

                    <div className="list-info">
                      <p className="name">
                        {fullName}
                      </p>

                      <p className="role">
                        Premium
                        İstifadəçi
                      </p>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <p>
              Premium istifadəçi
              tapılmadı.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}