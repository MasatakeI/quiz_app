// src/test/components/widgets/QuizResult/QuizResult

import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizResult from "../../../../components/widgets/QuizResult/QuizResult";
import { renderWithStore } from "@/test/utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";
import userEvent from "@testing-library/user-event";

// ---mocks---
vi.mock("@/components/widgets/QuizResult/ResultSummary/ResultSummary", () => ({
  default: () => <div data-testid="result-summary" />,
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

describe("QuizResult.jsxのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
    },
    preloadedState: {
      quizContent: {
        ...contentInitialState,
        quizzes: [
          {
            question: "test1?",
            correctAnswer: "True",
            incorrectAnswers: ["False"],
            difficulty: "easy",
          },
          {
            question: "test2?",
            correctAnswer: "True",
            incorrectAnswers: ["False"],
            difficulty: "easy",
          },
        ],
      },
      quizProgress: {
        ...progressInitialState,
        currentIndex: 2,
        numberOfCorrects: 1,
        numberOfIncorrects: 1,
      },
      quizSettings: {
        ...settingsInitialState,
        category: "sports",
      },
    },
  };

  test("子コンポーネントが描写される", () => {
    renderWithStore(<QuizResult />, commonOptions);

    //QuizResultVies.jsx
    expect(screen.getByText("スポーツクイズ 結果")).toBeInTheDocument();
    //ResultSummary.jsx
    expect(screen.getByTestId("result-summary")).toBeInTheDocument();

    const goHomeButtons = screen.getAllByRole("button", {
      name: "ホームへ戻る",
    });
    const retryButtons = screen.getAllByRole("button", {
      name: "同じジャンルでもう1度",
    });

    expect(goHomeButtons[0]).toBeInTheDocument();
    expect(goHomeButtons).toHaveLength(2);
    expect(retryButtons[0]).toBeInTheDocument();
    expect(retryButtons).toHaveLength(2);
  });

  test("ホームへ戻るボタンを押すとhandleGoHomeが呼ばれる", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(<QuizResult />, commonOptions);

    const goHomeButtons = screen.getAllByRole("button", {
      name: "ホームへ戻る",
    });

    await user.click(goHomeButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "quizContent/resetQuizContent",
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "quizSettings/resetQuizSettings",
      }),
    );
  });

  test("同じジャンルでもう1度ボタンを押すとhandleRetryが呼ばれる", async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderWithStore(<QuizResult />, commonOptions);

    const retryButtons = screen.getAllByRole("button", {
      name: "同じジャンルでもう1度",
    });
    await user.click(retryButtons[0]);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });
});
