import { ErrorHandler } from "./errorHandler";

describe("ErrorHandler.parseError", () => {
  it("handles generic Error as unknown", () => {
    const err = new Error("something broke");
    const parsed = ErrorHandler.parseError(err);
    expect(parsed.type).toBe("unknown");
    expect(parsed.message).toContain("something broke");
  });

  it("classifies network errors", () => {
    const err = new Error("network failure");
    const parsed = ErrorHandler.parseError(err);
    expect(parsed.type).toBe("network");
  });

  it("parses API status codes correctly", () => {
    const err = new Error("API Error: 404");
    const parsed = ErrorHandler.parseError(err);
    expect(parsed.type).toBe("server");
  });
});
