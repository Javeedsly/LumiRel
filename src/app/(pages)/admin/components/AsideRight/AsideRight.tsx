"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import "./asider.css";
import { fetchAdmins } from "@/app/redux/features/adminSlice/adminSlice";

const AsideRight = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const { adminData, loading, error } = useSelector(
    (state: RootState) =>
      state.admin || { adminData: [], loading: false, error: null }
  );

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setIsSuperAdmin(admin.role === "superadmin");
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin && adminData.length === 0) {
      dispatch(fetchAdmins());
    }
  }, [dispatch, isSuperAdmin, adminData.length]);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="aside-right">
      <div className="admin-aside-right">
        <h2 className="admin-title">Admin List</h2>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        <ul className="admins">
          {adminData.length > 0 ? (
            adminData.map((admin) => (
              <li key={admin.id} className="admin-item">
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="admin-avatar"
                />
                <span className="admin-name">{admin.name}</span>
                <span className="admin-role">{admin.role}</span>
              </li>
            ))
          ) : (
            <p className="no-admins">No admins found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AsideRight;
