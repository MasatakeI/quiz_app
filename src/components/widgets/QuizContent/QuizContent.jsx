// src/components/widgets/QuizContent/QuizContent

import React from "react";
import "./QuizContent.css";

import { useQuizContent } from "./useQuizContent";

import BackToHomeLink from "../../common/BackToHomeLink/BackToHomeLink";
import QuizAnswerAlert from "./QuizAnswerAlert";
import QuizAnswers from "./QuizAnswers";
import QuizContentView from "./QuizContentView";

const QuizContent = () => {
  const {
    selectAnswer,
    handleNext,
    handleReload,
    answerMessage,
    canPost,
    answers,
    currentDifficulty,
    currentIndex,
    currentQuiz,
    numberOfCorrects,
    numberOfIncorrects,
    type,

    amount,
    title,
    getType,
    indexMap,
  } = useQuizContent();

  return (
    <div className="quiz-content">
      <QuizContentView
        title={title}
        getType={getType}
        currentQuiz={currentQuiz}
        currentDifficulty={currentDifficulty}
        type={type}
        amount={amount}
        currentIndex={currentIndex}
        numberOfCorrects={numberOfCorrects}
        numberOfIncorrects={numberOfIncorrects}
        onReload={handleReload}
      />

      <QuizAnswerAlert answerMessage={answerMessage} onNext={handleNext} />

      <QuizAnswers
        shuffledAnswers={answers}
        onSelect={selectAnswer}
        canPost={canPost}
        indexMap={indexMap}
      />

      <BackToHomeLink />
    </div>
  );
};

export default QuizContent;
