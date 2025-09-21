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

  it("uses aria-label as alt when provided for an img and applies numeric size to img style", () => {
    const stub = "test-file-stub";
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      src: stub,
      size: 20,
      ["aria-label"]: "my-icon",
    } as Record<string, unknown>) as React.ReactElement;

    const props = (el.props || {}) as Record<string, unknown>;
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const imgNode = node as React.ReactElement<
      React.ImgHTMLAttributes<HTMLImageElement>
    >;
    expect(imgNode.type).toBe("img");
    expect(imgNode.props.src).toBe(stub);
    expect(imgNode.props.alt).toBe("my-icon");
    expect(imgNode.props.style).toBeDefined();
    expect(String((imgNode.props.style || {}).width)).toBe("20px");
    expect(String((imgNode.props.style || {}).height)).toBe("20px");
  });

  it("combines provided className with root and renders children after the icon", () => {
    const child = <span>child</span>;
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      Icon: ArrowUp,
      className: "extra",
      children: child,
    } as Record<string, unknown>) as React.ReactElement;

    const props = (el.props || {}) as Record<string, unknown>;
    expect(String(props.className)).toContain("root");
    expect(String(props.className)).toContain("extra");

    const children = props.children as unknown;
    expect(Array.isArray(children)).toBe(true);
    const node1 = (children as Array<unknown>)[1] as React.ReactElement;
    expect(node1.type).toBe("span");
  });

  it("placeholder (no Icon and no src) uses default size 24 and inline style on span", () => {
    const el = (IconButton as React.FC<Record<string, unknown>>)(
      {} as Record<string, unknown>
    ) as React.ReactElement;

    const props = (el.props || {}) as Record<string, unknown>;
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const spanNode = node as React.ReactElement<HTMLSpanElement>;
    expect(spanNode.type).toBe("span");
    expect(String((spanNode.props.style || {}).width)).toBe("24px");
    expect(String((spanNode.props.style || {}).height)).toBe("24px");
  });

  it("accepts a string size (e.g. '2rem') and applies it directly to img/span style without px", () => {
    const stub = "test-file-stub";
    const el = (IconButton as React.FC<Record<string, unknown>>)({
      src: stub,
      size: "2rem",
    } as Record<string, unknown>) as React.ReactElement;

    const props = (el.props || {}) as Record<string, unknown>;
    const children = props.children as unknown;
    const node = Array.isArray(children) ? children[0] : children;
    const imgNode = node as React.ReactElement<
      React.ImgHTMLAttributes<HTMLImageElement>
    >;
    expect(String((imgNode.props.style || {}).width)).toBe("2rem");
    expect(String((imgNode.props.style || {}).height)).toBe("2rem");
  });
});
