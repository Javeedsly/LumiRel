"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useDispatch,
  useSelector,
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

import {
  getUserControl,
  logout,
  updateUserProfile,
} from "@/app/redux/features/authSlice/loginSlice";

import type {
  CardInfo,
  User,
} from "@/app/redux/features/authSlice/loginSlice";

import ProfileEdit from "@/app/Components/Profile/ProfileEdit/ProfileEdit";
import PremiumPanel from "@/app/Components/Profile/PremiumPanel/PremiumPanel";
import ProfileSidebar from "@/app/Components/Profile/ProfileSidebar/ProfileSidebar";
import FavoritesPanel from "@/app/Components/Profile/FavoritesPanel/FavoritesPanel";
import HomeTab from "@/app/Components/Profile/HomeTab/HomeTab";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

import "./profile.css";

const ProfilePage = () => {
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
    useState("home");

  const [
    showLogoutConfirm,
    setShowLogoutConfirm,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    dispatch(
      getUserControl()
    ).finally(() => {
      setLoading(
        false
      );
    });
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
          id: user.id,
          updatedData:
            values,
        })
      ).unwrap();
    };

  const handleSubscribe =
    async (
      cardInfo:
        CardInfo,
      saveCard:
        boolean
    ) => {
      if (!user) {
        return;
      }

      const updatedUser:
        Partial<User> = {
        isPremium:
          true,

        premiumStartDate:
          new Date().toISOString(),

        premiumCancelDate:
          null,

        ...(saveCard
          ? {
              cardInfo,
            }
          : {}),
      };

      await dispatch(
        updateUserProfile({
          id: user.id,
          updatedData:
            updatedUser,
        })
      ).unwrap();
    };

  const handleCancelPremium =
    async () => {
      if (
        !user ||
        !user.premiumStartDate
      ) {
        return;
      }

      const startDate =
        new Date(
          user.premiumStartDate
        );

      if (
        Number.isNaN(
          startDate.getTime()
        )
      ) {
        return;
      }

      const endDate =
        new Date(
          startDate
        );

      endDate.setMonth(
        endDate.getMonth() +
          1
      );

      await dispatch(
        updateUserProfile({
          id: user.id,

          updatedData: {
            premiumCancelDate:
              endDate.toISOString(),
          },
        })
      ).unwrap();
    };

  const calculatePremiumEndDate =
    (
      startDate?:
        | string
        | null
    ):
      | string
      | null => {
      if (!startDate) {
        return null;
      }

      const start =
        new Date(
          startDate
        );

      if (
        Number.isNaN(
          start.getTime()
        )
      ) {
        return null;
      }

      const end =
        new Date(start);

      end.setDate(
        end.getDate() +
          30
      );

      return end.toLocaleDateString();
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
      <div className="profile-container">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const premiumEndDate =
    calculatePremiumEndDate(
      user.premiumStartDate
    );

  const premiumCancelDate =
    user.premiumCancelDate ??
    null;

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
            "premium" && (
            <PremiumPanel
              isPremiumActive={
                Boolean(
                  user.isPremium
                )
              }
              premiumEndDate={
                premiumEndDate
              }
              premiumCancelDate={
                premiumCancelDate
              }
              handleSubscribe={
                handleSubscribe
              }
              handleCancelPremium={
                handleCancelPremium
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
            Çıkış yapmak istediğinize emin
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