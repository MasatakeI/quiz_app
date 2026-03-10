import React from "react";

import "./QuizHistoryItem.css";
import Button from "@/components/common/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const QuizHistoryItem = ({
  historyDate,
  historyCategory,
  historyScore,
  historyTotalQuesitions,
  historyAccuracy,
  historyDifficulty,
  onDelete,
}) => {
  return (
    <div className="history-card">
      <div className="history-header">
        <span className="history-date">{historyDate}</span>
        <span className="history-category">{historyCategory}</span>
        <span className="history-difficulty">{historyDifficulty}</span>
        <button onClick={onDelete} className="history-delete-button">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div className="history-stats">
        <div className="history-stat-item">
          <span className="history-label">Score</span>
          <span className="history-value">
            {historyScore}/{historyTotalQuesitions}
          </span>
        </div>
        <div className="history-stat-item">
          <span className="history-label">Accuracy</span>
          <span className="history-value history-accuracy-highlight">
            {Math.round(historyAccuracy * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryItem;
