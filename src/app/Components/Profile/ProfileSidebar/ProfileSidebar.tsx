"use client";

import Link from "next/link";

import { useState } from "react";

import {
  FaBars,
  FaHeart,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

import {
  MdArrowBack,
  MdHome,
} from "react-icons/md";

import type { User } from "@/app/redux/features/authSlice/loginSlice";

type ProfileTab =
  | "home"
  | "edit"
  | "favorites";

interface ProfileSidebarProps {
  user: User;

  activeTab:
    ProfileTab;

  handleTabChange:
    (
      tab:
        ProfileTab
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
  activeTab,
  handleTabChange,
  setShowLogoutConfirm,
}: ProfileSidebarProps) => {
  const [
    collapsed,
    setCollapsed,
  ] =
    useState(false);

  const fullName =
    [
      user.name,
      user.surname,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user.username ||
    "LumiReel User";

  const navClass = (
    tab:
      ProfileTab
  ) =>
    `nav-item ${
      activeTab === tab
        ? "nav-item--active"
        : ""
    }`;

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
              (previous) =>
                !previous
            )
          }
          aria-label="Toggle profile sidebar"
        >
          <FaBars />
        </button>

        <div className="profile-info">
          <img
            src={
              user.profileImage ||
              DEFAULT_AVATAR
            }
            alt={
              fullName
            }
            className="profile-image"
          />

          {!collapsed && (
            <div className="profile-text">
              <strong>
                {
                  fullName
                }
              </strong>

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
          className={
            navClass(
              "home"
            )
          }
        >
          <MdHome />

          {!collapsed &&
            "Overview"}
        </button>

        <button
          type="button"
          onClick={() =>
            handleTabChange(
              "edit"
            )
          }
          className={
            navClass(
              "edit"
            )
          }
        >
          <FaUserEdit />

          {!collapsed &&
            "Edit Profile"}
        </button>

        <button
          type="button"
          onClick={() =>
            handleTabChange(
              "favorites"
            )
          }
          className={
            navClass(
              "favorites"
            )
          }
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
            "Back Home"}
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
            "Sign Out"}
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;