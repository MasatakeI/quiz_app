import React from "react";
import "./QuizLoading.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  selectIsLoading,
  selectFetchError,
} from "@/redux/features/quizContent/quizContentSelector";

import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";
import { resetProgress } from "@/redux/features/quizProgress/quizProgressSlice";

import Button from "../../common/Button/Button";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";

const QuizLoading = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div className="quiz-loading">
        <p>{fetchError.message}</p>

        <div className="quiz-loading-button-container">
          <Button
            onClickHandler={() =>
              dispatch(
                fetchQuizzesAsync({ category, type, difficulty, amount }),
              )
            }
          >
            再読み込み
          </Button>
          <Button
            onClickHandler={() => {
              dispatch(resetProgress());
              navigate("/");
            }}
          >
            ホームへ戻る
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizLoading;
