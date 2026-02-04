//useQuizResult.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  selectNumberOfCorrects,
  selectTransilateCurrentDifficulty,
  selectUserAnswers,
} from "@/redux/features/quizProgress/quizProgressSelector";

import { getQuizTitle } from "../../../constants/quizCategories";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

export const useQuizResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const userAnswers = useSelector(selectUserAnswers);
  const currentDifficulty = useSelector(selectTransilateCurrentDifficulty);

  const quizTitle = getQuizTitle(category);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  const indexMap = ["A", "B", "C", "D"];
  const difficultyMap = {
    easy: "かんたん",
    medium: "ふつう",
    hard: "むずかしい",
  };

  const typeMap = {
    boolean: "2択",
    multiple: "4択",
  };

  const getType = typeMap[type];

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = async () => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  };

  return {
    quizTitle,
    currentDifficulty,
    userAnswers,
    numberOfCorrects,
    handleGoHome,
    handleRetry,
    amount,
    type,
    difficulty,
    userAnswers,
    indexMap,
    difficultyMap,
    getType,
  };
};
