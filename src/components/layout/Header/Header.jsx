import React, { useEffect, useState } from "react";
import "./Header.css";

import Tooltip from "@mui/material/Tooltip";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const Header = () => {
  const { handleGoHome } = useNavigationHelper();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div role="banner" className={`header ${isScrolled ? "scrolled" : ""}`}>
      <Tooltip title="ホームへ戻る">
        <button
          onClick={handleGoHome}
          className="logo"
          aria-label="ホームへ戻る"
        >
          クイズアプリ
        </button>
      </Tooltip>
    </div>
  );
};

export default Header;
