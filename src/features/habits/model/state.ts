import { CheckinsByHabitId } from "./checkins";
import { Habit } from "./habit";

export type HabitState = {
  habits: Habit[];
  checkinsByHabitId: CheckinsByHabitId;
};
