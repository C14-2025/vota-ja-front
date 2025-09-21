import { toast, ToastContainer } from "react-toastify";

describe("react-toastify mock", () => {
  it("should have toast methods that can be called", () => {
    toast.success("ok");
    toast.error("err");
    toast.info("info");
    toast.warn("warn");

    expect(toast.success).toHaveBeenCalledWith("ok");
    expect(toast.error).toHaveBeenCalledWith("err");
    expect(toast.info).toHaveBeenCalledWith("info");
    expect(toast.warn).toHaveBeenCalledWith("warn");
  });

  it("ToastContainer is a noop component in the mock", () => {
    const el = (
      ToastContainer as unknown as (props?: Record<string, unknown>) => null
    )({});
    expect(el).toBeNull();
  });
});
