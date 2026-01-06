// src/redux/features/quizContent/quizContentSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createQuizzes } from "../../../models/QuizModel";

export const fetchQuizzesAsync = createAsyncThunk(
  "quizContent/fetchQuizzes",
  async ({ category, type, difficulty, amount }, { rejectWithValue }) => {
    try {
      const quizzes = await createQuizzes(category, type, difficulty, amount);
      return quizzes;
    } catch (error) {
      return rejectWithValue("fetch失敗(Thunk)");
    }
  }
);

export const contentInitialState = {
  isLoading: false,
  quizzes: [],
  fetchError: null,
};

const quizContentSlice = createSlice({
  name: "quizContent",
  initialState: contentInitialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesAsync.pending, (state, action) => {
        state.isLoading = true;
        state.quizzes = [];
        state.fetchError = null;
      })
      .addCase(fetchQuizzesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
        state.fetchError = null;
      })
      .addCase(fetchQuizzesAsync.rejected, (state, action) => {
        state.isLoading = false;

        state.fetchError = action.payload ?? "不明なエラー";
      });
  },
});

export const selectQuizContent = (state) => state.quizContent;

export const selectIsLoading = (state) => state.quizContent.isLoading;
export const selectAllQuizzes = (state) => state.quizContent.quizzes;
export const selectFetchError = (state) => state.quizContent.fetchError;

export default quizContentSlice.reducer;
