"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const AdminPage = () => {
  const router = useRouter();
  const admin = useSelector((state: RootState) => state.admin.loggedInAdmin); 

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin") || "null");

    if (!storedAdmin) {
      router.push("/admin/login"); 
      return;
    }

    const validRoles = ["superadmin", "filmadmin", "useradmin"];

    if (!validRoles.includes(storedAdmin.role)) {
      localStorage.removeItem("admin"); 
      router.push("/admin/login");
      return;
    }

    const expectedPath =
      storedAdmin.role === "superadmin"
        ? "/admin/superadmin"
        : storedAdmin.role === "filmadmin"
        ? "/admin/filmadmin"
        : "/admin/useradmin";

    if (window.location.pathname !== expectedPath) {
      localStorage.removeItem("admin");
      router.push("/admin/login");
    } else {
      router.push(expectedPath);
    }
  }, [router, admin]);

  return null;
};

export default AdminPage;
