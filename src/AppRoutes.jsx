import React from "react";
import HomePage from "./components/page/HomePage/HomePage";
import QuizPage from "./components/page/QuizPage/QuizPage";
import { Routes, Route, Navigate } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz/:category" element={<QuizPage />} />
    </Routes>
  );
};

export default AppRoutes;
