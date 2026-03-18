import React, { useEffect } from "react";

import QuizHistory from "@/components/widgets/QuizHistory/QuizHistory";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHistoryError,
  selectHistoryIsLoading,
} from "@/redux/features/quizHistory/quizHistorySelector";
import { fetchHistoriesAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/common/Button/Button";
import { selectUser } from "@/redux/features/auth/authSelector";
import AuthForm from "@/components/widgets/AuthForm/AuthForm";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectHistoryIsLoading);
  const error = useSelector(selectHistoryError);
  const user = useSelector(selectUser);

  const userId = user?.uid;

  useEffect(() => {
    if (user && user.uid) {
      // 引数なしで呼ぶ（Thunk側で最新のstateからuidを取るため）
      dispatch(fetchHistoriesAsync());
    }
  }, [dispatch, user]); // userId ではなく user オブジェクト全体を監視

  if (!userId) {
    return (
      <>
        <p>履歴を見るにはログインしてください。</p>
      </>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <Button onClickHandler={() => dispatch(fetchHistoriesAsync())}>
          履歴再読み込み
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <QuizHistory />;
};

export default HistoryPage;
