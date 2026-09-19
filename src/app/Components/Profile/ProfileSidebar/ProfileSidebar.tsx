"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  FaUserEdit,
  FaHeart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import {
  MdArrowBack,
  MdHome,
} from "react-icons/md";

import type {
  User,
} from "@/app/redux/features/authSlice/loginSlice";

interface ProfileSidebarProps {
  user: User;

  handleTabChange:
    (
      tab: string
    ) => void;

  setShowLogoutConfirm:
    (
      open:
        boolean
    ) => void;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const ProfileSidebar = ({
  user,
  handleTabChange,
  setShowLogoutConfirm,
}: ProfileSidebarProps) => {
  const [
    collapsed,
    setCollapsed,
  ] =
    useState(false);

  return (
    <aside
      className={`profile-sidebar ${
        collapsed
          ? "collapsed"
          : ""
      }`}
    >
      <div className="sidebar-header">
        <button
          type="button"
          className="toggle-button"
          onClick={() =>
            setCollapsed(
              (
                previous
              ) =>
                !previous
            )
          }
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>

        <div className="profile-info">
          <img
            src={
              user.profileImage ||
              DEFAULT_AVATAR
            }
            alt="Profil"
            className="profile-image"
          />

          {!collapsed && (
            <div className="profile-text">
              <p className="email">
                {user.email ||
                  "LumiReel User"}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          onClick={() =>
            handleTabChange(
              "home"
            )
          }
          className="nav-item"
        >
          <MdHome />

          {!collapsed &&
            "Home"}
        </button>

        <button
          type="button"
          onClick={() =>
            handleTabChange(
              "edit"
            )
          }
          className="nav-item"
        >
          <FaUserEdit />

          {!collapsed &&
            "Profile Edit"}
        </button>

        <button
          type="button"
          onClick={() =>
            handleTabChange(
              "favorites"
            )
          }
          className="nav-item"
        >
          <FaHeart />

          {!collapsed &&
            "Favorites"}
        </button>

        <Link
          href="/"
          className="nav-item back-button"
        >
          <MdArrowBack />

          {!collapsed &&
            "Back to Homepage"}
        </Link>

        <button
          type="button"
          onClick={() =>
            setShowLogoutConfirm(
              true
            )
          }
          className="nav-item logout"
        >
          <FaSignOutAlt />

          {!collapsed &&
            "Logout"}
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;