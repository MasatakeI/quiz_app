//quizProgressSelector.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  selectCurrentQuiz,
  selectShuffledAnswers,
  selectTransilateCurrentDifficulty,
  selectQuizFinished,
} from "@/redux/features/quizProgress/quizProgressSelector";
import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";

import { decodedQuizList } from "../../../fixtures/quizFixture";
import { progressInitialState } from "../../../../redux/features/quizProgress/quizProgressSlice";
import { shuffleAnswers, translateCurrentDifficulty } from "@/models/QuizModel";

vi.mock("@/models/QuizModel", () => ({
  shuffleAnswers: vi.fn(() => ["A", "B", "C", "D"]),
  translateCurrentDifficulty: vi.fn(() => "かんたん"),
}));

describe("quizProgressSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  //複合セレクターのみtestする

  const prev = {
    quizContent: {
      ...contentInitialState,
      quizzes: decodedQuizList,
    },
    quizProgress: {
      ...progressInitialState,
      currentIndex: 1,
    },
  };

  describe("selectCurrentQuiz", () => {
    test("現在のクイズを返す", () => {
      const result = selectCurrentQuiz(prev);
      expect(result).toEqual({
        difficulty: "easy",
        question:
          "What is a fundamental element of the Gothic style of architecture?",
        correctAnswer: "pointed arch",
        incorrectAnswers: [
          "coffered ceilings",
          "façades surmounted by a pediment ",
          "internal frescoes",
        ],
      });
    });
  });

  describe("selectShuffledAnswers", () => {
    test("現在のクイズからシャッフルされた選択肢を返す", () => {
      const currentQuiz =
        prev.quizContent.quizzes[prev.quizProgress.currentIndex];

      const result = selectShuffledAnswers(prev);
      expect(shuffleAnswers).toHaveBeenCalledWith(currentQuiz);
      expect(result).toEqual(["A", "B", "C", "D"]);
    });

    test("currentQuizがない場合,空配列を返す", () => {
      const emptyQuizDataState = {
        quizContent: { ...prev.quizContent, quizzes: [] },
        quizProgress: { ...prev.quizProgress },
      };

      const result = selectShuffledAnswers(emptyQuizDataState);
      expect(result).toEqual([]);
    });
  });

  describe("selectTransilateCurrentDifficulty", () => {
    test("翻訳された現在のクイズの難易度を返す", () => {
      const result = selectTransilateCurrentDifficulty(prev);
      const currentQuiz =
        prev.quizContent.quizzes[prev.quizProgress.currentIndex];
      expect(result).toEqual("かんたん");
      expect(translateCurrentDifficulty).toHaveBeenCalledWith(currentQuiz);
    });

    test("currentQuizがない場合,空文字列を返す", () => {
      const emptyQuizDataState = {
        quizContent: { ...prev.quizContent, quizzes: [] },
        quizProgress: { ...prev.quizProgress },
      };

      const result = selectTransilateCurrentDifficulty(emptyQuizDataState);
      expect(result).toEqual("");
    });
  });

  describe("selectQuizFinished", () => {
    test("クイズが終了したかを返す:終了していない場合", () => {
      const result = selectQuizFinished(prev);
      expect(result).toBe(false);
    });
    test("クイズが終了したかを返す:終了してた場合", () => {
      const finishedState = {
        quizContent: { ...prev.quizContent },
        quizProgress: { ...prev.quizProgress, currentIndex: 3 },
      };
      const result = selectQuizFinished(finishedState);
      expect(result).toBe(true);
    });

    test("クイズが1問の場合の境界値:終了した場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 1 },
      };

      const result = selectQuizFinished(oneQuizState);
      expect(result).toBe(true);
    });
    test("クイズが1問の場合の境界値:終了していない場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 0 },
      };

      const result = selectQuizFinished(oneQuizState);
      expect(result).toBe(false);
    });
  });
});
