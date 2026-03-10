//ResultButtonContainer.test.jsx

import { screen, render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import ResultButtonContainer from "@/components/widgets/QuizResult/ResultButtonContainer";

describe("ResultButtonContainer", () => {
  test("ボタンが表示され,クリック時に対応する関数が呼ばれる", async () => {
    const mockOnRetry = vi.fn();
    const mockOnNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultButtonContainer
        onNavigate={mockOnNavigate}
        onRetry={mockOnRetry}
      />,
    );

    const retryButton = screen.getByRole("button", {
      name: "同じ条件でもう1度",
    });
    const backToHomeButton = screen.getByRole("button", {
      name: "ホームへ戻る",
    });

    await user.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);

    await user.click(backToHomeButton);
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });
});
