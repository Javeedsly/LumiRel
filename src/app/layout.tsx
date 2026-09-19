"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import "./globals.css";

import {
  ReduxProvider,
} from "./redux/store/_page";

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  const pathname =
    usePathname();

  const [
    isPageLoaded,
    setIsPageLoaded,
  ] = useState(false);

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
    if (!showPublicLayout) {
      setIsPageLoaded(
        true
      );

      return;
    }

    setIsPageLoaded(
      false
    );

    const timer =
      window.setTimeout(
        () => {
          setIsPageLoaded(
            true
          );
        },
        650
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    pathname,
    showPublicLayout,
  ]);

  return (
    <html lang="az">
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

      <body
        className={
          isPageLoaded
            ? "page-loaded"
            : "loading"
        }
      >
        <ReduxProvider>
          <AnimatePresence>
            {!isPageLoaded &&
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
                    duration: 0.4,
                  }}
                >
                  <div className="loading-text">
                    LUMIREEL
                  </div>

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
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.32,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >
                  {
                    children
                  }
                </motion.div>
              </AnimatePresence>
            </main>

            {showPublicLayout && (
              <Footer />
            )}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}