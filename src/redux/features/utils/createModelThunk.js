import { createAsyncThunk } from "@reduxjs/toolkit";
import { QuizError } from "../../../models/errors/QuizError";

export const createModelThunk = (type, fn, options) =>
  createAsyncThunk(
    type,
    async (arg, thunkApi) => {
      try {
        return await fn(arg, thunkApi);
      } catch (error) {
        if (error instanceof QuizError) {
          return thunkApi.rejectWithValue({
            code: error.code,
            message: error.message,
            field: error.field,
          });
        }
        return thunkApi.rejectWithValue({
          code: "UNKNOWN",
          message: "予期せぬエラーが発生しました",
        });
      }
    },
    options,
  );
