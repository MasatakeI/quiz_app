import React from "react";
import "./Header.css";

import { Link } from "react-router";

import Tooltip from "@mui/material/Tooltip";

const Header = () => {
  return (
    <div className="header">
      <Tooltip title="ホームへ戻る">
        <Link to={"/"} className="logo">
          クイズアプリ
        </Link>
      </Tooltip>
    </div>
  );
};

export default Header;
