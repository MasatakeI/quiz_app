//page/HomePage/HomePage.test.jsx

import { screen, render, fireEvent, renderHook } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import { useHomePage } from "../../../../components/page/HomePage/useHomePage";

import HomePage from "../../../../components/page/HomePage/HomePage";

vi.mock("../../../../components/page/HomePage/useHomePage");

vi.mock("../../../../components/common/Selection/Selection", () => ({
  default: ({ label, value, disabled }) => (
    <div>
      <span>{label}</span>
      <span>{value}</span>
      {disabled && <span>disabled</span>}
    </div>
  ),
}));

vi.mock("../../../../components/common/SimpleSnackbar/SimpleSnackbar", () => ({
  default: ({ isOpen, onClose, message }) =>
    isOpen ? (
      <div>
        <span>{message}</span>
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));
vi.mock("../../../../components/common/Button/Button", () => ({
  default: ({ onClickHandler, children }) => (
    <button onClick={onClickHandler}>{children}</button>
  ),
}));

const mockHandleStart = vi.fn();
const mockCloseSnackbar = vi.fn();

const baseMockValue = {
  items: [
    { label: "ジャンル", value: "sports", onChange: vi.fn(), array: [] },
    { label: "タイプ", value: "multiple", onChange: vi.fn(), array: [] },
    { label: "Level", value: "easy", onChange: vi.fn(), array: [] },
    {
      label: "問題数",
      value: 10,
      onChange: vi.fn(),
      array: [],
      disabled: false,
    },
  ],
  handleStart: mockHandleStart,
  closeSnackbar: mockCloseSnackbar,
  errorMessage: "",
  snackbarOpen: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  useHomePage.mockReturnValue(baseMockValue);
});

describe("HomePage.jsx", () => {
  test("見出しとSelectionが表示される", () => {
    render(<HomePage />);
    expect(screen.getByText("クイズに挑戦"));

    baseMockValue.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  test("クイズスタートボタンを押すとhandleStartが呼ばれる", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByText("クイズスタート"));
    expect(mockHandleStart).toHaveBeenCalledTimes(1);
  });

  test("snackbarOpen=trueの時,エラーメッセージが表示される", () => {
    useHomePage.mockReturnValue({
      ...baseMockValue,
      snackbarOpen: true,
      errorMessage: "エラー",
    });

    render(<HomePage />);

    expect(screen.getByText("エラー")).toBeInTheDocument();
  });

  test("snackbarのcloseボタンでcolseSnackbarが呼ばれる", () => {
    useHomePage.mockReturnValue({
      ...baseMockValue,
      snackbarOpen: true,
      errorMessage: "エラー",
    });

    render(<HomePage />);

    fireEvent.click(screen.getByText("close"));
    expect(mockCloseSnackbar).toHaveBeenCalledTimes(1);
  });
});
