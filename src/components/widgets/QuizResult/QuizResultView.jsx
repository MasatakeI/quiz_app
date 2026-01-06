import React from "react";

const QuizResultView = ({
  quizTitle,
  numberOfCorrects,
  amount,
  getType,
  difficultyMap,
  difficulty,
}) => {
  return (
    <>
      <h1>{quizTitle}クイズ 結果</h1>
      <h2>正解数 {numberOfCorrects}問</h2>

      <div className="selected-conditions">
        <div>問題数 {amount}</div>
        <div>Level {difficultyMap[difficulty]}</div>
        <div>タイプ {getType}</div>
      </div>
    </>
  );
};

export default QuizResultView;
