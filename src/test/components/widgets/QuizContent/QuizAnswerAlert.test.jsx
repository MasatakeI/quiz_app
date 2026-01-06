// src/test/components/widgets/QuizContent/QuizAnswerAlert.test.js

import { screen, render, fireEvent } from "@testing-library/react";

import { describe, test, expect, vi } from "vitest";

import QuizAnswerAlert from "../../../../components/widgets/QuizContent/QuizAnswerAlert";

vi.mock("../../../../components/common/AnswerAlert/AnswerAlert", () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock("../../../../components/common/Button/Button", () => ({
  default: ({ children, onClickHandler }) => (
    <button onClick={onClickHandler}>{children}</button>
  ),
}));

describe("QuizAnswerAlert.jsxのテスト", () => {
  test("answerMessageがあるとメッセージとボタンが表示される", () => {
    const onNext = vi.fn();
    render(<QuizAnswerAlert answerMessage="正解! " onNext={onNext} />);

    expect(screen.getByText("正解!")).toBeInTheDocument();

    fireEvent.click(screen.getByText("次へ"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  test("answerMessageがないと何も表示されない", () => {
    render(<QuizAnswerAlert answerMessage="" onNext={() => {}} />);
    expect(screen.queryByText("次へ")).toBeNull();
  });
});
