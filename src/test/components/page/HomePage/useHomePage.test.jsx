//useHomePage.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, useNavigate, useParams } from "react-router";

import quizContentReducer from "../../../../redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "../../../../redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "../../../../redux/features/quizSettings/quizSettingsSlice";

import { useHomePage } from "../../../../components/page/HomePage/useHomePage";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ category: "sports" }),
  };
});

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          "/quiz/sports?type=multiple&difficulty=easy&amount=10",
        ]}
      >
        {children}
      </MemoryRouter>
    </Provider>
  );

  return { store, wrapper };
};

const baseState = {
  quizSettings: {
    category: "sports",
    difficulty: "easy",
    type: "multiple",
    amount: 10,
  },
};

describe("useHomePage.js", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });
  describe("handleStart", () => {
    test("成功時:dispatchとnavigateが呼ばれる", () => {
      const { store, wrapper } = setup(baseState);
      const { result } = renderHook(() => useHomePage(), { wrapper });

      act(() => {
        result.current.handleStart();
      });

      const state = store.getState().quizSettings;

      expect(state.category).toBe("sports");
      expect(state.difficulty).toBe("easy");
      expect(state.type).toBe("multiple");
      expect(state.amount).toBe(10);

      expect(navigateMock).toHaveBeenCalledWith(
        "/quiz/sports?type=multiple&difficulty=easy&amount=10"
      );
    });

    test("validation失敗時:snackbarが開く", () => {
      const invalidState = {
        quizSettings: {
          category: null,
          difficulty: "",
          type: "",
          amount: 0,
        },
      };

      const { store, wrapper } = setup(invalidState);
      const { result } = renderHook(() => useHomePage(), { wrapper });

      act(() => {
        result.current.handleStart();
      });

      expect(result.current.snackbarOpen).toBe(true);
      expect(result.current.errorMessage).not.toBe("");
    });
  });

  describe("items", () => {
    test("4つ定義されている", () => {
      const { wrapper } = setup(baseState);
      const { result } = renderHook(() => useHomePage(), { wrapper });

      expect(result.current.items).toHaveLength(4);
    });

    test("type=booleanの時,amountが5になる", () => {
      const booleanState = {
        quizSettings: {
          category: "sports",
          difficulty: "easy",
          type: "boolean",
          amount: 5,
        },
      };
      const { wrapper, store } = setup(booleanState);
      const { result } = renderHook(() => useHomePage(), { wrapper });

      const typeItem = result.current.items.find(
        (item) => item.label === "タイプ"
      );

      act(() => {
        typeItem.onChange("boolean");
      });

      const state = store.getState().quizSettings;

      expect(state.type).toBe("boolean");
      expect(state.amount).toBe(5);
    });
  });
});
