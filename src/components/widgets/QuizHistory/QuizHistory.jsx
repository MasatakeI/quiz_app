//src/components/widgets/QuizHistory/QuizHistory.jsx

import React from "react";
import "./QuizHistory.css";
import QuizHistoryItem from "./QuizHistoryItem";

import { useDispatch, useSelector } from "react-redux";
import { selectAllHistories } from "@/redux/features/quizHistory/quizHistorySelector";
import { deleteHistoryAsync } from "@/redux/features/quizHistory/quizHistoryThunks";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Button from "@/components/common/Button/Button";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const QuizHistory = () => {
  const dispatch = useDispatch();

  const histories = useSelector(selectAllHistories);

  const { handleGoHome } = useNavigationHelper();

  return (
    <div>
      <h1 className="title">クイズの記録</h1>
      <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
      <Box sx={{ flexGrow: 1 }} className="history-container">
        <Grid container spacing={2}>
          {histories.map((his) => {
            return (
              <Grid
                key={his.id}
                className="history-list"
                size={{ xs: 12, md: 6 }}
              >
                <QuizHistoryItem
                  historyDate={his.date}
                  historyCategory={his.category}
                  historyScore={his.score}
                  historyTotalQuesitions={his.totalQuestions}
                  historyAccuracy={his.accuracy}
                  historyDifficulty={his.difficulty}
                  onDelete={() => dispatch(deleteHistoryAsync({ id: his.id }))}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
    </div>
  );
};

export default QuizHistory;
