import React from "react";
import HomePage from "./components/page/HomePage/HomePage";
import QuizPage from "./components/page/QuizPage/QuizPage";
import HistoryPage from "./components/page/HistoryPage/HistoryPage";

import { Routes, Route, Navigate } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz/:category" element={<QuizPage />} />
      <Route path="/quiz/history" element={<HistoryPage />} />
    </Routes>
  );
};

export default AppRoutes;
