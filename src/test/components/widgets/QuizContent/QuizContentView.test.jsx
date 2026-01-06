// src/test/components/widgets/QuizContent/QuizContentView.test.js

import { screen, render, fireEvent } from "@testing-library/react";

import { describe, test, expect, vi } from "vitest";

import QuizContentView from "../../../../components/widgets/QuizContent/QuizContentView";

vi.mock("../../../../components/widgets/QuizEmptyState/QuizEmptyState", () => ({
  default: ({ onReload }) => (
    <button onClick={onReload}>再読み込みしてください</button>
  ),
}));

describe("QuizContentView.jsx", () => {
  test("currentQuizがある場合:クイズが表示される", () => {
    render(
      <QuizContentView
        title={"スポーツ"}
        getType={"4択"}
        amount={10}
        currentDifficulty={"かんたん"}
        type={"multiple"}
        currentQuiz={{ question: "test?" }}
        currentIndex={3}
        numberOfCorrects={2}
        numberOfIncorrects={1}
        onReload={vi.fn()}
      />
    );

    expect(screen.getByText("スポーツクイズ")).toBeInTheDocument();
    expect(screen.getByText("問題数 10")).toBeInTheDocument();
    expect(screen.getByText("Level かんたん")).toBeInTheDocument();
    expect(screen.getByText("タイプ 4択")).toBeInTheDocument();
    expect(screen.getByText("Q4. test?")).toBeInTheDocument();

    expect(screen.getByText(/正解数/)).toHaveTextContent("2");
    expect(screen.getByText(/誤答数/)).toHaveTextContent("1");
  });

  test("currentQuizがない場合", () => {
    render(<QuizContentView currentQuiz={null} onReload={vi.fn()} />);

    expect(screen.getByText("再読み込みしてください")).toBeInTheDocument();
  });

  test("再読み込みボタンを押すとonReloadが呼ばれる", () => {
    const onReload = vi.fn();

    render(<QuizContentView currentQuiz={null} onReload={onReload} />);

    fireEvent.click(screen.getByText("再読み込みしてください"));
    expect(onReload).toHaveBeenCalledTimes(1);
  });
});
