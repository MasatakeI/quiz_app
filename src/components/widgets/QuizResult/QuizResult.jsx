// src/components/widgets/QuizResult/QuizResult

import React from "react";

import { useQuizResult } from "./useQuizResult";

import ResultSummary from "./ResultSummary/ResultSummary";
import QuizResultView from "./QuizResultView";
import ResultButtonContainer from "./ResultButtonContainer";
import Button from "@/components/common/Button/Button";

const QuizResult = () => {
  const {
    quizTitle,
    userAnswers,
    numberOfCorrects,
    numberOfIncorrects,
    handleGoHome,
    handleRetry,
    navigate,
    amount,
    getType,
    getDifficulty,
    INDEX_MAP,
  } = useQuizResult();

  return (
    <div className="quiz-result">
      <QuizResultView
        quizTitle={quizTitle}
        numberOfCorrects={numberOfCorrects}
        numberOfIncorrects={numberOfIncorrects}
        amount={amount}
        currentDifficulty={getDifficulty}
        getType={getType}
      />

      <ResultButtonContainer onNavigate={handleGoHome} onRetry={handleRetry} />

      <ResultSummary userAnswers={userAnswers} indexMap={INDEX_MAP} />

      <Button
        onClickHandler={() => {
          navigate("/quiz/history");
        }}
      >
        記録を見る
      </Button>
    </div>
  );
};

export default QuizResult;
