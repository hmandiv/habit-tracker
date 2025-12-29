/**
 * Habits domain model.
 */

export type HabitId = string;

export type Habit = {
  id: HabitId;
  name: string;
  createdAt: string;
  archived: boolean;
};
