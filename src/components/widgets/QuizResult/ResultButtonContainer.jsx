import React from "react";

import "./ResultButtonContainer.css";

import Button from "../../common/Button/Button";

const ResultButtonContainer = ({ onNavigate, onRetry }) => {
  return (
    <div className="button-container bottom">
      <Button variant="secondary" onClickHandler={onRetry}>
        同じジャンルでもう1度
      </Button>
      <Button variant="tertiary" onClickHandler={onNavigate}>
        ホームへ戻る
      </Button>
    </div>
  );
};

export default ResultButtonContainer;
