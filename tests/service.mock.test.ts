import { getData } from "../src/services/api";
import { toast } from "react-toastify";

jest.mock("../src/services/api");
jest.mock("react-toastify");

describe("service mocking example", () => {
  it("mocks getData and toast usage", async () => {
    const mockedGetData = getData as jest.MockedFunction<typeof getData>;
    mockedGetData.mockResolvedValue({ id: "42", value: "mocked" });

    const res = await getData("42");
    expect(res.value).toBe("mocked");

    const mockedToast = toast as unknown as { success: jest.Mock };
    mockedToast.success("ok");
    expect(mockedToast.success).toHaveBeenCalledWith("ok");
  });
});

describe("api.getData real implementation (from tests/ using requireActual)", () => {
  it("returns expected value for id using requireActual", async () => {
    // obtain the real implementation even though the module is mocked above
    const apiActual = jest.requireActual(
      "../src/services/api"
    ) as typeof import("../src/services/api");
    const res = await apiActual.getData("5");
    expect(res).toEqual({ id: "5", value: "value-for-5" });
  });
});
