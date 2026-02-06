// src/test/components/widgets/QuizLoading/QuizLoading

import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizLoading from "@/components/widgets/QuizLoading/QuizLoading";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";

import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";

import { renderWithStore } from "@/test/utils/renderWithStore";

import * as quizContentThunks from "@/redux/features/quizContent/quizContentThunks";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";

vi.mock("../../../../components/common/LoadingSpinner/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner"></div>,
}));

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    useSearchParams: () => [
      new URLSearchParams("type=multiple&difficulty=easy&amount=10"),
      vi.fn(),
    ],
  };
});

describe("QuizLoading.jsxのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
    },
  };

  test("正常系：データ取得成功時は何も表示しない", () => {
    const { container } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: null },
      },
    });

    expect(container.firstChild).toBe(null);
  });

  test("isLoading===trueの時,LoadingSpinnerが表示される", () => {
    renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: true },
      },
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("isLoading===falseでfetchErrorがある時,メッセージと再読み込みボタンとホームへ戻るボタンが表示される", () => {
    renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
      },
    });

    const reloadButton = screen.getByRole("button", { name: "再読み込み" });
    const goHomeButton = screen.getByRole("button", { name: "ホームへ戻る" });

    expect(screen.getByText("エラー")).toBeInTheDocument();

    expect(reloadButton).toBeInTheDocument();
    expect(goHomeButton).toBeInTheDocument();
  });

  test("再読み込みボタンを押すとfetchQuizzesAsyncがdispatchされる", async () => {
    const { dispatchSpy } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
      },
    });

    const fetchSpy = vi.spyOn(quizContentThunks, "fetchQuizzesAsync");

    const user = userEvent.setup();
    const reloadButton = screen.getByRole("button", { name: "再読み込み" });
    await user.click(reloadButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(fetchSpy).toHaveBeenCalledWith({
      category: "sports",
      type: "multiple",
      difficulty: "easy",
      amount: "10",
    });
  });

  test("ホームへ戻るボタンを押すとhandleGoHomeが呼ばれる", async () => {
    const { dispatchSpy } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
        quizSettings: {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: "10",
        },
      },
    });

    const user = userEvent.setup();
    const goHomeButton = screen.getByRole("button", { name: "ホームへ戻る" });
    await user.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "quizContent/resetQuizContent",
    });
  });
});
