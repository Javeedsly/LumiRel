"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./footer.css";
import { useOptimizedComponent } from "@/app/hooks";

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-rgb-line"></div>

      <div className="footer-container">
        <div className="footer-column">
          <h3>LumiReel</h3>
          <p>
            LumiReel — A premium film platform. Watch the latest and highest-quality movies, curated for film lovers!
          </p>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-column">
          <h3>Frequently Asked Questions</h3>
          <ul>
            <li><Link href="/main/plans">Subscription Plans</Link></li>
            <li><Link href="/main/premium">About Premium</Link></li>
            <li><Link href="/main/securty">Account Security</Link></li>
            <li><Link href="/main/allfilms">Browse Movies</Link></li>
          </ul>
        </div>

        <div className="footer-divider"></div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:support@lumireel.com">support@lumireel.com</a></p>
          <p>Phone: <a href="tel:+994123456789">+994 12 345 67 89</a></p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="neon-text">© 2025 LumiReel. All rights reserved.</p>
      </div>
    </footer>
  );
};

const Footer = useOptimizedComponent(FooterComponent);

export default Footer;
