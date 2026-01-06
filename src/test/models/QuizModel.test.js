//QuizModel.test.js

import { vi, describe, test, expect, beforeEach } from "vitest";

import {
  createFormatQuizData,
  createFormattedQuizList,
  createQuizzes,
  judgeCorrectAnswer,
  shuffleAnswers,
  translateCurrentDifficulty,
  getQuizTitle,
} from "../../models/QuizModel";

import { undecodedQuizList, decodedQuizList } from "../fixtures/quizFixture";
import { fetchQuizzes } from "../../data_fetcher/QuizFetcher";

vi.mock("../../data_fetcher/QuizFetcher");

describe("QuizModel.jsのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createFormatQuizData", () => {
    test("成功ケース:HTMLエンティティをデコードし整形されたオブジェクトを返す", () => {
      const quizData = undecodedQuizList[0];

      const result = createFormatQuizData(quizData);
      expect(result).toEqual(decodedQuizList[0]);
    });

    test("失敗ケース:quizDataがない場合エラーをスローする", () => {
      expect(() => createFormatQuizData()).toThrow("クイズデータがありません");
    });
  });

  describe("createFormattedQuizList", () => {
    test("成功ケース", () => {
      const result = createFormattedQuizList(undecodedQuizList);
      expect(result).toEqual(decodedQuizList);
    });

    test("失敗ケース:quizDataListがない場合エラーをスローする", () => {
      expect(() => createFormattedQuizList()).toThrow(
        "quizDataListが配列ではありません"
      );
    });
  });

  describe("createQuizzes", () => {
    const category = "sports";
    const type = "multiple";
    const difficulty = "easy";
    const amount = 10;
    test("クイズデータを取得し,フォーマットされたクイズリストを返す", async () => {
      fetchQuizzes.mockResolvedValue(undecodedQuizList);
      const result = await createQuizzes(category, type, difficulty, amount);
      expect(result).toEqual(decodedQuizList);

      expect(fetchQuizzes).toHaveBeenCalledWith(
        category,
        type,
        difficulty,
        amount
      );
    });

    test("fetch失敗時,エラーをスローする", async () => {
      fetchQuizzes.mockRejectedValue(new Error("ANY"));
      await expect(
        createQuizzes(category, type, difficulty, amount)
      ).rejects.toThrow("create失敗(Models)");
    });
  });

  describe("judgeCorrectAnswer", () => {
    test("ユーザーの回答の正誤判定をする:正解の場合", () => {
      const quiz = decodedQuizList[0];
      const answer = quiz.correctAnswer;
      const result = judgeCorrectAnswer(quiz, answer);
      expect(result).toBe(true);
    });
    test("ユーザーの回答の正誤判定をする:失敗の場合", () => {
      const quiz = decodedQuizList[0];
      const answer = quiz.incorrectAnswers[0];
      const result = judgeCorrectAnswer(quiz, answer);
      expect(result).toBe(false);
    });

    test("クイズがない場合:falseを返す", () => {
      expect(judgeCorrectAnswer(null, "assss")).toBe(false);
    });
  });

  describe("shuffleAnswers", () => {
    test("回答の選択肢をシャッフルする", () => {
      const quiz = decodedQuizList[0];
      const result = shuffleAnswers(quiz);
      const allAnswers = [quiz.correctAnswer, ...quiz.incorrectAnswers];

      expect(result.length).toEqual(allAnswers.length);
      expect(result).toEqual(expect.arrayContaining(allAnswers));
      expect(result).toEqual(expect.arrayContaining(allAnswers));
      expect(allAnswers).toEqual(expect.arrayContaining(result));
    });

    test("失敗:クイズがない場合,incorrectAnswersが配列でない場合,から配列を返す", () => {
      expect(shuffleAnswers()).toEqual([]);
      const brokenQuizData = {
        difficulty: "easy",

        question:
          "In Star Wars, what's the name of the new Government created after the defeat of the Galactic Empire?",
        correctAnswer: "The New Republic",
        incorrectAnswers: "The Rebel Alliance",
      };

      expect(shuffleAnswers(brokenQuizData)).toEqual([]);
    });
  });

  describe("translateCurrentDifficulty", () => {
    test.each([
      ["easy", "かんたん"],
      ["medium", "ふつう"],
      ["hard", "むずかしい"],
    ])("%sの時%sを返す", (difficulty, expected) => {
      const quiz = { difficulty };
      expect(translateCurrentDifficulty(quiz)).toBe(expected);
    });

    test("失敗:難易度が不明の場合,不明と返す", () => {
      expect(translateCurrentDifficulty({ difficulty: "@@@" })).toBe("不明");
    });
  });
});
