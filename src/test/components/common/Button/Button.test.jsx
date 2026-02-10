// Button.test.jsx

import { describe, test, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import Button from "@/components/common/Button/Button";
import userEvent from "@testing-library/user-event";

describe("Button.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("childrenが表示される", () => {
    render(<Button onClickHandler={() => {}} children={"送信"} />);

    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  test("クリック時にonClickHandlerが呼ばれる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClickHandler={onClick} children={"送信"} />);

    await user.click(screen.getByText("送信"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("clickable=falseの時,diabledになる", () => {
    render(
      <Button onClickHandler={() => {}} clickable={false} children={"送信"} />,
    );
    expect(screen.getByText("送信")).toBeDisabled();
  });

  test("variantに応じたクラスが付与される", () => {
    render(
      <Button
        onClickHandler={() => {}}
        variant="secondary"
        children={"送信"}
      />,
    );

    expect(screen.getByText("送信")).toHaveClass("button-secondary");
  });

  test("clickbale=falseかつcolorStatusなしの時 disabled=trueになる", () => {
    render(
      <Button
        onClickHandler={() => {}}
        children={"送信"}
        clickable={false}
        colorStatus={null}
      />,
    );

    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  test("clickable=falseでもcolorStatusがあれば disabledにならない", () => {
    render(
      <Button
        onClickHandler={() => {}}
        children={"送信"}
        clickable={false}
        colorStatus={"correct"}
      />,
    );

    expect(screen.getByRole("button", { name: "送信" })).not.toBeDisabled();
  });
});
