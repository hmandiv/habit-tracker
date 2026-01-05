import { describe, it, expect, vi, beforeEach } from "vitest";
import type { HabitState } from "@/features/habits/model/state";
import { getItem, setItem } from "./storageClient";
import { loadHabitState, saveHabitState } from "./habitStorage";

vi.mock("./storageClient", () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

describe("habitStorage", () => {
  const defaultHabitState: HabitState = {
    habits: [],
    checkinsByHabitId: {},
  };

  const validState: HabitState = {
    habits: [
      {
        id: "h1",
        name: "Drink water",
        createdAt: "2025-12-27",
        archived: false,
      },
    ],
    checkinsByHabitId: {
      h1: ["2025-12-27"],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadHabitState", () => {
    it("returns default state when nothing is stored (null)", () => {
      vi.mocked(getItem).mockReturnValue(null);

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });

    it("returns default state when stored value is not an object", () => {
      vi.mocked(getItem).mockReturnValue("not-an-object");

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });

    it("returns default state when schemaVersion is missing", () => {
      vi.mocked(getItem).mockReturnValue({ data: validState });

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });

    it("returns default state when schemaVersion is wrong", () => {
      vi.mocked(getItem).mockReturnValue({
        schemaVersion: 999,
        data: validState,
      });

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });

    it("returns default state when data is missing", () => {
      vi.mocked(getItem).mockReturnValue({ schemaVersion: 1 });

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });

    it("returns persisted data when schemaVersion matches and data exists", () => {
      vi.mocked(getItem).mockReturnValue({
        schemaVersion: 1,
        data: validState,
      });

      const result = loadHabitState();

      expect(result).toEqual(validState);
    });

    it("returns default state when stored object is empty", () => {
      vi.mocked(getItem).mockReturnValue({});

      const result = loadHabitState();

      expect(result).toEqual(defaultHabitState);
    });
  });

  describe("saveHabitState", () => {
    it("wraps state with schemaVersion and saves to STORAGE_KEY", () => {
      saveHabitState(validState);

      expect(setItem).toHaveBeenCalledTimes(1);

      const [calledKey, calledValue] = vi.mocked(setItem).mock.calls[0];

      expect(calledKey).toBe("habit-tracker.state");
      expect(calledValue).toEqual({
        schemaVersion: 1,
        data: validState,
      });
    });
  });
});
