// src/redux/selectors/quizProgress/quizProgressSelector.js

import { createSelector } from "@reduxjs/toolkit";
import { selectAllQuizzes } from "../../features/quizContent/quizContentSlice";
import {
  shuffleAnswers,
  translateCurrentDifficulty,
} from "../../../models/QuizModel";

export const selectCurrentIndex = (state) => state.quizProgress.currentIndex;
export const selectNumberOfCorrects = (state) =>
  state.quizProgress.numberOfCorrects;
export const selectNumberOfIncorrects = (state) =>
  state.quizProgress.numberOfIncorrects;
export const selectUserAnswers = (state) => state.quizProgress.userAnswers;

export const selectCurrentQuiz = createSelector(
  [selectAllQuizzes, selectCurrentIndex],
  (quizzes, currentIndex) => {
    return quizzes[currentIndex];
  }
);

export const selectShuffledAnswers = createSelector(
  [selectCurrentQuiz],
  (currentQuiz) => {
    if (!currentQuiz) {
      return [];
    }

    return shuffleAnswers(currentQuiz);
  }
);
export const selectTransilateCurrentDifficulty = createSelector(
  [selectCurrentQuiz],
  (currentQuiz) => {
    if (!currentQuiz) {
      return "";
    }

    return translateCurrentDifficulty(currentQuiz);
  }
);

export const selectQuizFinished = createSelector(
  [selectAllQuizzes, selectCurrentIndex],
  (quizzes, currentIndex) => {
    return quizzes.length > 0 && currentIndex >= quizzes.length;
  }
);
