import { createSlice } from "@reduxjs/toolkit";
import {
  addHistoryAsync,
  fetchHistoriesAsync,
  deleteHistoryAsync,
} from "./quizHistoryThunks";

export const quizHistoryInitialState = {
  canPost: true,
  isLoading: false,
  isDeleting: false,

  histories: [],
  error: null,
};

const quizHistorySlice = createSlice({
  name: "quizHistory",
  initialState: quizHistoryInitialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      //addHistory
      .addCase(addHistoryAsync.pending, (state) => {
        state.canPost = false;
      })
      .addCase(addHistoryAsync.fulfilled, (state, action) => {
        state.canPost = true;
        state.histories.push(action.payload);
        state.error = null;
      })

      //fetchHistories
      .addCase(fetchHistoriesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHistoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.histories = action.payload;
        state.error = null;
      })

      //deleteHistory

      .addCase(deleteHistoryAsync.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteHistoryAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.histories = state.histories.filter((his) => {
          return his.id !== action.payload.id;
        });
        state.error = null;
      })

      //rejected共通処理
      .addMatcher(
        (action) =>
          action.type.startsWith("quizHistory/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.canPost = true;
          state.isLoading = false;
          state.isDeleting = false;
          state.error = action.payload;
        },
      );
  },
});

export default quizHistorySlice.reducer;
