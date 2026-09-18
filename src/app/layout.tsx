"use client";
import Head from "next/head";
import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReduxProvider } from "./redux/store/_page";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/admin") && pathname !== "/main/auth/login" && pathname !== "/main/auth/register") {
      setTimeout(() => setIsPageLoaded(true), 2000);
    } else {
      setIsPageLoaded(true);
    }
  }, [pathname]);

  return (
    <ReduxProvider>
      <Head>
        <title>LumiReel</title>
        <meta name="description" content="Cinematic experience redefined" />
        <link rel="icon" href="./images.jpeg" />
      </Head>

      <html lang="en">
        <body className={isPageLoaded ? "page-loaded" : "loading"}>
          {!isPageLoaded && !pathname.startsWith("/admin") && pathname !== "/main/auth/login" && pathname !== "/main/auth/register" && (
            <div className="loading-screen">
              <div className="loading-text">LUMIREEL</div>
              <div className="loading-glow"></div>
              <div className="loading-rings">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div className="content-wrapper">
            <Header />
            <main className="page-content">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ReduxProvider>
  );
}
