//App.test.jsx

import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { screen, render } from "@testing-library/react";

import App from "../App";

vi.mock("../components/page/HomePage/HomePage", () => ({
  default: () => <div>HomePage</div>,
}));
vi.mock("../components/page/QuizPage/QuizPage", () => ({
  default: () => <div>QuizPage</div>,
}));

describe("App.jsx", () => {
  test("/ でHomePageが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });
  test("/quiz/:category でHomePageが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("QuizPage")).toBeInTheDocument();
  });
});
