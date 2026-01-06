import React from "react";
import "./QuizLoading.css";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";

import {
  selectIsLoading,
  selectFetchError,
  fetchQuizzesAsync,
} from "../../../redux/features/quizContent/quizContentSlice";

import Button from "../../common/Button/Button";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import BackToHomeLink from "../../common/BackToHomeLink/BackToHomeLink";

const QuizLoading = () => {
  const dispatch = useDispatch();
  const { category } = useParams();

  const isLoading = useSelector(selectIsLoading);
  const fetchError = useSelector(selectFetchError);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return (
      <div>
        <p>{fetchError}</p>
        <Button
          onClickHandler={() =>
            dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }))
          }
        >
          再読み込み
        </Button>

        <BackToHomeLink />
      </div>
    );
  }

  return null;
};

export default QuizLoading;
