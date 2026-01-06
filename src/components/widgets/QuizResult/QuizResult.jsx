// src/components/widgets/QuizResult/QuizResult

import React from "react";
import "./QuizResult.css";

import { useQuizResult } from "./useQuizResult";

import ResultSummary from "./ResultSummary/ResultSummary";
import QuizResultView from "./QuizResultView";
import ResultButtonContainer from "./ResultButtonContainer";

const QuizResult = () => {
  const {
    quizTitle,
    numberOfCorrects,
    currentDifficulty,
    handleGoHome,
    handleRetry,
    amount,
    difficulty,
    type,
    userAnswers,
    indexMap,
    difficultyMap,
    getType,
  } = useQuizResult();

  return (
    <div className="quiz-result">
      <QuizResultView
        quizTitle={quizTitle}
        numberOfCorrects={numberOfCorrects}
        amount={amount}
        difficulty={difficulty}
        difficultyMap={difficultyMap}
        getType={getType}
      />

      <ResultButtonContainer onNavigate={handleGoHome} onRetry={handleRetry} />

      <ResultSummary userAnswers={userAnswers} indexMap={indexMap} />

      <ResultButtonContainer onNavigate={handleGoHome} onRetry={handleRetry} />
    </div>
  );
};

export default QuizResult;
