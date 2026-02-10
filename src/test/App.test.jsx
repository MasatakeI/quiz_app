//App.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { screen } from "@testing-library/react";

import App from "../App";

import { renderWithStore } from "./utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";
import { snackbarInitialState } from "@/redux/features/snackbar/snackbarSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/Header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/layout/Footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/AppRoutes", () => ({
  default: () => <div data-testid="app-routes">AppRoutes</div>,
}));

vi.mock("@/components/common/SimpleSnackbar/SimpleSnackbar", () => ({
  default: ({ message, isOpen, onClose }) => (
    <div data-testid="simple-snackbar">
      {isOpen && (
        <>
          <span>{message}</span>
          <button onClick={onClose}>Close</button>
        </>
      )}
    </div>
  ),
}));

describe("App.jsx", () => {
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

  describe("初期パス / HomePageとレイアウトの基本コンポーネントが描画される", () => {
    test.each(["header", "footer", "simple-snackbar", "app-routes"])(
      "%s",
      (testId) => {
        renderWithStore(
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>,
          commonOptions,
        );

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      },
    );
  });

  test("snackbarが開いているとき,メッセージが正しく表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,
      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          snackbar: {
            snackbarMessage: "error",
            snackbarOpen: true,
          },
        },
      },
    );

    expect(screen.getByTestId("simple-snackbar")).toHaveTextContent("error");
  });
  test("snackbarのCloseボタンを押すと,snackbarが閉じる", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,
      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          snackbar: {
            snackbarMessage: "error",
            snackbarOpen: true,
          },
        },
      },
    );

    const closeButton = screen.getByRole("button", { name: "Close" });

    await user.click(closeButton);

    expect(screen.getByTestId("simple-snackbar").firstChild).toBe(null);
    expect(store.getState().snackbar.snackbarOpen).toBe(false);
  });
});
