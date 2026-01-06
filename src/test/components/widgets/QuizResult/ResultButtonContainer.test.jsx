//ResultButtonContainer.test.jsx

import { screen, render, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import ResultButtonContainer from "../../../../components/widgets/QuizResult/ResultButtonContainer";

describe("ResultButtonContainer", () => {
  test("ボタンが表示され,クリック時に対応する関数が呼ばれる", () => {
    const mockOnRetry = vi.fn();
    const mockOnNavigate = vi.fn();

    render(
      <ResultButtonContainer
        onNavigate={mockOnNavigate}
        onRetry={mockOnRetry}
      />
    );

    fireEvent.click(screen.getByText("同じジャンルでもう1度"));
    fireEvent.click(screen.getByText("ホームへ戻る"));

    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
