import { Day } from "./checkins";

export const isDoneOnDay = (days: Day[] | undefined, day: Day): boolean => {
  if (!days) return false;
  return days.includes(day);
};

export const getTotalCheckins = (days?: Day[]): number => {
  return days?.length ?? 0;
};
