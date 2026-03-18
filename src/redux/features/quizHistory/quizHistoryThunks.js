import { showSnackbar } from "../snackbar/snackbarSlice";
import { createModelThunk } from "../utils/createModelThunk";

import {
  addHistory,
  fetchHistories,
  deleteHistory,
} from "@/models/QuizHistoryModel";
import { selectUser } from "../auth/authSelector";

export const addHistoryAsync = createModelThunk(
  "quizHistory/addHistory",
  async ({ resultData }, thunkApi) => {
    const state = thunkApi.getState();
    const user = selectUser(state);
    const userId = user.uid;

    const dataWithUser = {
      ...resultData,
      userId,
    };

    const history = await addHistory(userId, dataWithUser);

    thunkApi.dispatch(showSnackbar("クラウドに結果を保存しました"));
    return history;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory, auth } = getState();
      if (!quizHistory.canPost) return false;

      if (!auth.user) {
        return false;
      }
    },
  },
);

export const fetchHistoriesAsync = createModelThunk(
  "quizHistory/fetchHistories",
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const user = selectUser(state);
    const userId = user.uid;

    if (!userId) return [];

    const histories = await fetchHistories(userId);

    return histories;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory } = getState();
      if (quizHistory.isLoading) {
        return false;
      }
    },
  },
);

export const deleteHistoryAsync = createModelThunk(
  "quizHistory/deleteHistory",
  async ({ id }, thunkApi) => {
    const targetHistory = await deleteHistory(id);

    thunkApi.dispatch(showSnackbar(`クイズ結果の削除に成功しました`));
    return targetHistory;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory } = getState();
      if (quizHistory.isDeleting) {
        return false;
      }
    },
  },
);
