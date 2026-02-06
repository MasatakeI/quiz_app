// src/test/components/widgets/QuizContent/QuizAnswerAlert.test.js

import { screen } from "@testing-library/react";

import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizAnswerAlert from "../../../../components/widgets/QuizContent/QuizAnswerAlert";
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
import userEvent from "@testing-library/user-event";

vi.mock("../../../../components/common/AnswerAlert/AnswerAlert", () => ({
  default: ({ message }) => <div>{message}</div>,
}));

describe("QuizAnswerAlert.jsxのテスト", () => {
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

  describe("quizResultがあるとメッセージとボタンが表示される", () => {
    test.each([
      {
        title: "正解",
        msg: "正解!",
        isCorrect: true,
        selected: "a",
      },
      {
        title: "不正解",
        msg: "不正解...",
        isCorrect: false,
        selected: "b",
      },
    ])("$title の時", async ({ msg, isCorrect, selected }) => {
      const user = userEvent.setup();
      const onNext = vi.fn();
      const result = {
        isCorrect: isCorrect,
        selected: selected,
        correct: "a",
        message: msg,
      };
      renderWithStore(<QuizAnswerAlert quizResult={result} onNext={onNext} />, {
        ...commonOption,
      });

      expect(screen.getByText(msg)).toBeInTheDocument();
      const goToNextButton = screen.getByRole("button", { name: "次へ" });
      await user.click(goToNextButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  test("quizResultがないと何も表示されない", () => {
    const { container } = renderWithStore(
      <QuizAnswerAlert quizResult={null} onNext={() => {}} />,
      {
        ...commonOption,
      },
    );
    expect(container.firstChild).toBeNull();
  });
});
