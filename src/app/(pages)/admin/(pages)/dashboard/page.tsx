"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./dash.css";
import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";
import { fetchAdmins } from "@/app/redux/features/adminSlice/adminSlice";
import { getLogin } from "@/app/redux/features/authSlice/loginSlice";
import Aside from "../../components/AsideLeft/AsideLeft";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { adminData } = useSelector((state) => state.admin);
  const { data: films } = useSelector((state) => state.films);
  const { users } = useSelector((state) => state.auth);

  const [latestFilms, setLatestFilms] = useState([]);

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(getFilms());
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    if (films.length) {
      setLatestFilms([...films].slice(-5).reverse());
    }
  }, [films]);

  const superAdmins = adminData.filter((admin) => admin.role === "superadmin");
  const premiumUsers = users.filter((user) => user.isPremium);

  return (
    <main>
      <Aside />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Paneli</h1>
        <div className="card-grid">
          <div className="custom-card total-films">
            Filmlərin sayı: {films.length}
          </div>
          <div className="custom-card total-admins">
            Adminlərin sayı: {adminData.length}
          </div>
          <div className="custom-card total-users">
            İstifadəçilərin sayı: {users.length}
          </div>
          <div className="custom-card super-admins">
            Superadmin sayı: {superAdmins.length}
          </div>
          <div className="custom-card premium-users">
            Premium istifadəçilər: {premiumUsers.length}
          </div>
        </div>

        <h2 className="section-title">Son Əlavə Edilən 5 Film</h2>
        <div className="card-grid">
          {latestFilms.map((film) => (
            <div key={film.id} className="custom-card film-card">
              <img src={film.poster} alt={film.title} className="film-image" />
              <div className="card-content">
                <h3 className="film-title">{film.title}</h3>
                <p className="film-info">
                  {film.year} - {film.genre}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Super Adminlər</h2>
        <div className="list-container">
          {superAdmins.length > 0 ? (
            superAdmins.map((admin) => (
              <div key={admin.id} className="list-item">
                <img src={admin.avatar} alt={admin.name} className="avatar" />
                <div className="list-info">
                  <p className="name">{admin.name}</p>
                  <p className="role">Superadmin</p>
                </div>
              </div>
            ))
          ) : (
            <p>Super Admin tapılmadı.</p>
          )}
        </div>

        <h2 className="section-title">Premium İstifadəçilər</h2>
        <div className="list-container">
          {premiumUsers.length > 0 ? (
            premiumUsers.map((user) => (
              <div key={user.id} className="list-item">
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  className="avatar"
                />
                <div className="list-info">
                  <p className="name">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="role">Premium İstifadəçi</p>
                </div>
              </div>
            ))
          ) : (
            <p>Premium istifadəçi tapılmadı.</p>
          )}
        </div>
      </div>
    </main>
  );
}