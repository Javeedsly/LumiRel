"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import type { User } from "@/app/redux/features/authSlice/loginSlice";

import {
  logout,
  updateUserProfile,
} from "@/app/redux/features/authSlice/loginSlice";

import ProfileEdit from "@/app/Components/Profile/ProfileEdit/ProfileEdit";
import ProfileSidebar from "@/app/Components/Profile/ProfileSidebar/ProfileSidebar";
import FavoritesPanel from "@/app/Components/Profile/FavoritesPanel/FavoritesPanel";
import HomeTab from "@/app/Components/Profile/HomeTab/HomeTab";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

import "./profile.css";

type ProfileTab =
  | "home"
  | "edit"
  | "favorites";

const ProfileContent = () => {
  const router =
    useRouter();

  const dispatch =
    useDispatch<AppDispatch>();

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ProfileTab>(
      "home"
    );

  const [
    showLogoutConfirm,
    setShowLogoutConfirm,
  ] =
    useState(false);

  if (!user) {
    return null;
  }

  const handleUpdateProfile =
    async (
      values:
        Partial<User>
    ) => {
      await dispatch(
        updateUserProfile({
          id: user.id,
          updatedData:
            values,
        })
      ).unwrap();
    };

  const handleLogout =
    async () => {
      try {
        await dispatch(
          logout()
        ).unwrap();
      } finally {
        router.replace(
          "/main/auth/login"
        );
      }
    };

  return (
    <main className="profile-page">
      <div className="profile-container">
        <ProfileSidebar
          user={user}
          activeTab={
            activeTab
          }
          handleTabChange={
            setActiveTab
          }
          setShowLogoutConfirm={
            setShowLogoutConfirm
          }
        />

        <section className="profile-content">
          {activeTab ===
            "home" && (
            <HomeTab
              user={user}
            />
          )}

          {activeTab ===
            "edit" && (
            <ProfileEdit
              user={user}
              handleUpdateProfile={
                handleUpdateProfile
              }
            />
          )}

          {activeTab ===
            "favorites" && (
            <FavoritesPanel />
          )}
        </section>
      </div>

      <Dialog
        open={
          showLogoutConfirm
        }
        onClose={() =>
          setShowLogoutConfirm(
            false
          )
        }
        PaperProps={{
          className:
            "logout-dialog",
        }}
      >
        <DialogTitle>
          Sign out?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign
            out of LumiReel?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setShowLogoutConfirm(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleLogout
            }
            color="error"
          >
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;