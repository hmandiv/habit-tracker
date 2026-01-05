import { describe, it, expect } from "vitest";
import { HabitState } from "../model/state";
import { habitsReducer } from "./habitsReducer";

describe("habitsReducer", () => {
  describe("toggleCheckin", () => {
    it("adds a day when it is not present", () => {
      const initialState: HabitState = {
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

      const newState = habitsReducer(initialState, {
        type: "toggleCheckin",
        payload: { habitId: "h1", day: "2025-12-28" },
      });

      // identity: reducer returns new state object
      expect(newState).not.toBe(initialState);

      // behavior: exact days are present
      expect(newState.checkinsByHabitId.h1).toEqual([
        "2025-12-27",
        "2025-12-28",
      ]);

      // immutability: input state not mutated
      expect(initialState.checkinsByHabitId.h1).toEqual(["2025-12-27"]);

      // untouched slice: habits unchanged
      expect(newState.habits).toBe(initialState.habits);
    });

    it("removes a day when it is already present", () => {
      const initialState: HabitState = {
        habits: [
          {
            id: "h1",
            name: "Drink water",
            createdAt: "2025-12-27",
            archived: false,
          },
        ],
        checkinsByHabitId: {
          h1: ["2025-12-27", "2025-12-28"],
        },
      };

      const newState = habitsReducer(initialState, {
        type: "toggleCheckin",
        payload: { habitId: "h1", day: "2025-12-28" },
      });

      expect(newState).not.toBe(initialState);
      expect(newState.checkinsByHabitId.h1).toEqual(["2025-12-27"]);
      expect(initialState.checkinsByHabitId.h1).toEqual([
        "2025-12-27",
        "2025-12-28",
      ]);
      expect(newState.habits).toBe(initialState.habits);
    });

    it("initializes check-ins for a habit when none exist", () => {
      const initialState: HabitState = {
        habits: [
          {
            id: "h1",
            name: "Drink water",
            createdAt: "2025-12-27",
            archived: false,
          },
        ],
        checkinsByHabitId: {},
      };

      const newState = habitsReducer(initialState, {
        type: "toggleCheckin",
        payload: { habitId: "h1", day: "2025-12-28" },
      });

      expect(newState).not.toBe(initialState);
      expect(newState.checkinsByHabitId.h1).toEqual(["2025-12-28"]);
      expect(initialState.checkinsByHabitId.h1).toBeUndefined();
      expect(newState.habits).toBe(initialState.habits);
    });

    it("returns the same state for unknown actions", () => {
      const initialState: HabitState = {
        habits: [
          {
            id: "h1",
            name: "Drink water",
            createdAt: "2025-12-27",
            archived: false,
          },
        ],
        checkinsByHabitId: { h1: ["2025-12-27"] },
      };

      // force an unknown action shape for the test
      const newState = habitsReducer(initialState, {
        // @ts-expect-error testing unknown action
        type: "unknown",
        payload: { habitId: "h1", day: "2025-12-28" },
      });

      // identity: reducer returns same object when no change
      expect(newState).toBe(initialState);
    });
  });
});
