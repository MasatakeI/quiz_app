//page/HomePage/HomePage.test.jsx

import { screen, render, fireEvent, renderHook } from "@testing-library/react";
import { vi, test, expect, beforeEach, describe } from "vitest";

import HomePage from "../../../../components/page/HomePage/HomePage";
import { renderWithStore } from "@/test/utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "@/redux/features/quizSettings/quizSettingsSlice";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/common/Selection/Selection", () => ({
  default: ({ label, value, disabled, error }) => (
    <div data-testid={`selection-${label}`}>
      <span>{label}</span>
      <span data-testid="value">{value}</span>
      {disabled && <span>disabled</span>}
      {error && <span data-testid="error">error</span>}
    </div>
  ),
}));

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    useSearchParams: () => [
      new URLSearchParams("type=boolean&difficulty=easy&amount=5"),
      vi.fn(),
    ],
  };
});

describe("HomePage.jsx", () => {
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

  describe("見出しと各Selectionが表示される", () => {
    test.each([
      {
        label: "ジャンル",
        key: "category",
      },
      {
        label: "タイプ",
        key: "type",
      },
      {
        label: "問題数",
        key: "amount",
      },
      {
        label: "レベル",
        key: "difficulty",
      },
    ])("$label の Selection が初期値 で表示される", ({ label, key }) => {
      renderWithStore(<HomePage />, commonOption);
      expect(screen.getByText("クイズに挑戦")).toBeInTheDocument();

      expect(screen.getByText(label)).toBeInTheDocument();

      const selection = screen.getByTestId(`selection-${label}`);
      const valueSpan = selection.querySelector('[data-testid="value"]');

      const expectedValue = String(
        commonOption.preloadedState.quizSettings[key],
      );
      expect(valueSpan).toHaveTextContent(expectedValue);
    });
  });

  test("タイプがboleanの時,問題数のSelectionがdisabledになる", () => {
    renderWithStore(<HomePage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizSettings: {
          ...settingsInitialState,
          type: "boolean",
        },
      },
    });
    const amountSelection = screen.getByTestId(`selection-問題数`);
    expect(amountSelection).toHaveTextContent("disabled");
  });

  test("selectionのvalueが設定されずにスタートボタンを押すと,対応するselectionにerrorステートが付く", async () => {
    const user = userEvent.setup();
    renderWithStore(<HomePage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizSettings: {
          category: "sports",
          difficulty: "",
          type: "multiple",
          amount: "10",
        },
      },
    });

    const startButton = screen.getByRole("button", { name: "クイズスタート" });
    await user.click(startButton);

    const errorSelection = screen.getByTestId(`selection-レベル`);
    const errorSpan = errorSelection.querySelector('[data-testid="error"]');
    expect(errorSpan).toBeInTheDocument();
    expect(errorSpan).not.toBeNull();

    expect(errorSpan).toHaveTextContent("error");
  });

  test("クイズスタートボタンをクリックすると handleStart が呼ばれる", async () => {
    const user = userEvent.setup();
    renderWithStore(<HomePage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizSettings: {
          category: "sports",
          difficulty: "easy",
          type: "multiple",
          amount: "10",
        },
      },
    });

    const startButton = screen.getByRole("button", { name: "クイズスタート" });
    await user.click(startButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/quiz/sports?type=multiple&difficulty=easy&amount=10",
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
