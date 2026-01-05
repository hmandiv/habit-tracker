import { loadHabitState, saveHabitState } from "@/shared/storage/habitStorage";
import { useReducer, useEffect, createContext } from "react";
import { HabitState } from "../model/state";
import { HabitsAction, habitsReducer } from "./habitsReducer";

// 1) Create context shape
type HabitsContext = {
  state: HabitState;
  dispatch: React.Dispatch<HabitsAction>;
};

// 2) Create context (initially undefined so hook can guard)
const HabitsContext = createContext<HabitsContext | undefined>(undefined);

// 3) Lazy initializer: load saved state once
function initHabitState(): HabitState {
  return loadHabitState(); // returns default state if missing/corrupt/version mismatch
}

// 4) Provider component
export const HabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    habitsReducer,
    undefined,
    initHabitState
  );

  // 5) Persist on change
  useEffect(() => {
    saveHabitState(state);
  }, [state]);

  // 6) Provide state + dispatch
  const value = { state, dispatch };

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
};

// 7) Export context
export { HabitsContext };
