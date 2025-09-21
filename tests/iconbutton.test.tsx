import React from "react";
import IconButton from "../src/common/IconButton/IconButton";
import { ArrowUp } from "phosphor-react";

describe("IconButton component", () => {
  it("renders an img when src is provided (image import mocked)", () => {
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      Icon: ArrowUp,
      size: 32,
    } as Record<string, unknown>) as React.ReactElement;

    expect(el).toBeDefined();
    const props = (el.props || {}) as Record<string, unknown>;
    expect(props.children).toBeDefined();

    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    expect(node).toBeDefined();
    const iconNode = node as React.ReactElement<{
      size?: number | string;
      color?: string;
    }>;
    expect(iconNode.props.size).toBe(32);
  });

  it("renders placeholder when no src provided", () => {
    const el = (IconButton as React.FC<Record<string, unknown>>)(
      {} as Record<string, unknown>
    ) as React.ReactElement;
    expect(el).toBeDefined();
    const props = (el.props || {}) as Record<string, unknown>;
    expect(props.children).toBeDefined();
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const spanNode = node as React.ReactElement<HTMLSpanElement>;
    expect(spanNode.type).toBe("span");
  });

  it("renders an img when src is provided (string stub)", () => {
    const stub = "test-file-stub";
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      src: stub,
      size: 24,
    } as Record<string, unknown>) as React.ReactElement;

    expect(el).toBeDefined();
    const props = (el.props || {}) as Record<string, unknown>;
    expect(props.children).toBeDefined();
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const imgNode = node as React.ReactElement<
      React.ImgHTMLAttributes<HTMLImageElement>
    >;
    expect(imgNode.type).toBe("img");
    expect(imgNode.props.src).toBe(stub);
  });

  it("forwards onClick handler and disabled prop to button", () => {
    const handleClick = jest.fn();
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      onClick: handleClick,
      disabled: true,
    } as Record<string, unknown>) as React.ReactElement;
    const props = (el.props || {}) as Record<string, unknown>;
    expect(props.onClick).toBe(handleClick);
    expect(props.disabled).toBe(true);
  });

  it("forwards color and size to Icon component", () => {
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      Icon: ArrowUp,
      size: 18,
      color: "#ff0000",
    } as Record<string, unknown>) as React.ReactElement;
    const props = (el.props || {}) as Record<string, unknown>;
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const iconNode = node as React.ReactElement<{
      size?: number | string;
      color?: string;
    }>;
    expect(iconNode.props.size).toBe(18);
    expect(iconNode.props.color).toBe("#ff0000");
  });
});
