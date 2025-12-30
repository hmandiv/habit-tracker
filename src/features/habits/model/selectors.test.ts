import { describe, it, expect } from "vitest";
import { isDoneOnDay } from "./selectors";

describe("isDoneOnDay", () => {
  it("returns false when days is undefined", () => {
    expect(isDoneOnDay(undefined, "2025-12-27")).toBe(false);
  });

  it("returns true when day exists in list", () => {
    expect(isDoneOnDay(["2025-12-27"], "2025-12-27")).toBe(true);
  });

  it("returns false when day does not exist in list", () => {
    expect(isDoneOnDay(["2025-12-26"], "2025-12-27")).toBe(false);
  });
});
