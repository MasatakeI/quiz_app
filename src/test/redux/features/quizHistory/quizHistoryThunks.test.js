import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  addHistoryAsync,
  fetchHistoriesAsync,
  deleteHistoryAsync,
} from "@/redux/features/quizHistory/quizHistoryThunks";
import {
  addHistory,
  deleteHistory,
  fetchHistories,
} from "@/models/QuizHistoryModel";

import {
  mockQuizHistories,
  mockNewQuizHistory,
} from "@/test/fixtures/historyFixture";
// import { QuizHistoryError } from "@/models/errors/quizHistory/quizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@/models/QuizHistoryModel", () => ({
  addHistory: vi.fn(),
  fetchHistories: vi.fn(),
  deleteHistory: vi.fn(),
}));

//ヘルパー
const dispatch = vi.fn();
const getState = vi.fn();

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const mockSuccess = (mockFn, value) => mockFn.mockResolvedValue(value);
// const mockError = (mockFn, error) => mockFn.mockRejectedValue(error);

const SUCCESS_CASES = [
  {
    title: "addHistoryAsync",
    condition: { canPost: true },
    mockFn: addHistory,
    arg: mockNewQuizHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    expected: mockNewQuizHistory,
    type: "quizHistory/addHistory/fulfilled",
    snackbarMessage: "クイズ結果の保存に成功しました",
  },
  {
    title: "fetchHistoriesAsync",
    condition: { isLoading: false },
    mockFn: fetchHistories,
    arg: undefined,
    thunk: fetchHistoriesAsync,
    params: undefined,
    expected: mockQuizHistories,
    type: "quizHistory/fetchHistories/fulfilled",
    snackbarMessage: undefined,
  },
  {
    title: "deleteHistoryAsync",
    condition: { isDeleting: false },
    mockFn: deleteHistory,
    arg: mockQuizHistories[0].id,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    expected: mockQuizHistories[0],
    type: "quizHistory/deleteHistory/fulfilled",
    snackbarMessage: "クイズ結果の削除に成功しました",
  },
];

const FAILED_MODEL_FUNCTION_CASE = [
  {
    title: "addHistoryAsync",
    condition: { canPost: true },
    mockFn: addHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    type: "quizHistory/addHistory/rejected",
  },
  {
    title: "fetchHistoriesAsync",
    condition: { isLoading: false },

    mockFn: fetchHistories,
    thunk: fetchHistoriesAsync,
    params: undefined,
    type: "quizHistory/fetchHistories/rejected",
  },
  {
    title: "deleteHistoryAsync",
    condition: { isDeleting: false },

    mockFn: deleteHistory,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    type: "quizHistory/deleteHistory/rejected",
  },
];
const FAILED_OPTIONS_CASE = [
  {
    title: "addHistoryAsync",
    mockFn: addHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    condition: { canPost: false },
  },
  {
    title: "fetchHistoriesAsync",
    mockFn: fetchHistories,
    thunk: fetchHistoriesAsync,
    params: undefined,
    condition: { isLoading: true },
  },
  {
    title: "deleteHistoryAsync",
    mockFn: deleteHistory,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    condition: { isDeleting: true },
  },
];

describe("quizHistoryThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系共通処理", () => {
    test.each(SUCCESS_CASES)(
      "$title",
      async ({
        condition,
        mockFn,
        arg,
        thunk,
        params,
        expected,
        type,
        snackbarMessage,
      }) => {
        getState.mockReturnValue({
          quizHistory: condition,
        });

        mockSuccess(mockFn, expected);
        const result = await callThunk(thunk, params);
        expect(result.payload).toEqual(expected);
        expect(result.type).toBe(type);

        if (arg === undefined) {
          expect(mockFn).toHaveBeenCalledTimes(1);
        } else {
          expect(mockFn).toHaveBeenCalledWith(arg);
        }

        if (snackbarMessage) {
          expect(dispatch).toHaveBeenCalledWith(showSnackbar(snackbarMessage));
        } else {
          expect(dispatch).not.toHaveBeenCalledWith(
            showSnackbar(expect.anything()),
          );
        }
      },
    );
  });

  describe("異常系共通処理:mockFnが失敗したとき rejected状態になる", () => {
    test.each(FAILED_MODEL_FUNCTION_CASE)(
      "$title",
      async ({ condition, mockFn, thunk, params, type }) => {
        getState.mockReturnValue({
          quizHistory: condition,
        });

        const error = {
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワークエラーが発生しました",
        };
        mockFn.mockRejectedValue(error);

        const result = await callThunk(thunk, params);
        expect(result.payload).toMatchObject({
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワークエラーが発生しました",
          field: undefined,
        });

        expect(result.type).toBe(type);
      },
    );
  });
  describe("異常系共通処理:condition=falseの時 処理を実行しない", () => {
    test.each(FAILED_OPTIONS_CASE)(
      "$title",
      async ({ mockFn, thunk, params, condition }) => {
        getState.mockReturnValue({
          quizHistory: condition,
        });

        const result = await callThunk(thunk, params);

        expect(mockFn).not.toHaveBeenCalled();
        expect(result.meta.condition).toBe(true);
      },
    );
  });
});
