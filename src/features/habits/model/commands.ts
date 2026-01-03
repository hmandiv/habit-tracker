import { todayDay } from "@/shared/lib/day";
import { Day } from "./checkins";
import { Habit, HabitId } from "./habit";
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

export const createHabit = (state: HabitState, name: string): HabitState => {
  if (!name.trim()) return state;

  const newHabit: Habit = {
    id: crypto.randomUUID(),
    name,
    createdAt: todayDay(),
    archived: false,
  };

  return {
    ...state,
    habits: [...state.habits, newHabit],
  };
};
