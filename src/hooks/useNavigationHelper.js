// src/hooks/useNavigationHelper.js

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { resetQuizContent } from "@/redux/features/quizContent/quizContentSlice";
import { resetQuizSettings } from "@/redux/features/quizSettings/quizSettingsSlice";

export const useNavigationHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoHome = () => {
    dispatch(resetQuizSettings());
    dispatch(resetQuizContent());
    navigate("/");
  };

  return { handleGoHome };
};
