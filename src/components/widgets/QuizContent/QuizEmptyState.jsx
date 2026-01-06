import React from "react";
import Button from "../../common/Button/Button";

const QuizEmptyState = ({ onReload }) => (
  <>
    <p>クイズがありません</p>
    <Button onClickHandler={onReload}>再読み込みしてください</Button>
  </>
);

export default QuizEmptyState;
