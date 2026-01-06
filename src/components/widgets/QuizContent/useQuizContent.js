//useQuizContent.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzesAsync } from "../../../redux/features/quizContent/quizContentSlice";

import {
  goToNextQuiz,
  submitAnswer,
} from "../../../redux/features/quizProgress/quizProgressSlice";
import { judgeCorrectAnswer } from "../../../models/QuizModel";

import {
  selectShuffledAnswers,
  selectTransilateCurrentDifficulty,
  selectCurrentIndex,
  selectNumberOfCorrects,
  selectNumberOfIncorrects,
  selectCurrentQuiz,
} from "../../../redux/selectors/quizProgress/quizProgressSelector";

import { useParams, useSearchParams } from "react-router";
import { getQuizTitle } from "../../../constants/quizCategories";

export const useQuizContent = () => {
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const { category } = useParams();
  const type = params.get("type");
  const amount = params.get("amount");
  const difficulty = params.get("difficulty");

  const currentQuiz = useSelector(selectCurrentQuiz);

  const shuffledAnswers = useSelector(selectShuffledAnswers);
  const currentDifficulty = useSelector(selectTransilateCurrentDifficulty);

  const currentIndex = useSelector(selectCurrentIndex);
  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const numberOfIncorrects = useSelector(selectNumberOfIncorrects);

  const [answerMessage, setAnswerMessage] = useState(null);
  const [canPost, setCanPost] = useState(true);

  const title = getQuizTitle(category);

  const typeMap = {
    boolean: "2択",
    multiple: "4択",
  };

  const getType = typeMap[type];

  const indexMap = ["A", "B", "C", "D"];

  const answers = type === "multiple" ? shuffledAnswers : ["True", "False"];

  const handleReload = () => {
    dispatch(
      fetchQuizzesAsync({
        category,
        difficulty,
        amount,
        type,
      })
    );
  };

  const selectAnswer = (answer) => {
    if (!canPost) return;
    setCanPost(false);
    const isCorrect = judgeCorrectAnswer(currentQuiz, answer);

    if (isCorrect) {
      setAnswerMessage(`正解! ${currentQuiz.correctAnswer}`);
    } else {
      setAnswerMessage(
        `不正解... 選択:${answer}  正解:${currentQuiz.correctAnswer}`
      );
    }

    const allAnswers = [
      currentQuiz.correctAnswer,
      ...currentQuiz.incorrectAnswers,
    ];

    dispatch(submitAnswer({ currentQuiz, selectedAnswer: answer, allAnswers }));
  };

  const handleNext = () => {
    dispatch(goToNextQuiz());
    setCanPost(true);
    setAnswerMessage(null);
  };

  return {
    handleNext,
    selectAnswer,
    handleReload,
    answerMessage,
    canPost,
    currentQuiz,

    answers,
    currentDifficulty,
    currentIndex,
    numberOfCorrects,
    numberOfIncorrects,
    type,
    amount,

    title,
    getType,
    indexMap,
  };
};
