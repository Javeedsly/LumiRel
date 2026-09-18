import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./header.css";
import SearchButton from "../SearchButton/SearchButton";
import CategoryModal from "../CategoryModal/CategoryModal";
import FilmRecommender from "../FIlmRecommender/FilmRecommender";
import { useGlobalState } from "@/app/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store/store";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("User:", user);
    console.log("Profile Image:", profileImage);
  }, [profileImage, user]);

  return (
    <header>
      <div className="header__container">
        <nav className="header__nav header__nav--left">
          <ul>
            <li className="header__nav-item">
              <CategoryModal />
            </li>
            <li className="header__nav-item">
              <Link href="/">Home</Link>
            </li>
            <li className="header__nav-item">
              <Link href="../../main/allfilms">Movies</Link>
            </li>
            <li className="header__nav-item">
              <FilmRecommender />
            </li>
          </ul>
        </nav>

        <div className="header__logo">LumiReel</div>

        <nav className="header__nav header__nav--right">
          <ul>
            <li className="header__nav-item">
              <SearchButton />
            </li>
            <li className="header__nav-item">
              <Link href="../../main/about">About</Link>
            </li>
            <li className="header__nav-item">
              <Link href="../../main/actors">Actors</Link>
            </li>
            <li className="header__profile">
              <Link href="../../main/profile">
                <img
                  className="header__profile-img"
                  src={user?.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg"} // 🔹 Əgər user gəlməyibsə, default avatar göstər
                  alt="Profil Şəkli"
                />
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;