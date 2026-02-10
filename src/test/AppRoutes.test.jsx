//AppRoutes.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { screen } from "@testing-library/react";

import AppRoutes from "@/AppRoutes";

import { renderWithStore } from "./utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";
import { snackbarInitialState } from "@/redux/features/snackbar/snackbarSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@/components/page/HomePage/HomePage", () => ({
  default: () => <div data-testid="home-page">HomePage</div>,
}));
vi.mock("@/components/page/QuizPage/QuizPage", () => ({
  default: () => <div data-testid="quiz-page">QuizPage</div>,
}));

describe("AppRoutes.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      snackbar: snackbarReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      snackbar: { ...snackbarInitialState },
    },
  };

  test("初期パス / HomePageが描画される QuizPageは描画されない", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("quiz-page")).not.toBeInTheDocument();
  });

  test("/quiz/:category にアクセスすると QuizPage が表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("quiz-page")).toBeInTheDocument();
  });

  test("存在しないパスにアクセスした時HomePageにリダイレクトする", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/@@@"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("リダイレクトの分岐網羅: 複数の不正なパスで検証", () => {
    const { unmount } = renderWithStore(
      <MemoryRouter initialEntries={["/not-found-123"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    unmount(); // 一度クリーンアップして別の分岐へ

    renderWithStore(
      <MemoryRouter initialEntries={["/invalid/path/test"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
