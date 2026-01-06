// page/QuizPage/QuizPage.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import QuizPage from "../../../../components/page/QuizPage/QuizPage";

const quizContentReducer = (state = {}) => state;
const quizProgressReducer = (state = {}) => state;

vi.mock("../../../../components/widgets/QuizLoadng/QuizLoading", () => ({
  default: () => <div>Loading</div>,
}));

vi.mock("../../../../components/widgets/QuizContent/QuizContent", () => ({
  default: () => <div>Content</div>,
}));

vi.mock("../../../../components/widgets/QuizResult/QuizResult", () => ({
  default: () => <div>Result</div>,
}));

vi.mock("react-router", async () => ({
  useParams: () => ({ category: "sports" }),
  useSearchParams: () => [new URLSearchParams()],
}));

// vi.mock("../../../../redux/features/quizContent/quizContentSlice", async () => {
//   const actual = await vi.importActual(
//     "../../../../redux/features/quizContent/quizContentSlice"
//   );

//   const mockThunk = vi.fn(() => ({ type: "mock/fetch" }));
//   mockThunk.pending = { type: "mock/fetch/pending" };
//   mockThunk.fulfilled = { type: "mock/fetch/fulfilled" };
//   mockThunk.rejected = { type: "mock/fetch/rejected" };

//   return {
//     ...actual,
//     fetchQuizzesAsync: mockThunk,
//   };
// });

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, wrapper };
};

describe("QuizPage.jsx", () => {
  test("isLoading=trueのときQuizLoadingが表示される", () => {
    const { wrapper } = setup({
      quizContent: {
        isLoading: true,
        quizzes: [],
        fetchError: null,
      },

      quizProgress: {
        currentIndex: 0,
        numberOfCorrects: 0,
        numberOfIncorrects: 0,
        userAnsers: [],
      },
    });

    render(<QuizPage />, { wrapper });

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });
  test("quizFinished=trueの時QuizResultが表示される", () => {
    const { wrapper } = setup({
      quizContent: {
        isLoading: false,
        quizzes: [{}, {}],
        fetchError: null,
      },
      quizProgress: {
        currentIndex: 3,
        numberOfCorrects: 1,
        numberOfIncorrects: 1,
        userAnsers: [{}, {}],
      },
    });

    render(<QuizPage />, { wrapper });

    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  test("通常時はQuizContentが表示される", () => {
    const { wrapper } = setup({
      quizContent: {
        isLoading: false,
        quizzes: [{}, {}],
        fetchError: null,
      },
      quizProgress: {
        currentIndex: 0,
        numberOfCorrects: 0,
        numberOfIncorrects: 0,
        userAnsers: [],
      },
    });

    render(<QuizPage />, { wrapper });

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
