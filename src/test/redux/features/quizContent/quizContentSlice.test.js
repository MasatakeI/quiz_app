import { describe, test, expect, vi, beforeEach } from "vitest";

import quizContentReducer, {
  fetchQuizzesAsync,
  contentInitialState,
} from "../../../../redux/features/quizContent/quizContentSlice";

import { decodedQuizList } from "../../../fixtures/quizFixture";

import { createQuizzes } from "../../../../models/QuizModel";

vi.mock("../../../../models/QuizModel", () => ({
  createQuizzes: vi.fn(),
}));

//ヘルパー関数
const dispatch = vi.fn();
const getState = vi.fn();
const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const applyPending = (slice, thunk, prev = contentInitialState) =>
  slice(prev, thunk.pending());
const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejectedWithError = (slice, thunk, error, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, error));

describe("quizContentSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const category = "sports";
  const type = "multiple";
  const difficulty = "easy";
  const amount = 10;

  describe("Thunk", () => {
    describe("fetchQuizzesAsync", () => {
      test("成功:取得したquizzesを返す", async () => {
        createQuizzes.mockResolvedValue(decodedQuizList);

        const result = await callThunk(fetchQuizzesAsync, {
          category,
          type,
          difficulty,
          amount,
        });
        expect(result.payload).toEqual(decodedQuizList);
        expect(createQuizzes).toHaveBeenCalledWith(
          category,
          type,
          difficulty,
          amount
        );
      });

      test("失敗:rejectWithValueのメッセージを返す", async () => {
        createQuizzes.mockRejectedValue(new Error("ANY"));

        const result = await callThunk(fetchQuizzesAsync, {
          category,
          type,
          difficulty,
          amount,
        });

        expect(result.payload).toBe("fetch失敗(Thunk)");
      });
    });
  });

  describe("extraReducers", () => {
    describe("fetchQuizzesAsync", () => {
      const pending = applyPending(quizContentReducer, fetchQuizzesAsync);
      test("成功:pendingからfulfilledに遷移しquizzesを更新する", () => {
        const fulfilled = applyFulfilled(
          quizContentReducer,
          fetchQuizzesAsync,
          decodedQuizList,
          pending
        );

        expect(fulfilled).toEqual({
          isLoading: false,
          quizzes: decodedQuizList,
          fetchError: null,
        });
      });

      test("失敗:pendingからrejectedに遷移しfetchErrorを更新する", () => {
        const rejected = applyRejectedWithError(
          quizContentReducer,
          fetchQuizzesAsync,
          "fetch失敗(Thunk)",
          pending
        );

        expect(rejected).toEqual({
          isLoading: false,
          quizzes: [],
          fetchError: "fetch失敗(Thunk)",
        });
      });
    });
  });
});
