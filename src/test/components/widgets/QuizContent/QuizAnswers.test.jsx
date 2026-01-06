// src/test/components/widgets/QuizContent/QuizAnswers.test.js

import { screen, render, fireEvent } from "@testing-library/react";

import { describe, test, expect, vi } from "vitest";

import QuizAnswers from "../../../../components/widgets/QuizContent/QuizAnswers";

vi.mock("../../../../components/common/Button/Button", () => ({
  default: ({ children, onClickHandler }) => (
    <button onClick={onClickHandler}>{children}</button>
  ),
}));

describe("QuizAnswerAlert.jsxのテスト", () => {
  test("answers分のボタンが表示される", () => {
    const onSelect = vi.fn();
    render(
      <QuizAnswers
        shuffledAnswers={["A", "B", "C", "D"]}
        onSelect={onSelect}
        canPost={true}
        indexMap={["A", "B", "C", "D"]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /A/ }));
    expect(onSelect).toHaveBeenCalledWith("A");
  });
});
