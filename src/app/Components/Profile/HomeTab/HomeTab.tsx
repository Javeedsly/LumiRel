"use client";

import React from "react";
import "./homeTab.css";
import { FaHeart, FaStar, FaFilm, FaUser } from "react-icons/fa";

interface HomeTabProps {
    user: {
        profileImage?: string;
        email?: string;
        name?: string;
        surname?: string;
        isPremium?: boolean;
        wishlist?: any[];
    };
}

const HomeTab: React.FC<HomeTabProps> = ({ user }) => {
    return (
        <div className="home-tab">
            <div className="profile-overview">
                <img src={user?.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg"} alt="Profil Resmi" className="profile-img" />
                <div className="profile-info">
                    <h2>{user?.name} {user?.surname}</h2>
                    <p className="email">{user?.email}</p>
                    {user?.isPremium && <span className="premium-badge">🌟 Premium Kullanıcı</span>}
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-card">
                    <FaHeart className="stat-icon" />
                    <p><strong>{user?.wishlist?.length || 0}</strong> Beğenilen Filmler</p>
                </div>
                <div className="stat-card">
                    <FaStar className="stat-icon" />
                    <p><strong>{user?.isPremium ? "Aktif" : "Pasif"}</strong> Premium Durumu</p>
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
