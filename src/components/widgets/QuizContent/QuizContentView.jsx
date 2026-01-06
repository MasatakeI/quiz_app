import React from "react";
import "./QuizContentView.css";
import QuizEmptyState from "./QuizEmptyState";

const QuizContentView = ({
  amount,
  currentDifficulty,
  currentIndex,
  currentQuiz,
  numberOfCorrects,
  numberOfIncorrects,
  onReload,
  title,
  getType,
}) => {
  if (!currentQuiz) {
    return <QuizEmptyState onReload={onReload} />;
  }

  return (
    <>
      <h1>{title}クイズ</h1>
      <div className="selected-conditions">
        <div>問題数 {amount}</div>
        <div>Level {currentDifficulty}</div>
        <div>タイプ {getType}</div>
      </div>
      <p className="quiz-question">
        Q{currentIndex + 1}. {currentQuiz.question}
      </p>

      <div className="quiz-progress-info">
        <div className="correct-wrap">
          正解数 <span className="correct-count">{numberOfCorrects}</span>
        </div>
        <div className="incorrect-wrap">
          誤答数 <span className="incorrect-count">{numberOfIncorrects}</span>
        </div>
      </div>
    </>
  );
};

export default QuizContentView;
