//quizProgressSlice.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import quizProgressReducer, {
  progressInitialState,
  goToNextQuiz,
  submitAnswer,
} from "../../../../redux/features/quizProgress/quizProgressSlice";

import { decodedQuizList } from "../../../fixtures/QuizFixture";
import { fetchQuizzesAsync } from "../../../../redux/features/quizContent/quizContentSlice";

const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

describe("quizProgressSlice.jsのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("初期stateの確認", () => {
    expect(progressInitialState).toEqual({
      currentIndex: 0,
      numberOfCorrects: 0,
      numberOfIncorrects: 0,
      userAnswers: [],
    });
  });

  describe("reducers", () => {
    describe("goToNextQuiz", () => {
      test("currentIndexを1進める", () => {
        const action = goToNextQuiz();
        const state = quizProgressReducer(progressInitialState, action);
        expect(state.currentIndex).toBe(1);
      });
    });

    describe("submitAnswer", () => {
      const currentQuiz = decodedQuizList[0];
      const allAnswers = [
        currentQuiz.correctAnswer,
        ...currentQuiz.incorrectAnswers,
      ];
      test("ユーザーの回答を記録する:正解の場合", () => {
        const selectedAnswer = currentQuiz.correctAnswer;

        const action = submitAnswer({
          currentQuiz,
          selectedAnswer,
          allAnswers,
        });
        const state = quizProgressReducer(progressInitialState, action);

        expect(state).toEqual({
          currentIndex: 0,
          numberOfCorrects: 1,
          numberOfIncorrects: 0,
          userAnswers: [
            {
              question: currentQuiz.question,
              correctAnswer: currentQuiz.correctAnswer,
              selectedAnswer,
              isCorrect: true,
              allAnswers,
            },
          ],
        });
      });
      test("ユーザーの回答を記録する:誤答の場合", () => {
        const selectedAnswer = currentQuiz.incorrectAnswers[0];

        const action = submitAnswer({
          currentQuiz,
          selectedAnswer,
          allAnswers,
        });
        const state = quizProgressReducer(progressInitialState, action);

        expect(state).toEqual({
          currentIndex: 0,
          numberOfCorrects: 0,
          numberOfIncorrects: 1,
          userAnswers: [
            {
              question: currentQuiz.question,
              correctAnswer: currentQuiz.correctAnswer,
              selectedAnswer,
              isCorrect: false,
              allAnswers,
            },
          ],
        });
      });
    });
  });

  describe("extraReducers", () => {
    describe("fetchQuizzesAsync.fulfilledの時", () => {
      test("stateの値をリセットする", () => {
        const prev = {
          currentIndex: 2,
          numberOfCorrects: 2,
          numberOfIncorrects: 1,
          userAnswers: [],
        };
        const fulfilled = applyFulfilled(
          quizProgressReducer,
          fetchQuizzesAsync,
          decodedQuizList,
          prev
        );

        expect(fulfilled).toEqual(progressInitialState);
      });
    });
  });
});
