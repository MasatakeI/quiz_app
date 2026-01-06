// src/redux/features/quizSettings/quizSettingsSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const settingsInitialState = {
  category: "",
  type: "",
  difficulty: "",
  amount: "",
};

const quizSettingsSlice = createSlice({
  name: "quizSettings",
  initialState: settingsInitialState,

  reducers: {
    setQuizSettings: (state, action) => {
      return { ...state, ...action.payload };
    },

    resetQuizSettings: (state, action) => {
      return settingsInitialState;
    },

    updateSettings: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const selectQuizSettings = (state) => state.quizSettings;

export const selectSettingsCategory = (state) => state.quizSettings.category;
export const selectSettingsType = (state) => state.quizSettings.type;
export const selectSettingsDifficulty = (state) =>
  state.quizSettings.difficulty;
export const selectSettingsAmount = (state) => state.quizSettings.amount;

export const { setQuizSettings, resetQuizSettings, updateSettings } =
  quizSettingsSlice.actions;

export default quizSettingsSlice.reducer;
