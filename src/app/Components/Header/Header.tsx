"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  useSelector,
} from "react-redux";

import type {
  RootState,
} from "@/app/redux/store/store";

import CategoryModal from "../CategoryModal/CategoryModal";
import FilmRecommender from "../FIlmRecommender/FilmRecommender";

import "./header.css";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const Header = () => {
  const pathname =
    usePathname();

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const profileHref =
    user
      ? "/main/profile"
      : "/main/auth/login";

  const isActive = (
    href: string
  ) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href
    );
  };

  const linkClass = (
    href: string
  ) =>
    `header__link ${
      isActive(href)
        ? "header__link--active"
        : ""
    }`;

  return (
    <motion.header
      className="site-header"
      initial={{
        opacity: 0,
        y: -22,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >
      <div className="header__container">
        <nav className="header__nav header__nav--left">
          <ul>
            <li className="header__nav-item">
              <CategoryModal />
            </li>

            <li className="header__nav-item">
              <Link
                className={
                  linkClass("/")
                }
                href="/"
              >
                Home
              </Link>
            </li>

            <li className="header__nav-item">
              <Link
                className={
                  linkClass(
                    "/main/allfilms"
                  )
                }
                href="/main/allfilms"
              >
                Movies
              </Link>
            </li>

            <li className="header__nav-item">
              <FilmRecommender />
            </li>
          </ul>
        </nav>

        <motion.div
          className="header__logo"
          whileHover={{
            scale: 1.03,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
        >
          <Link href="/">
            LumiReel
          </Link>
        </motion.div>

        <nav className="header__nav header__nav--right">
          <ul>
            <li className="header__nav-item">
              <Link
                className={
                  linkClass(
                    "/main/about"
                  )
                }
                href="/main/about"
              >
                About
              </Link>
            </li>

            <li className="header__nav-item">
              <Link
                className={
                  linkClass(
                    "/main/actors"
                  )
                }
                href="/main/actors"
              >
                Actors
              </Link>
            </li>

            <li className="header__profile">
              <Link
                href={profileHref}
                aria-label={
                  user
                    ? "Open profile"
                    : "Sign in"
                }
              >
                <img
                  className="header__profile-img"
                  src={
                    user?.profileImage ||
                    DEFAULT_AVATAR
                  }
                  alt="Profile"
                />
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="header__mobile-toggle"
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
          }
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            menuOpen
          }
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              className="header__mobile-backdrop"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMenuOpen(false)
              }
            />

            <motion.div
              className="header__mobile-menu"
              initial={{
                opacity: 0,
                y: -14,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              transition={{
                duration: 0.24,
              }}
            >
              <div className="header__mobile-tools">
                <CategoryModal />
                <FilmRecommender />
              </div>

              <nav>
                <Link
                  className={
                    linkClass("/")
                  }
                  href="/"
                >
                  Home
                </Link>

                <Link
                  className={
                    linkClass(
                      "/main/allfilms"
                    )
                  }
                  href="/main/allfilms"
                >
                  Movies
                </Link>

                <Link
                  className={
                    linkClass(
                      "/main/actors"
                    )
                  }
                  href="/main/actors"
                >
                  Actors
                </Link>

                <Link
                  className={
                    linkClass(
                      "/main/about"
                    )
                  }
                  href="/main/about"
                >
                  About
                </Link>

                <Link
                  className="header__mobile-profile"
                  href={profileHref}
                >
                  <img
                    src={
                      user?.profileImage ||
                      DEFAULT_AVATAR
                    }
                    alt=""
                  />

                  <span>
                    {user
                      ? "Profile"
                      : "Sign in"}
                  </span>
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;