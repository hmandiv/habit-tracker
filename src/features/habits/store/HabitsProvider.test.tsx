import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HabitsProvider } from "./HabitsProvider";
import { useHabits } from "./useHabits";
import type { HabitState } from "../model/state";

import { loadHabitState, saveHabitState } from "@/shared/storage/habitStorage";

// 1) Mock the storage repo module (IMPORTANT: path must match your imports)
vi.mock("@/shared/storage/habitStorage", () => {
  return {
    loadHabitState: vi.fn(),
    saveHabitState: vi.fn(),
  };
});

// 3) Tiny test component that consumes context
function ShowHabitCount() {
  const { state } = useHabits();
  return <div data-testid="count">{state.habits.length}</div>;
}

// 4) Tiny test component that dispatches the real action (integration trigger)
function ToggleButton() {
  const { dispatch } = useHabits();
  return (
    <button
      onClick={() =>
        dispatch({
          type: "toggleCheckin",
          payload: { habitId: "h1", day: "2025-12-28" },
        })
      }
    >
      toggle
    </button>
  );
}

// 5) Another component to read state after toggle
function ShowCheckins() {
  const { state } = useHabits();
  const days = state.checkinsByHabitId["h1"] ?? [];
  return <div data-testid="days">{days.join(",")}</div>;
}

describe("HabitsProvider integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if useHabits is called outside HabitsProvider (guard)", () => {
    // Component that calls the hook without provider
    function BadConsumer() {
      useHabits();
      return null;
    }

    // React Testing Library surfaces hook errors via render throwing
    expect(() => render(<BadConsumer />)).toThrow(
      "useHabits must be used within <HabitsProvider>"
    );
  });

  it("initializes state from loadHabitState()", () => {
    const initial: HabitState = {
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

    // tell the mocked loader what to return
    vi.mocked(loadHabitState).mockReturnValue(initial);

    render(
      <HabitsProvider>
        <ShowHabitCount />
      </HabitsProvider>
    );

    expect(loadHabitState).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("persists after state changes (saveHabitState called after dispatch)", async () => {
    const user = userEvent.setup();

    const initial: HabitState = {
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

    vi.mocked(loadHabitState).mockReturnValue(initial);

    render(
      <HabitsProvider>
        <ToggleButton />
        <ShowCheckins />
      </HabitsProvider>
    );

    // trigger a real dispatch (through context)
    await user.click(screen.getByRole("button", { name: "toggle" }));

    // state should reflect new check-in (proves wiring works end-to-end)
    expect(screen.getByTestId("days")).toHaveTextContent(
      "2025-12-27,2025-12-28"
    );

    // save happens in useEffect → wait for it
    await waitFor(() => {
      expect(saveHabitState).toHaveBeenCalled();
    });

    // It should be called with the updated state at least once.
    // (Note: it may also be called once on mount depending on effect)
    const lastCallArg = vi.mocked(saveHabitState).mock.calls.at(-1)?.[0];
    expect(lastCallArg?.checkinsByHabitId["h1"]).toEqual([
      "2025-12-27",
      "2025-12-28",
    ]);
  });
});
