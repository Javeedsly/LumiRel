"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import type {
  User,
} from "@/app/redux/features/authSlice/loginSlice";

import {
  getUserControl,
  logout,
  updateUserProfile,
} from "@/app/redux/features/authSlice/loginSlice";

import ProfileEdit from "@/app/Components/Profile/ProfileEdit/ProfileEdit";
import ProfileSidebar from "@/app/Components/Profile/ProfileSidebar/ProfileSidebar";
import FavoritesPanel from "@/app/Components/Profile/FavoritesPanel/FavoritesPanel";
import HomeTab from "@/app/Components/Profile/HomeTab/HomeTab";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

import "./profile.css";

const ProfilePage =
  () => {
    const router =
      useRouter();

    const dispatch =
      useDispatch<AppDispatch>();

    const user =
      useSelector(
        (
          state:
            RootState
        ) =>
          state.auth
            .user
      );

    const [
      activeTab,
      setActiveTab,
    ] =
      useState(
        "home"
      );

    const [
      showLogoutConfirm,
      setShowLogoutConfirm,
    ] =
      useState(
        false
      );

    const [
      loading,
      setLoading,
    ] =
      useState(
        true
      );

    useEffect(() => {
      dispatch(
        getUserControl()
      ).finally(
        () => {
          setLoading(
            false
          );
        }
      );
    }, [dispatch]);

    useEffect(() => {
      if (
        !loading &&
        !user
      ) {
        router.replace(
          "/main/auth/login"
        );
      }
    }, [
      user,
      loading,
      router,
    ]);

    const handleUpdateProfile =
      async (
        values:
          Partial<User>
      ) => {
        if (!user) {
          return;
        }

        await dispatch(
          updateUserProfile({
            id:
              user.id,

            updatedData:
              values,
          })
        ).unwrap();
      };

    const handleLogout =
      async () => {
        await dispatch(
          logout()
        ).unwrap();

        router.replace(
          "/main/auth/login"
        );
      };

    if (loading) {
      return (
        <div className="profile-loading">
          <CircularProgress />
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return (
      <ProtectedRoute>
        <div className="profile-container">
          <ProfileSidebar
            user={
              user
            }
            handleTabChange={
              setActiveTab
            }
            setShowLogoutConfirm={
              setShowLogoutConfirm
            }
          />

          <div className="profile-content">
            {activeTab ===
              "home" && (
              <HomeTab
                user={
                  user
                }
              />
            )}

            {activeTab ===
              "edit" && (
              <ProfileEdit
                user={
                  user
                }
                handleUpdateProfile={
                  handleUpdateProfile
                }
              />
            )}

            {activeTab ===
              "favorites" && (
              <FavoritesPanel />
            )}
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
          >
            <DialogTitle>
              Çıkış yapmak
              istediğinize
              emin
              misiniz?
            </DialogTitle>

            <DialogActions>
              <Button
                onClick={() =>
                  setShowLogoutConfirm(
                    false
                  )
                }
              >
                ❌ Hayır
              </Button>

              <Button
                onClick={
                  handleLogout
                }
                color="error"
              >
                ✔️ Evet
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ProtectedRoute>
    );
  };

export default ProfilePage;