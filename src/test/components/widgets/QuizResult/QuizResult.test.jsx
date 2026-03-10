// src/test/components/widgets/QuizResult/QuizResult

import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizResult from "@/components/widgets/QuizResult/QuizResult";
import { renderWithStore } from "@/test/utils/renderWithStore";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";

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
      quizHistory: quizHistoryReducer,
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
      quizHistory: { ...quizHistoryInitialState },
    },
  };

  test("子コンポーネントが描写される", async () => {
    renderWithStore(<QuizResult />, commonOptions);

    //QuizResultVies.jsx
    expect(await screen.findByText("スポーツクイズ 結果")).toBeInTheDocument();
    //ResultSummary.jsx
    expect(screen.getByTestId("result-summary")).toBeInTheDocument();

    const goHomeButtons = screen.getAllByRole("button", {
      name: "ホームへ戻る",
    });
    const retryButtons = screen.getAllByRole("button", {
      name: "同じ条件でもう1度",
    });

    const historyButton = screen.getByRole("button", { name: "記録を見る" });

    expect(goHomeButtons[0]).toBeInTheDocument();
    expect(goHomeButtons).toHaveLength(1);
    expect(retryButtons[0]).toBeInTheDocument();
    expect(retryButtons).toHaveLength(1);
    expect(historyButton).toBeInTheDocument();
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
      name: "同じ条件でもう1度",
    });
    await user.click(retryButtons[0]);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("記録を見るボタンを押すと navigateが呼ばれる", async () => {
    const user = userEvent.setup();
    renderWithStore(<QuizResult />, commonOptions);

    const historyButton = screen.getByRole("button", {
      name: "記録を見る",
    });

    await user.click(historyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/quiz/history");
  });
});
