import { Day } from "./checkins";

export const isDoneOnDay = (days: Day[] | undefined, day: Day): boolean => {
  if (!days) return false;
  return days.includes(day);
};

export const getTotalCheckins = (days?: Day[]): number => {
  return days?.length ?? 0;
};

export const getCurrentStreak = (today: Day, days?: Day[]): number => {
  if (!days || days.length === 0) return 0;

  const doneSet = new Set(days);

  let streak = 0;

  // StartS from today, but if today is not done,
  // Option B says: start from yesterday
  let cursor = doneSet.has(today) ? today : previousDay(today);

  while (doneSet.has(cursor)) {
    streak++;
    cursor = previousDay(cursor);
  }

  return streak;
};

// helper
const previousDay = (day: Day): Day => {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d); // local midnight
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dd}`;
};
