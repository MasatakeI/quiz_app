import { combineReducers } from "redux";

import quizContentReducer from "../features/quizContent/quizContentSlice";
import quizProgressReducer from "../features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "../features/quizSettings/quizSettingsSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";

export const rootReducer = combineReducers({
  quizContent: quizContentReducer,
  quizProgress: quizProgressReducer,
  quizSettings: quizSettingsReducer,
  snackbar: snackbarReducer,
});
