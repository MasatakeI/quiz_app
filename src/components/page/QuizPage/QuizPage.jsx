// page/QuizPage/QuizPage.jsx

import React, { useEffect } from "react";
import "./QuizPage.css";

import QuizLoading from "@/components/widgets/QuizLoading/QuizLoading";
import QuizContent from "@/components/widgets/QuizContent/QuizContent";
import QuizResult from "@/components/widgets/QuizResult/QuizResult";

import { useDispatch, useSelector } from "react-redux";

import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";
import {
  selectFetchError,
  selectIsLoading,
} from "@/redux/features/quizContent/quizContentSelector";
import { selectQuizFinished } from "@/redux/features/quizProgress/quizProgressSelector";
import { useParams, useSearchParams } from "react-router";

const QuizPage = () => {
  const dispatch = useDispatch();

  const { category } = useParams();
  const isLoading = useSelector(selectIsLoading);
  const fetchError = useSelector(selectFetchError);

  const quizFinished = useSelector(selectQuizFinished);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  useEffect(() => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  }, [dispatch, category, type, difficulty, amount]);

  if (isLoading || fetchError) {
    return <QuizLoading />;
  }

  if (quizFinished) {
    return <QuizResult />;
  }

  return <QuizContent />;
};

export default QuizPage;
