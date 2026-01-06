// common/Button/Button.jsx

import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClickHandler,
  variant = "primary",
  clickable = true,
}) => {
  const buttonClass = `button button-${variant}`;

  return (
    <button
      className={buttonClass}
      onClick={onClickHandler}
      disabled={!clickable}
    >
      {children}
    </button>
  );
};

export default Button;
