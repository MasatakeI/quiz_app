// src/redux/features/quizProgress/quizProgressSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { judgeCorrectAnswer } from "../../../models/QuizModel";
import { fetchQuizzesAsync } from "../quizContent/quizContentThunks";

export const progressInitialState = {
  currentIndex: 0,
  numberOfCorrects: 0,
  numberOfIncorrects: 0,
  userAnswers: [],
};

const quizProgressSlice = createSlice({
  name: "quizProgress",
  initialState: progressInitialState,

  reducers: {
    goToNextQuiz: (state) => {
      state.currentIndex += 1;
    },

    submitAnswer: (state, action) => {
      const { currentQuiz, selectedAnswer, allAnswers } = action.payload;

      const isCorrect = judgeCorrectAnswer(currentQuiz, selectedAnswer);

      if (isCorrect) {
        state.numberOfCorrects += 1;
      } else {
        state.numberOfIncorrects += 1;
      }

      state.userAnswers.push({
        question: currentQuiz.question,
        correctAnswer: currentQuiz.correctAnswer,
        selectedAnswer,
        allAnswers,
        isCorrect,
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchQuizzesAsync.fulfilled, (state, action) => {
      state.currentIndex = 0;
      state.numberOfCorrects = 0;
      state.numberOfIncorrects = 0;
      state.userAnswers = [];
    });
  },
});

export const { goToNextQuiz, submitAnswer } = quizProgressSlice.actions;

export default quizProgressSlice.reducer;
