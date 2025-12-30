import { describe, it, expect } from "vitest";
import { getTotalCheckins, isDoneOnDay } from "./selectors";

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

describe("getTotalCheckins", () => {
  it("returns total checkIns", () => {
    expect(getTotalCheckins(["2025-12-27", "2025-12-28", "2025-12-29"])).toBe(
      3
    );
  });

  it("returns 0 when days is undefined", () => {
    expect(getTotalCheckins()).toBe(0);
  });
});
