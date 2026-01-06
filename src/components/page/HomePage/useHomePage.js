//useHomePage.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAmounts, getCategories, getDifficulties, types } from "./constants";
import {
  selectSettingsAmount,
  selectSettingsCategory,
  selectSettingsDifficulty,
  selectSettingsType,
  setQuizSettings,
  updateSettings,
} from "../../../redux/features/quizSettings/quizSettingsSlice";
import { useMemo, useState } from "react";
import { validateQuizSettings } from "./validation";

export const useHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const type = useSelector(selectSettingsType);
  const categories = getCategories();

  const difficulties = getDifficulties(type);

  const amounts = getAmounts(type);
  const difficulty = useSelector(selectSettingsDifficulty);
  const category = useSelector(selectSettingsCategory);
  const amount = useSelector(selectSettingsAmount);

  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const items = useMemo(
    () => [
      {
        label: "ジャンル",
        value: category,
        onChange: (v) =>
          dispatch(updateSettings({ key: "category", value: v })),
        array: categories,
      },
      {
        label: "タイプ",
        value: type,
        onChange: (v) => {
          dispatch(updateSettings({ key: "type", value: v }));
          dispatch(
            updateSettings({ key: "amount", value: v === "boolean" ? 5 : 10 })
          );
        },
        array: types,
      },
      {
        label: "レベル",
        value: difficulty,
        onChange: (v) =>
          dispatch(updateSettings({ key: "difficulty", value: v })),
        array: difficulties,
      },
      {
        label: "問題数",
        value: amount,
        onChange: (v) => dispatch(updateSettings({ key: "amount", value: v })),
        array: amounts,
        disabled: type === "boolean",
      },
    ],
    [dispatch, category, type, difficulty, amount]
  );

  const handleStart = () => {
    setErrorMessage("");
    const finalAmount = type === "boolean" ? 5 : amount;

    const error = validateQuizSettings(category, type, difficulty, amount);

    if (error) {
      setErrorMessage(error);
      setSnackbarOpen(true);
      return;
    }

    dispatch(
      setQuizSettings({
        category,
        type,
        difficulty,
        amount,
      })
    );

    navigate(
      `/quiz/${category}?type=${type}&difficulty=${difficulty}&amount=${finalAmount}`
    );
  };

  return {
    items,
    handleStart,
    errorMessage,
    snackbarOpen,
    closeSnackbar: () => setSnackbarOpen(false),
  };
};
