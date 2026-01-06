// src/models/QuizModel.js

import { fetchQuizzes } from "../data_fetcher/QuizFetcher";

import he from "he";
import _ from "lodash";

export const createFormatQuizData = (quizData) => {
  if (!quizData) {
    throw new Error("クイズデータがありません");
  }

  return {
    question: he.decode(quizData.question),
    correctAnswer: he.decode(quizData.correct_answer),
    incorrectAnswers: quizData.incorrect_answers.map((answer) =>
      he.decode(answer)
    ),
    difficulty: he.decode(quizData.difficulty),
  };
};

export const createFormattedQuizList = (quizDataList) => {
  if (!Array.isArray(quizDataList)) {
    throw new Error("quizDataListが配列ではありません");
  }
  return quizDataList.map(createFormatQuizData);
};

export const createQuizzes = async (category, type, difficulty, amount) => {
  try {
    const quizDataList = await fetchQuizzes(category, type, difficulty, amount);
    return createFormattedQuizList(quizDataList);
  } catch (error) {
    throw new Error("create失敗(Models)");
  }
};

export const judgeCorrectAnswer = (quiz, answer) => {
  if (!quiz) return false;
  return answer === quiz.correctAnswer;
};

export const shuffleAnswers = (quiz) => {
  if (!quiz || !Array.isArray(quiz.incorrectAnswers)) {
    return [];
  }
  return _.shuffle([quiz.correctAnswer, ...quiz.incorrectAnswers]);
};

export const translateCurrentDifficulty = (quiz) => {
  const difficultyMap = {
    easy: "かんたん",
    medium: "ふつう",
    hard: "むずかしい",
  };

  return difficultyMap[quiz.difficulty] ?? "不明";
};
