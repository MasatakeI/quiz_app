//QuizResultView.test.jsx

import { screen, render } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import QuizResultView from "../../../../components/widgets/QuizResult/QuizResultView";

describe("QuizResultView", () => {
  test("指定した条件と正解数が表示される", () => {
    render(
      <QuizResultView
        quizTitle={"スポーツ"}
        numberOfCorrects={3}
        currentDifficulty={"かんたん"}
        amount={10}
        getType={"4択"}
        difficultyMap={{
          easy: "かんたん",
          medium: "ふつう",
          hard: "むずかしい",
        }}
        difficulty={"easy"}
      />
    );
    expect(screen.getByText("スポーツクイズ 結果")).toBeInTheDocument();
    expect(screen.getByText("正解数 3問")).toBeInTheDocument();
    expect(screen.getByText("問題数 10")).toBeInTheDocument();
    expect(screen.getByText("Level かんたん")).toBeInTheDocument();
    expect(screen.getByText("タイプ 4択")).toBeInTheDocument();
  });
});
