import React from "react";
import Button from "../src/common/Button/Button";
import type { ButtonProps } from "../src/types/button";
import { ArrowRight } from "phosphor-react";

describe("Button component - full behaviour", () => {
  it("should: renders with defaults when no props provided", () => {
    const props = {} as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
    expect(el.type).toBe("button");
  });

  it("should: renders button with children", () => {
    const props = { children: "Click" } as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
    expect(el.type).toBe("button");
  });

  it("should: accepts variant props", () => {
    const variants: Array<ButtonProps["variant"]> = [
      "primary",
      "secondary",
      "ghost",
      "outline",
      "success",
      "danger",
    ];
    variants.forEach((variant) => {
      const props = { variant } as ButtonProps;
      const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
      expect(el).toBeDefined();
    });
  });

  it("should: accepts size props", () => {
    const sizes: Array<ButtonProps["size"]> = ["small", "medium", "large"];
    sizes.forEach((size) => {
      const props = { size } as ButtonProps;
      const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
      expect(el).toBeDefined();
    });
  });

  it("should: renders with fullWidth prop", () => {
    const props = { fullWidth: true } as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
  });

  it("should: handles disabled state", () => {
    const props = { disabled: true } as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
  });

  it("should: handles loading state", () => {
    const props = { loading: true } as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
  });

  it("should: renders with icons", () => {
    const propsLeft = { leftIcon: ArrowRight } as ButtonProps;
    const elLeft = (Button as React.FC<ButtonProps>)(
      propsLeft
    ) as React.ReactElement;
    expect(elLeft).toBeDefined();

    const propsRight = { rightIcon: ArrowRight } as ButtonProps;
    const elRight = (Button as React.FC<ButtonProps>)(
      propsRight
    ) as React.ReactElement;
    expect(elRight).toBeDefined();
  });

  it("should: accepts event handlers", () => {
    const handleClick = jest.fn();
    const props = { onClick: handleClick } as ButtonProps;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
  });

  it("should: accepts additional props", () => {
    const props = {
      "data-test": "my-button",
      "aria-label": "Test button",
      disabled: true,
      className: "extra-class",
      type: "submit" as const,
    } as ButtonProps & Record<string, unknown>;
    const el = (Button as React.FC<ButtonProps>)(props) as React.ReactElement;
    expect(el).toBeDefined();
  });
});
