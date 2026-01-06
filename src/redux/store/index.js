// src/redux/store/index.js

import { configureStore } from "@reduxjs/toolkit";

import quizContentReducer from "../features/quizContent/quizContentSlice";
import quizProgressReducer from "../features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "../features/quizSettings/quizSettingsSlice";

const store = configureStore({
  reducer: {
    quizContent: quizContentReducer,
    quizProgress: quizProgressReducer,
    quizSettings: quizSettingsReducer,
  },
});

export default store;
