// page/QuizPage/QuizPage.test.jsx

import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";

import QuizPage from "../../../../components/page/QuizPage/QuizPage";
import { renderWithStore } from "@/test/utils/renderWithStore";

import * as quizContentThunk from "@/redux/features/quizContent/quizContentThunks";

vi.mock("@/components/widgets/QuizLoading/QuizLoading", () => ({
  default: () => <div>Loading</div>,
}));

vi.mock("../../../../components/widgets/QuizContent/QuizContent", () => ({
  default: () => <div>Content</div>,
}));

vi.mock("@/components/widgets/QuizResult/QuizResult", () => ({
  default: () => <div>Result</div>,
}));

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    useSearchParams: () => [
      new URLSearchParams("type=boolean&difficulty=easy&amount=5"),
      vi.fn(),
    ],
  };
});

describe("QuizPage.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(quizContentThunk, "fetchQuizzesAsync").mockReturnValue({
      type: "mock",
    });
  });

  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState: {
      quizContent: {
        ...contentInitialState,
        quizzes: Array(5).fill({ question: "test" }),
        isLoading: false,
        fetchError: null,
      },
      quizProgress: { ...progressInitialState },
    },
  };

  test("fetchQuizzesAsync が 正しい引数で呼ばれる", async () => {
    const fetchSpy = vi.spyOn(quizContentThunk, "fetchQuizzesAsync");
    renderWithStore(<QuizPage />, commonOption);

    expect(fetchSpy).toHaveBeenCalledWith({
      category: "sports",
      type: "boolean",
      difficulty: "easy",
      amount: "5",
    });
  });

  test("isLoading=trueまたはfetchErrorがあるときQuizLoadingが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: true,
          fetchError: { message: "エラー" },
        },
      },
    });

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  test("quizFinished=trueの時QuizResultが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: false,
          fetchError: null,
        },
        quizProgress: {
          ...commonOption.preloadedState.quizProgress,
          currentIndex: 5,
        },
      },
    });

    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  test("通常時はQuizContentが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: false,
          fetchError: null,
        },
        quizProgress: {
          ...commonOption.preloadedState.quizProgress,
          currentIndex: 2,
        },
      },
    });
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
