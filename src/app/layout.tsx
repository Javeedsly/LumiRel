"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useDispatch,
} from "react-redux";

import type {
  AppDispatch,
} from "./redux/store/store";

import {
  getUserControl,
} from "./redux/features/authSlice/loginSlice";

import {
  ReduxProvider,
} from "./redux/store/_page";

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

import "./globals.css";
import "./responsive-media.css";

interface RootLayoutProps {
  children: ReactNode;
}

interface AppShellProps {
  children: ReactNode;
  pathname: string;
  showPublicLayout: boolean;
  booting: boolean;
}

const AppShell = ({
  children,
  pathname,
  showPublicLayout,
  booting,
}: AppShellProps) => {
  const dispatch =
    useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getUserControl()
    );
  }, [dispatch]);

  return (
    <>
      <AnimatePresence>
        {booting &&
          showPublicLayout && (
            <motion.div
              className="loading-screen"
              initial={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <motion.div
                className="loading-text"
                initial={{
                  opacity: 0,
                  scale: 0.92,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                LUMIREEL
              </motion.div>

              <div className="loading-glow" />

              <div className="loading-rings">
                <span />
                <span />
                <span />
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      <div className="content-wrapper">
        {showPublicLayout && (
          <Header />
        )}

        <main className="page-content">
          <AnimatePresence
            mode="wait"
            initial={
              false
            }
          >
            <motion.div
              key={
                pathname
              }
              className="route-transition"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.26,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {showPublicLayout && (
          <Footer />
        )}
      </div>
    </>
  );
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  const pathname =
    usePathname();

  const [
    booting,
    setBooting,
  ] =
    useState(true);

  const isAdmin =
    pathname.startsWith(
      "/admin"
    );

  const isAuth =
    pathname.startsWith(
      "/main/auth"
    );

  const showPublicLayout =
    !isAdmin &&
    !isAuth;

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setBooting(
            false
          );
        },
        450
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>
          LumiReel
        </title>

        <meta
          name="description"
          content="Discover, watch and enjoy movies with LumiReel."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <link
          rel="icon"
          href="/images.jpeg"
        />
      </head>

      <body>
        <ReduxProvider>
          <AppShell
            pathname={
              pathname
            }
            showPublicLayout={
              showPublicLayout
            }
            booting={
              booting
            }
          >
            {children}
          </AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}