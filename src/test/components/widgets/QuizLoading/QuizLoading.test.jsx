// src/test/components/widgets/QuizLoading/QuizLoading

import { screen, render, fireEvent } from "@testing-library/react";
import useEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { MemoryRouter } from "react-router";

import QuizLoading from "../../../../components/widgets/QuizLoadng/QuizLoading";

import quizContentReducer from "../../../../redux/features/quizContent/quizContentSlice";

vi.mock("../../../../components/common/LoadingSpinner/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner"></div>,
}));

vi.mock("../../../../components/common/Button/Button", () => ({
  default: ({ children, onClickHandler }) => (
    <button onClick={onClickHandler}>{children}</button>
  ),
}));

vi.mock("../../../../components/common/BackToHomeLink/BackToHomeLink", () => ({
  default: () => <div data-testid="back-to-home-link" />,
}));

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      quizContent: quizContentReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={["/quiz/sports?type=multiple"]}>
        {children}
      </MemoryRouter>
    </Provider>
  );

  return { store, wrapper };
};

describe("QuizLoading.jsxのテスト", () => {
  test("isLoading===trueの時,LoadingSpinnerが表示される", () => {
    const { wrapper } = setup({
      quizContent: {
        isLoading: true,
        quizzes: [],
        fetchError: null,
      },
    });

    render(<QuizLoading />, { wrapper });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("isLoading===falseでfetchErrorがある時,メッセージと再読み込みボタンが表示される", () => {
    const { wrapper } = setup({
      quizContent: {
        isLoading: false,
        quizzes: [],
        fetchError: "エラー",
      },
    });

    render(<QuizLoading />, { wrapper });

    expect(screen.getByText("エラー")).toBeInTheDocument();
    expect(screen.getByText("再読み込み")).toBeInTheDocument();
  });

  test("再読み込みボタンを押すとfetchQuizzesAsyncがdispatchされる", async () => {
    const { wrapper, store } = setup({
      quizContent: {
        isLoading: false,
        quizzes: [],
        fetchError: "エラー",
      },
    });

    const spy = vi.spyOn(store, "dispatch");
    render(<QuizLoading />, { wrapper });

    const user = useEvent.setup();
    await user.click(screen.getByText("再読み込み"));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Function));
  });
});
