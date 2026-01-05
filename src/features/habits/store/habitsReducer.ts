import { Day } from "../model/checkins";
import { toggleCheckin } from "../model/commands";
import { HabitId } from "../model/habit";
import { HabitState } from "../model/state";

type HabitsAction = {
  type: "toggleCheckin";
  payload: { habitId: HabitId; day: Day };
};

export function habitsReducer(
  state: HabitState,
  action: HabitsAction
): HabitState {
  const { type, payload } = action;
  const { habitId, day } = payload;

  switch (type) {
    case "toggleCheckin": {
      // call your command (pure mutation-by-copy)
      return toggleCheckin(state, habitId, day);
    }
    default: {
      // exhaustive check (optional)
      return state;
    }
  }
}

export type { HabitsAction };
