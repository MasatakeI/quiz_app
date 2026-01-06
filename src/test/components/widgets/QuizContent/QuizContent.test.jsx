// src/test/components/widgets/QuizContent/QuizContent.test.jsx

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, vi, expect, beforeEach } from "vitest";

import QuizContent from "../../../../components/widgets/QuizContent/QuizContent";

import { useQuizContent } from "../../../../components/widgets/QuizContent/useQuizContent";

// ---mocks---

vi.mock("../../../../components/widgets/QuizContent/useQuizContent");

vi.mock("../../../../components/widgets/QuizContent/QuizAnswers", () => ({
  default: ({ shuffledAnswers, onSelect, canPost }) => (
    <div>
      {shuffledAnswers.map((a) => (
        <button key={a} disabled={!canPost} onClick={() => onSelect(a)}>
          {a}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../../../components/widgets/QuizContent/QuizContentView", () => ({
  default: ({ onReload }) => (
    <button onClick={onReload}>再読み込みしてください</button>
  ),
}));

vi.mock("../../../../components/widgets/QuizContent/QuizAnswerAlert", () => ({
  default: ({ answerMessage, onNext }) =>
    answerMessage ? <button onClick={onNext}>次へ</button> : null,
}));

vi.mock("../../../../components/common/BackToHomeLink/BackToHomeLink", () => ({
  default: () => <div>ホームへ戻る</div>,
}));

const mockSelectAnswer = vi.fn();
const mockHandleNext = vi.fn();
const mockHandleReload = vi.fn();

const baseMockValue = {
  selectAnswer: mockSelectAnswer,
  handleNext: mockHandleNext,
  handleReload: mockHandleReload,
  answerMessage: null,
  canPost: true,
  answers: ["True", "False"],
  currentDifficulty: "easy",
  currentIndex: 0,
  currentQuiz: { question: "test question" },
  numberOfCorrects: 0,
  numberOfIncorrects: 0,
  type: "boolean",
  amount: 5,
};

beforeEach(() => {
  vi.clearAllMocks();

  useQuizContent.mockReturnValue(baseMockValue);
});

describe("QuizContent.jsxのテスト", () => {
  test("shuffledAnswersがQuizAnswersに渡される", () => {
    render(<QuizContent />);

    expect(screen.getByText("True")).toBeInTheDocument();
    expect(screen.getByText("False")).toBeInTheDocument();
  });

  test("回答ボタンをクリックするとselectAnswerが呼ばれる", () => {
    render(<QuizContent />);

    fireEvent.click(screen.getByText("True"));
    expect(mockSelectAnswer).toHaveBeenCalledWith("True");
  });

  test("再読み込みボタンをクリックするとhandleReloadが呼ばれる", () => {
    render(<QuizContent />);

    fireEvent.click(screen.getByText("再読み込みしてください"));
    expect(mockHandleReload).toHaveBeenCalled();
  });

  test("answerMessageがある時,次へボタンを押すとhandleNextが呼ばれる", () => {
    useQuizContent.mockReturnValueOnce({
      ...baseMockValue,
      answerMessage: "正解!",
    });
    render(<QuizContent />);
    fireEvent.click(screen.getByText("次へ"));
    expect(mockHandleNext).toHaveBeenCalled();
  });

  test("canPost=falseの時回答ボタンがdisabledになる", () => {
    useQuizContent.mockReturnValueOnce({
      ...baseMockValue,
      canPost: false,
    });

    render(<QuizContent />);

    expect(screen.getByText("True")).toBeDisabled();
    expect(screen.getByText("False")).toBeDisabled();
  });
});
