// page/QuizPage/QuizPage.jsx

import React, { useEffect } from "react";
import "./QuizPage.css";

import QuizLoading from "../../widgets/QuizLoadng/QuizLoading";
import QuizContent from "../../widgets/QuizContent/QuizContent";
import QuizResult from "../../widgets/QuizResult/QuizResult";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizzesAsync,
  selectIsLoading,
} from "../../../redux/features/quizContent/quizContentSlice";
import { selectQuizFinished } from "../../../redux/selectors/quizProgress/quizProgressSelector";
import { useParams, useSearchParams } from "react-router";

const QuizPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const isLoading = useSelector(selectIsLoading);

  const quizFinished = useSelector(selectQuizFinished);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  useEffect(() => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  }, [dispatch, category]);

  if (isLoading) {
    return <QuizLoading />;
  }

  if (quizFinished) {
    return <QuizResult />;
  }

  return <QuizContent />;
};

export default QuizPage;
