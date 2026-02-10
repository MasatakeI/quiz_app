import { describe, test, expect, vi, beforeEach, assert } from "vitest";
import Header from "@/components/layout/Header/Header";

import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { renderWithStore } from "@/test/utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";

import userEvent from "@testing-library/user-event";
import { act } from "react";

const mockNavigate = vi.fn();
vi.mock("@/hooks/useNavigationHelper", () => ({
  useNavigationHelper: () => ({
    handleGoHome: () => mockNavigate("/"),
  }),
}));

describe("Header", () => {
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

  test("ロゴをクリックした時 状態がリセットされ ホームに戻る", async () => {
    const user = userEvent.setup();

    const { store } = renderWithStore(
      <Header />,

      commonOption,
    );

    const logoButton = screen.getByRole("button", { name: "ホームへ戻る" });
    expect(logoButton).toBeInTheDocument();
    await user.click(logoButton);

    expect(store.getState().quizContent).toEqual(contentInitialState);
    expect(store.getState().quizProgress).toEqual(progressInitialState);
    expect(store.getState().quizSettings).toEqual(settingsInitialState);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("初期状態では scrolledクラスは付かない", async () => {
    renderWithStore(<Header />, commonOption);
    const header = screen.getByRole("banner");

    expect(header).not.toHaveClass("scrolled");
  });

  test("スクロール時に scrolledクラスが付与される", async () => {
    renderWithStore(<Header />, commonOption);

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    const header = screen.getByRole("banner");

    await waitFor(() => {
      expect(header).toHaveClass("scrolled");
    });
  });
});
