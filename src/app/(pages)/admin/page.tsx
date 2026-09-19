"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type {
  RootState,
} from "@/app/redux/store/store";

type AdminRole =
  | "superadmin"
  | "filmadmin"
  | "useradmin";

interface StoredAdmin {
  id?: number;
  name?: string;
  avatar?: string;
  password?: string;
  role?: AdminRole;
}

const isValidAdminRole = (
  role: unknown
): role is AdminRole => {
  return (
    role === "superadmin" ||
    role === "filmadmin" ||
    role === "useradmin"
  );
};

const getAdminRoute = (
  role: AdminRole
): string => {
  switch (role) {
    case "superadmin":
      return "/admin/superadmin";

    case "filmadmin":
      return "/admin/filmadmin";

    case "useradmin":
      return "/admin/useradmin";

    default:
      return "/admin/login";
  }
};

const AdminPage = () => {
  const router = useRouter();

  const currentAdmin =
    useSelector(
      (state: RootState) =>
        state.admin.currentAdmin
    );

  useEffect(() => {
    let admin:
      StoredAdmin | null =
      currentAdmin;

    if (!admin) {
      const storedAdmin =
        localStorage.getItem(
          "admin"
        );

      if (storedAdmin) {
        try {
          admin =
            JSON.parse(
              storedAdmin
            ) as StoredAdmin;
        } catch (error) {
          console.error(
            "Admin məlumatını oxumaq mümkün olmadı:",
            error
          );

          localStorage.removeItem(
            "admin"
          );

          router.replace(
            "/admin/login"
          );

          return;
        }
      }
    }

    if (!admin) {
      router.replace(
        "/admin/login"
      );

      return;
    }

    if (
      !isValidAdminRole(
        admin.role
      )
    ) {
      localStorage.removeItem(
        "admin"
      );

      router.replace(
        "/admin/login"
      );

      return;
    }

    const adminRoute =
      getAdminRoute(
        admin.role
      );

    router.replace(
      adminRoute
    );
  }, [
    router,
    currentAdmin,
  ]);

  return null;
};

export default AdminPage;