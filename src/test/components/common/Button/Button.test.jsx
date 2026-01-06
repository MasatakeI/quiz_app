// Button.test.jsx

import { screen, render, fireEvent } from "@testing-library/react";

import { describe, test, expect } from "vitest";

import Button from "../../../../components/common/Button/Button";

describe("Button.jsx", () => {
  test("childrenが表示される", () => {
    render(<Button onClickHandler={() => {}} children={"送信"} />);

    expect(screen.getByText("送信")).toBeInTheDocument();
  });

  test("クリック時にonClickHandlerが呼ばれる", () => {
    const onClick = vi.fn();
    render(<Button onClickHandler={onClick} children={"送信"} />);

    fireEvent.click(screen.getByText("送信"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("clickable=falseの時,diabledになる", () => {
    render(
      <Button onClickHandler={() => {}} clickable={false} children={"送信"} />
    );
    expect(screen.getByText("送信")).toBeDisabled();
  });

  test("variantに応じたクラスが付与される", () => {
    render(
      <Button onClickHandler={() => {}} variant="secondary" children={"送信"} />
    );

    expect(screen.getByText("送信")).toHaveClass("button-secondary");
  });
});
