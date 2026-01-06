import React from "react";
import "./QuizAnswers.css";
import Button from "../../common/Button/Button";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const QuizAnswers = ({ shuffledAnswers, onSelect, canPost, indexMap }) => {
  const answers = shuffledAnswers.map((answer, index) => {
    return (
      <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index} className="answer">
        <Button
          variant="secondary"
          onClickHandler={() => onSelect(answer)}
          clickable={canPost}
        >
          {indexMap[index]}. {answer}
        </Button>
      </Grid>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className="quiz-answer-list">
        {answers}
      </Grid>
    </Box>
  );
};

export default QuizAnswers;
