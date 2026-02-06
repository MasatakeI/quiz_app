// src/test/components/widgets/QuizContent/QuizContent.test.jsx

import { screen } from "@testing-library/react";
import { describe, test, vi, expect, beforeEach } from "vitest";

import QuizContent from "@/components/widgets/QuizContent/QuizContent";

import { renderWithStore } from "@/test/utils/renderWithStore";
import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import userEvent from "@testing-library/user-event";

// ---mocks---

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

vi.mock("../../../../components/widgets/QuizContent/QuizAnswerAlert", () => ({
  default: ({ quizResult, onNext }) =>
    quizResult ? <button onClick={onNext}>次へ</button> : null,
}));

vi.mock("../../../../components/common/BackToHomeLink/BackToHomeLink", () => ({
  default: () => <div>ホームへ戻る</div>,
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

describe("QuizContent.jsxのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
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
      quizProgress: { ...progressInitialState },
    },
  };

  test("shuffledAnswersがQuizAnswersに渡される", () => {
    renderWithStore(<QuizContent />, commonOption);

    expect(screen.getByRole("button", { name: "True" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "False" })).toBeInTheDocument();
  });

  test("回答ボタンをクリックすると判定が行われて,次へボタンが表示される", async () => {
    const user = userEvent.setup();

    renderWithStore(<QuizContent />, commonOption);

    const answerButton = screen.getByRole("button", { name: "True" });

    await user.click(answerButton);

    expect(screen.getByRole("button", { name: "次へ" })).toBeInTheDocument();
    expect(answerButton).toBeDisabled();
  });

  test("quizResultがある時,次へボタンを押すと,次の問題が表示される", async () => {
    const user = userEvent.setup();
    renderWithStore(<QuizContent />, commonOption);

    await user.click(screen.getByRole("button", { name: "True" }));
    const goToNextButton = screen.getByRole("button", { name: "次へ" });
    await user.click(goToNextButton);
    expect(screen.getByText("Q2. test2?")).toBeInTheDocument();
  });

  test("回答後は選択肢のボタンがdisabledになる", async () => {
    const user = userEvent.setup();

    renderWithStore(<QuizContent />, commonOption);
    const answerButton = screen.getByRole("button", { name: "True" });
    await user.click(answerButton);
    expect(screen.getByRole("button", { name: "True" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "False" })).toBeDisabled();
  });
});
