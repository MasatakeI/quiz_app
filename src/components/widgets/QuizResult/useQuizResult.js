//useQuizResult.js

import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";

import {
  selectNumberOfCorrects,
  selectNumberOfIncorrects,
  selectTransilateCurrentDifficulty,
  selectUserAnswers,
} from "@/redux/features/quizProgress/quizProgressSelector";

import { getQuizTitle } from "../../../constants/quizCategories";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

export const useQuizResult = () => {
  const dispatch = useDispatch();

  const { category } = useParams();
  const { handleGoHome } = useNavigationHelper();

  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const numberOfIncorrects = useSelector(selectNumberOfIncorrects);
  const userAnswers = useSelector(selectUserAnswers);

  const quizTitle = getQuizTitle(category);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  const indexMap = ["A", "B", "C", "D"];
  const typeMap = {
    boolean: "2択",
    multiple: "4択",
  };
  const getType = typeMap[type] || "不明";

  const difficultyMap = {
    easy: "かんたん",
    medium: "ふつう",
    hard: "むずかしい",
  };

  const getDifficulty = difficultyMap[difficulty] || "不明";

  const handleRetry = async () => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  };

  return {
    quizTitle,

    userAnswers,
    numberOfCorrects,
    numberOfIncorrects,
    handleGoHome,
    handleRetry,
    amount,
    type,
    difficulty,
    userAnswers,
    indexMap,
    getType,
    getDifficulty,
  };
};
