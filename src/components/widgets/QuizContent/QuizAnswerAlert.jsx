import React from "react";
import "./QuizAnswerAlert.css";
import Button from "../../common/Button/Button";
import AnswerAlert from "../../common/AnswerAlert/AnswerAlert";

const QuizAnswerAlert = ({ answerMessage, onNext }) => {
  return (
    <div className="answer-message-container">
      {answerMessage && (
        <>
          <AnswerAlert
            message={answerMessage}
            severity={answerMessage.includes("不正解...") ? "error" : "success"}
          />
          <Button variant="tertiary" onClickHandler={onNext}>
            次へ
          </Button>
        </>
      )}
    </div>
  );
};

export default QuizAnswerAlert;
