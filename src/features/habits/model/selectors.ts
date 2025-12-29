import { Day } from "./checkins";

export function isDoneOnDay(days: Day[] | undefined, day: Day): boolean {
  if (!days) return false;
  return days.includes(day);
}
