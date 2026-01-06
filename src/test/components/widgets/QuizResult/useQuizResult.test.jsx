//useQuizResult.test.jsx

import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import quizProgressReducer from "../../../../redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "../../../../redux/features/quizContent/quizContentSlice";
import { useQuizResult } from "../../../../components/widgets/QuizResult/useQuizResult";

import * as quizContentSlice from "../../../../redux/features/quizContent/quizContentSlice";
import * as quizCategories from "../../../../constants/quizCategories";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    useSearchParams: () => [
      new URLSearchParams({
        difficulty: "easy",
        type: "multiple",
        amount: 10,
      }),
    ],
  };
});

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return { store, wrapper };
};

describe("useQuizResult.jsのテスト", () => {
  describe("handleRetry", () => {
    test("fetchQuizzesAsyncがdispatchされる", () => {
      const spy = vi.spyOn(quizContentSlice, "fetchQuizzesAsync");
      const { wrapper } = setup({
        quizProgress: {
          numberOfCorrects: 2,
        },
        quizContent: {
          quizzes: [],
          fetchError: null,
          isLoading: false,
        },
      });

      const { result } = renderHook(() => useQuizResult(), { wrapper });

      act(() => {
        result.current.handleRetry();
      });

      expect(spy).toHaveBeenCalledWith({
        category: "sports",
        difficulty: "easy",
        type: "multiple",
        amount: "10",
      });
    });
  });

  describe("handleGoHome", () => {
    test("ホームページへ戻る", () => {
      const { wrapper } = setup({
        quizProgress: { numberOfCorrects: 3 },
      });

      const { result } = renderHook(() => useQuizResult(), { wrapper });

      act(() => {
        result.current.handleGoHome();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("selector", () => {
    test("値がそのまま返る", () => {
      const { wrapper } = setup({
        quizProgress: {
          userAnswers: [{}, {}, {}],
          numberOfCorrects: 3,
        },
      });

      const { result } = renderHook(() => useQuizResult(), { wrapper });
      expect(result.current.numberOfCorrects).toBe(3);
      expect(result.current.userAnswers.length).toBe(3);
    });
  });

  describe("quizTitles", () => {
    test("categoryからタイトルが生成される", () => {
      vi.spyOn(quizCategories, "getQuizTitle").mockReturnValue("スポーツ");

      const { wrapper } = setup({
        quizProgress: { numberOfCorrects: 1 },
      });

      const { result } = renderHook(() => useQuizResult(), { wrapper });

      expect(result.current.quizTitle).toBe("スポーツ");
    });
  });
});
