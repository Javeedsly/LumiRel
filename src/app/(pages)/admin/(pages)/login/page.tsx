"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import "./login.css";
import { fetchAdmins, loginAdmin } from "@/app/redux/features/adminSlice/adminSlice";
import { RootState } from "@/app/redux/store/store";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminData, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAdmins()); 
  }, [dispatch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      alert("Məlumatlar yüklənir, bir az gözləyin...");
      return;
    }

    if (error) {
      alert(`Serverdə xəta baş verdi: ${error}`);
      return;
    }

    if (!adminData || adminData.length === 0) {
      alert("Admin məlumatları yüklənmədi!");
      return;
    }

    const foundAdmin = adminData.find(
      (admin) => admin.name === username && admin.password === password
    );

    if (!foundAdmin) {
      alert("İstifadəçi adı və ya şifrə yalnışdır!");
      return;
    }

    dispatch(loginAdmin(foundAdmin));
    localStorage.setItem("admin", JSON.stringify(foundAdmin));

    const rolePath =
      foundAdmin.role === "superadmin"
        ? "/admin/superadmin"
        : foundAdmin.role === "filmadmin"
        ? "/admin/filmadmin"
        : "/admin/useradmin";

    router.push(rolePath);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
