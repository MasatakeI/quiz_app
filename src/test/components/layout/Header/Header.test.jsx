import { describe, test, expect, vi, beforeEach } from "vitest";
import Header from "@/components/layout/Header/Header";

import { screen, waitFor } from "@testing-library/react";

import { renderWithStore } from "@/test/utils/renderWithStore";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";

import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter } from "react-router";

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
      quizHistory: quizHistoryReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
    },
  };

  test("ロゴをクリックした時 状態がリセットされ ホームに戻る", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const logoButton = screen.getByRole("button", { name: "ホームへ戻る" });
    expect(logoButton).toBeInTheDocument();
    await user.click(logoButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("初期状態では scrolledクラスは付かない", async () => {
    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );
    const header = screen.getByRole("banner");

    expect(header).not.toHaveClass("scrolled");
  });

  test("スクロール時に scrolledクラスが付与される", async () => {
    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

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
