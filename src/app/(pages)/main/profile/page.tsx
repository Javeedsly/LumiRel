"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/redux/store/store";
import { getUserControl, logout, updateUserProfile } from "@/app/redux/features/authSlice/loginSlice";
import ProfileEdit from "@/app/Components/Profile/ProfileEdit/ProfileEdit";
import PremiumPanel from "@/app/Components/Profile/PremiumPanel/PremiumPanel";
import ProfileSidebar from "@/app/Components/Profile/ProfileSidebar/ProfileSidebar";
import FavoritesPanel from "@/app/Components/Profile/FavoritesPanel/FavoritesPanel";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress } from "@mui/material";
import "./profile.css";
import HomeTab from "@/app/Components/Profile/HomeTab/HomeTab";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

const ProfilePage = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [activeTab, setActiveTab] = useState("home");
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getUserControl()).then(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (user === null) {
            router.push("/main/auth/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    const handleUpdateProfile = async (values: any) => {
        await dispatch(updateUserProfile({ id: user.id, updatedData: values }));
        await dispatch(getUserControl());
    };

    const handleSubscribe = async (cardInfo: any, saveCard: boolean) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            isPremium: true,
            premiumStartDate: new Date().toISOString(),
            ...(saveCard && { cardInfo }),
        };

        await dispatch(updateUserProfile({ id: user.id, updatedData: updatedUser }));
        await dispatch(getUserControl());
    };

    const handleCancelPremium = async () => {
        if (!user) return;

        const startDate = new Date(user?.premiumStartDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const updatedUser = {
            ...user,
            premiumCancelDate: endDate.toISOString(),
        };

        await dispatch(updateUserProfile({ id: user.id, updatedData: updatedUser }));
        await dispatch(getUserControl());
    };

    const calculatePremiumEndDate = (startDate: string | null) => {
        if (!startDate) return null;
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 30);
        return end.toLocaleDateString();
    };

    const handleLogout = async () => {
        await dispatch(logout());
        router.push("/main/auth/login");
    };

    const premiumEndDate = calculatePremiumEndDate(user?.premiumStartDate);
    const premiumCancelDate = user?.premiumCancelDate || null;

    return (
        <ProtectedRoute>
            <div className="profile-container">
                <ProfileSidebar user={user} handleTabChange={setActiveTab} setShowLogoutConfirm={setShowLogoutConfirm} />

                <div className="profile-content">
                    {activeTab === "home" && <HomeTab user={user} />}
                    {activeTab === "edit" && <ProfileEdit user={user} handleUpdateProfile={handleUpdateProfile} />}
                    {activeTab === "premium" && (
                        <PremiumPanel
                            isPremiumActive={user.isPremium}
                            premiumEndDate={premiumEndDate}
                            premiumCancelDate={premiumCancelDate}
                            handleSubscribe={handleSubscribe}
                            handleCancelPremium={handleCancelPremium}
                        />
                    )}
                    {activeTab === "favorites" && <FavoritesPanel />}
                </div>

                <Dialog open={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)}>
                    <DialogTitle>Çıkış yapmak istediğinize emin misiniz?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setShowLogoutConfirm(false)} color="primary">❌ Hayır</Button>
                        <Button onClick={handleLogout} color="error">✔️ Evet</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
