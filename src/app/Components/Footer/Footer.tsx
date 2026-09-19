"use client";

import React from "react";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import "./footer.css";

const FooterComponent =
  () => {
    return (
      <footer className="footer">
        <div className="footer-rgb-line" />

        <div className="footer-container">
          <div className="footer-column">
            <h3>
              LumiReel
            </h3>

            <p>
              Discover,
              watch and
              discuss movies
              freely with the
              LumiReel
              community.
            </p>
          </div>

          <div className="footer-divider" />

          <div className="footer-column">
            <h3>
              Explore
            </h3>

            <ul>
              <li>
                <Link href="/main/allfilms">
                  Browse Movies
                </Link>
              </li>

              <li>
                <Link href="/main/actors">
                  Actors
                </Link>
              </li>

              <li>
                <Link href="/main/about">
                  About LumiReel
                </Link>
              </li>

              <li>
                <Link href="/main/security">
                  Account Security
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-divider" />

          <div className="footer-column">
            <h3>
              Contact Us
            </h3>

            <p>
              Email:{" "}
              <a href="mailto:support@lumireel.com">
                support@lumireel.com
              </a>
            </p>

            <p>
              Phone:{" "}
              <a href="tel:+994123456789">
                +994 12
                345 67 89
              </a>
            </p>

            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="neon-text">
            © 2026
            LumiReel. All
            rights reserved.
          </p>
        </div>
      </footer>
    );
  };

const Footer =
  React.memo(
    FooterComponent
  );

Footer.displayName =
  "Footer";

export default Footer;