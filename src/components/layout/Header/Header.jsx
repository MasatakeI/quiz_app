import React, { useEffect, useState } from "react";
import "./Header.css";

import { Link } from "react-router";
import Tooltip from "@mui/material/Tooltip";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header ${isScrolled ? "scrolled" : ""}`}>
      <Tooltip title="ホームへ戻る">
        <Link to="/" className="logo" aria-label="ホームへ戻る">
          クイズアプリ
        </Link>
      </Tooltip>
    </div>
  );
};

export default Header;
