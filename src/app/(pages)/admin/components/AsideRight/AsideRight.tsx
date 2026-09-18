"use client";

import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import "./asider.css";

import {
  fetchAdmins,
} from "@/app/redux/features/adminSlice/adminSlice";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

interface StoredAdmin {
  role?: string;
}

const AsideRight = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const {
    adminData,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.admin
  );

  useEffect(() => {
    const storedAdmin =
      localStorage.getItem(
        "admin"
      );

    if (!storedAdmin) {
      setIsSuperAdmin(false);

      return;
    }

    try {
      const admin =
        JSON.parse(
          storedAdmin
        ) as StoredAdmin;

      setIsSuperAdmin(
        admin.role ===
          "superadmin"
      );
    } catch (error) {
      console.error(
        "Admin məlumatını oxumaq mümkün olmadı:",
        error
      );

      setIsSuperAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (
      isSuperAdmin &&
      adminData.length === 0
    ) {
      dispatch(
        fetchAdmins()
      );
    }
  }, [
    dispatch,
    isSuperAdmin,
    adminData.length,
  ]);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="aside-right">
      <div className="admin-aside-right">
        <h2 className="admin-title">
          Admin List
        </h2>

        {loading && (
          <p className="loading">
            Loading...
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <ul className="admins">
          {adminData.length >
          0 ? (
            adminData.map(
              (admin) => (
                <li
                  key={
                    admin.id
                  }
                  className="admin-item"
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
                    className="admin-avatar"
                  />

                  <span className="admin-name">
                    {
                      admin.name
                    }
                  </span>

                  <span className="admin-role">
                    {
                      admin.role
                    }
                  </span>
                </li>
              )
            )
          ) : !loading &&
            !error ? (
            <li className="no-admins">
              No admins found
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default AsideRight;