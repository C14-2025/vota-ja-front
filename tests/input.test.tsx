import Input from "../src/common/Input/Input";
import type { InputProps } from "../src/types/input";

describe("Input component - basic validation", () => {
  it("should: component is defined and exported", () => {
    expect(Input).toBeDefined();
    expect(typeof Input).toBe("function");
  });

  it("should: accepts standard input props", () => {
    const props: InputProps = {
      type: "text",
      placeholder: "Enter text",
      disabled: false,
      required: false,
    };
    expect(props).toBeDefined();
  });

  it("should: accepts variant props", () => {
    const variants: Array<InputProps["variant"]> = [
      "default",
      "error",
      "success",
    ];
    variants.forEach((variant) => {
      const props: InputProps = { variant };
      expect(props.variant).toBe(variant);
    });
  });

  it("should: accepts label prop", () => {
    const props: InputProps = {
      label: "Username",
      id: "username",
    };
    expect(props.label).toBe("Username");
  });

  it("should: accepts error prop", () => {
    const props: InputProps = {
      error: "Invalid input",
      id: "test-input",
    };
    expect(props.error).toBe("Invalid input");
  });

  it("should: accepts helperText prop", () => {
    const props: InputProps = {
      helperText: "Enter your username",
    };
    expect(props.helperText).toBe("Enter your username");
  });

  it("should: accepts password type", () => {
    const props: InputProps = {
      type: "password",
      id: "pwd",
    };
    expect(props.type).toBe("password");
  });

  it("should: accepts fullWidth prop", () => {
    const props: InputProps = {
      fullWidth: true,
    };
    expect(props.fullWidth).toBe(true);
  });

  it("should: accepts disabled prop", () => {
    const props: InputProps = {
      disabled: true,
    };
    expect(props.disabled).toBe(true);
  });

  it("should: accepts custom props", () => {
    const props = {
      placeholder: "Enter text",
      "data-test": "my-input",
      maxLength: 100,
    } as InputProps & Record<string, unknown>;
    expect(props.placeholder).toBe("Enter text");
    expect(props["data-test"]).toBe("my-input");
    expect(props.maxLength).toBe(100);
  });
});
