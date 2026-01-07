import React from "react";
import "./Footer.css";
import { Link } from "react-router";

import Home from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";
import Tooltip from "@mui/material/Tooltip";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          {/* <Tooltip title="ホームへ戻る">
            <Link to="/">
              <Home fontSize="small" />
            </Link>
          </Tooltip> */}

          <Tooltip title="GitHubページ">
            <a
              href="https://github.com/MasatakeI/quiz_app.git"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <GitHubIcon fontSize="small" />
            </a>
          </Tooltip>
        </div>
        <p className="copyright">
          &copy; {currentYear} クイズアプリ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
