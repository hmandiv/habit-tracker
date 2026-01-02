import { HabitState } from "@/features/habits/model/state";
import { getItem, setItem } from "./storageClient";

const STORAGE_KEY = "habit-tracker.state";
const SCHEMA_VERSION = 1;

export type PersistedHabitStateV1 = {
  schemaVersion: 1;
  data: HabitState;
};

const defaultHabitState: HabitState = {
  habits: [],
  checkinsByHabitId: {},
};

export const loadHabitState = (): HabitState => {
  const raw = getItem(STORAGE_KEY);

  if (!raw || typeof raw !== "object") {
    return defaultHabitState;
  }

  const persisted = raw as Partial<PersistedHabitStateV1>;

  if (persisted.schemaVersion !== SCHEMA_VERSION) {
    return defaultHabitState;
  }

  if (!persisted.data) {
    return defaultHabitState;
  }

  return persisted.data;
};

export const saveHabitState = (habitState: HabitState): void => {
  const wrapped: PersistedHabitStateV1 = {
    schemaVersion: SCHEMA_VERSION,
    data: habitState,
  };

  setItem(STORAGE_KEY, wrapped);
};
