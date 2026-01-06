// src/test/components/widgets/QuizResult/QuizResult

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useQuizResult } from "../../../../components/widgets/QuizResult/useQuizResult";
import QuizResult from "../../../../components/widgets/QuizResult/QuizResult";

// ---mocks---

vi.mock("../../../../components/widgets/QuizResult/useQuizResult");

vi.mock("../../../../components/widgets/QuizResult/QuizResultView", () => ({
  default: () => <div data-testid="quiz-result-view" />,
}));

vi.mock(
  "../../../../components/widgets/QuizResult/ResultButtonContainer",
  () => ({
    default: ({ onRetry, onNavigate }) => (
      <>
        <button onClick={onRetry}>同じジャンルでもう1度</button>
        <button onClick={onNavigate}>ホームへ戻る</button>
      </>
    ),
  })
);

vi.mock(
  "../../../../components/widgets/QuizResult/ResultSummary/ResultSummary",
  () => ({
    default: () => <div data-testid="result-summary" />,
  })
);

const mockHandleGoHome = vi.fn();
const mockHandleRetry = vi.fn();

const baseMockValue = {
  handleGoHome: mockHandleGoHome,
  handleRetry: mockHandleRetry,
  quizTitle: "スポーツ",
  numberOfCorrects: 3,
  currentDifficulty: "かんたん",
  amount: "10",
  type: "multiple",
  difficulty: "easy",
  userAnswers: [{}, {}, {}],
};

beforeEach(() => {
  vi.clearAllMocks();

  useQuizResult.mockReturnValue(baseMockValue);
});

describe("QuizResult.jsxのテスト", () => {
  test("子コンポーネントが描写される", () => {
    render(<QuizResult />);
    expect(screen.getByTestId("quiz-result-view")).toBeInTheDocument();
    expect(screen.getByTestId("result-summary")).toBeInTheDocument();
  });
  test("ホームへ戻るボタンを押すとhandleGoHomeが呼ばれる", () => {
    render(<QuizResult />);

    const buttons = screen.getAllByText("ホームへ戻る");
    fireEvent.click(buttons[0]);
    expect(mockHandleGoHome).toHaveBeenCalledTimes(1);
  });

  test("同じジャンルでもう1度ボタンを押すとhandleRetryが呼ばれる", () => {
    render(<QuizResult />);

    const buttons = screen.getAllByText("同じジャンルでもう1度");
    fireEvent.click(buttons[0]);
    expect(mockHandleRetry).toHaveBeenCalledTimes(1);
  });
});
