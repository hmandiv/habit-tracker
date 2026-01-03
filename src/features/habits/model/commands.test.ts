import { describe, it, expect } from "vitest";
import { createHabit, toggleCheckin } from "./commands";
import { HabitState } from "./state";
import { todayDay } from "@/shared/lib/day";

describe("commands", () => {
  const state: HabitState = {
    habits: [],
    checkinsByHabitId: {},
  };

  describe("toggleCheckin", () => {
    it("adds day when habit has no check-ins yet", () => {
      // Act
      const next = toggleCheckin(state, "habit-1", "2025-12-27");

      // Assert
      expect(next.checkinsByHabitId["habit-1"]).toEqual(["2025-12-27"]);
    });

    it("adds day when habit already has other check-ins", () => {
      const state: HabitState = {
        habits: [],
        checkinsByHabitId: {
          "habit-1": ["2025-12-26"],
        },
      };

      const next = toggleCheckin(state, "habit-1", "2025-12-27");

      expect(next.checkinsByHabitId["habit-1"]).toEqual([
        "2025-12-26",
        "2025-12-27",
      ]);
    });

    it("removes day when day already exists", () => {
      const state: HabitState = {
        habits: [],
        checkinsByHabitId: {
          "habit-1": ["2025-12-27", "2025-12-28"],
        },
      };

      const next = toggleCheckin(state, "habit-1", "2025-12-27");

      expect(next.checkinsByHabitId["habit-1"]).toEqual(["2025-12-28"]);
    });

    it("does not mutate original state", () => {
      const state: HabitState = {
        habits: [],
        checkinsByHabitId: {
          "habit-1": ["2025-12-27"],
        },
      };

      toggleCheckin(state, "habit-1", "2025-12-27");

      expect(state.checkinsByHabitId["habit-1"]).toEqual(["2025-12-27"]);
    });
  });

  describe("createHabit", () => {
    it("prevents creating a habit with an empty or whitespace-only name", () => {
      expect(createHabit(state, " ")).toBe(state);
      expect(createHabit(state, "")).toBe(state);
    });

    it("creates a new habit and appends it to state", () => {
      const result: HabitState = createHabit(state, "habit-1");

      // new state object
      expect(result).not.toBe(state);

      // habit added
      expect(result.habits).toHaveLength(state.habits.length + 1);

      const newHabit = result.habits.at(-1)!;

      // invariant checks
      expect(typeof newHabit.id).toBe("string");
      expect(newHabit.name).toBe("habit-1");
      expect(newHabit.archived).toBe(false);
      expect(newHabit.createdAt).toBe(todayDay());
    });
  });
});
