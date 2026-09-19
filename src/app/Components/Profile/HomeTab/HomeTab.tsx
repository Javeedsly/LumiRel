"use client";

import {
  FaHeart,
  FaFilm,
} from "react-icons/fa";

import type {
  User,
} from "@/app/redux/features/authSlice/loginSlice";

import "./homeTab.css";

interface HomeTabProps {
  user: User;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const HomeTab = ({
  user,
}: HomeTabProps) => {
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

  return (
    <div className="home-tab">
      <div className="profile-overview">
        <img
          src={
            user.profileImage ||
            DEFAULT_AVATAR
          }
          alt={
            fullName
          }
          className="profile-img"
        />

        <div className="profile-info">
          <h2>
            {
              fullName
            }
          </h2>

          <p className="email">
            {
              user.email
            }
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <FaHeart className="stat-icon" />

          <p>
            <strong>
              {user.wishlist
                ?.length ??
                0}
            </strong>{" "}
            Saved Movies
          </p>
        </div>

        <div className="stat-card">
          <FaFilm className="stat-icon" />

          <p>
            <strong>
              Full Access
            </strong>

            <br />

            All Movies
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;