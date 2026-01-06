import React from "react";
import "./Footer.css";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/">ホーム</Link>
          <Link to="/">このアプリについて</Link>
          <Link to="/">お問い合わせ</Link>
        </div>
        <p className="copyright">
          &copy; {currentYear} クイズアプリ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
