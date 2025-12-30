import { describe, it, expect } from "vitest";
import { toggleCheckin } from "./commands";
import { HabitState } from "./state";

describe("toggleCheckin", () => {
  it("adds day when habit has no check-ins yet", () => {
    // Arrange: state with no check-ins for this habit
    const state: HabitState = {
      habits: [],
      checkinsByHabitId: {},
    };

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
