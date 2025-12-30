import { Day } from "./checkins";
import { HabitId } from "./habit";
import { HabitState } from "./state";

export const toggleCheckin = (
  state: HabitState,
  habitId: HabitId,
  day: Day
): HabitState => {
  const { checkinsByHabitId } = state;

  const days = checkinsByHabitId[habitId] ?? [];

  const updatedDays = days.includes(day)
    ? days.filter((checkedInDate) => {
        return checkedInDate !== day;
      })
    : [...days, day];

  return {
    ...state,
    checkinsByHabitId: {
      ...checkinsByHabitId,
      [habitId]: updatedDays,
    },
  };
};
