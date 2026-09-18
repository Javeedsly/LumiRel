"use client";

import "./super.css";
import AsideLeft from "../../components/AsideLeft/AsideLeft";
import AsideRight from "../../components/AsideRight/AsideRight";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<{
    name: string;
    role: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin") || "null");

    if (storedAdmin) {
      setAdmin({
        name: storedAdmin.name,
        role: storedAdmin.role,
        avatar: storedAdmin.avatar
          ? storedAdmin.avatar
          : "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png",
      });
    } else {
      router.push("/admin/login");
    }
  }, [router]);
  return (
      <main >
        <AsideLeft />
        <div className="home-container">
          <motion.div
            className="home-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={admin?.avatar}
              alt="Admin Avatar"
              className="admin-avatar"
            />
            <h1 className="welcome-text">Welcome to Lumireel's Admin Panel</h1>
            {admin && (
              <p className="admin-info">
                <span>Role: {admin.role}</span> |{" "}
                <span>Name: {admin.name}</span>
              </p>
            )}
          </motion.div>
        </div>
        <AsideRight />
      </main>
  );
};

export default Page;
