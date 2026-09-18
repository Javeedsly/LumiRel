"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { FaUserEdit, FaHeart, FaStar, FaSignOutAlt, FaBars } from "react-icons/fa";
import { MdArrowBack, MdHome } from "react-icons/md";

interface ProfileSidebarProps {
    user: {
        profileImage?: string;
        email?: string;
        isPremium?: boolean;
    };
    handleTabChange: (tab: string) => void;
    setShowLogoutConfirm: (open: boolean) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, handleTabChange, setShowLogoutConfirm }) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();

    return (
        <aside className={`profile-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <button className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
                    <FaBars />
                </button>
                <div className="profile-info">
                    <img src={user?.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg"} alt="Profil" className="profile-image" />
                    {!collapsed && (
                        <div className="profile-text">
                            <p className="email">{user?.email}</p>
                            {user?.isPremium && <span className="premium-label">Premium</span>}
                        </div>
                    )}
                </div>
            </div>

            <nav className="sidebar-nav">
                <button onClick={() => handleTabChange("home")} className="nav-item">
                    <MdHome /> {!collapsed && "Home"}
                </button>
                <button onClick={() => handleTabChange("edit")} className="nav-item">
                    <FaUserEdit /> {!collapsed && "Profile Edit"}
                </button>
                <button onClick={() => handleTabChange("favorites")} className="nav-item">
                    <FaHeart /> {!collapsed && "Favorites"}
                </button>
                <button onClick={() => handleTabChange("premium")} className="nav-item">
                    <FaStar /> {!collapsed && "Premium Plane"}
                </button>
                <Link href="/">
                    <button className="nav-item back-button">
                        <MdArrowBack /> {!collapsed && "Back to Homepage"}
                    </button>
                </Link>
                
                <button onClick={() => setShowLogoutConfirm(true)} className="nav-item logout">
                    <FaSignOutAlt /> {!collapsed && "Logout"}
                </button>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;
