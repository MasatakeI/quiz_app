import React, { useEffect, useState } from "react";
import "./Header.css";
import HeaderIconButton from "./HeaderIconButton";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import {
  faArrowRightToBracket,
  faArrowUpFromBracket,
  faHistory,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  selectIsAuthModalOpen,
  selectUser,
} from "@/redux/features/auth/authSelector";

const Header = () => {
  const { handleGoHome, handleGoHistory, handleOpenModal, handleSignOut } =
    useNavigationHelper();
  const location = useLocation();
  const isAuthModalOpen = useSelector(selectIsAuthModalOpen);
  const user = useSelector(selectUser);

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
      <h1 className="logo" onClick={handleGoHome}>
        クイズアプリ
      </h1>

      <div className="icons-container">
        <HeaderIconButton
          icon={faHome}
          title={"ホームへ戻る"}
          onClick={handleGoHome}
          isActive={location.pathname === "/"}
        />
        <HeaderIconButton
          icon={faHistory}
          title={"クイズの記録を見る"}
          onClick={handleGoHistory}
          isActive={location.pathname === "/quiz/history"}
        />
        <HeaderIconButton
          icon={!user ? faArrowRightToBracket : faArrowUpFromBracket}
          title={!user ? "ログイン" : "ログアウト"}
          onClick={!user ? handleOpenModal : handleSignOut}
          isActive={isAuthModalOpen}
        />
      </div>
    </div>
  );
};

export default Header;
