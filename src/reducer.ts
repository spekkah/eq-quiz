import { DEFAULT_USER_FREQ } from "./utils/constants";

interface AppState {
  phase: "init" | "quiz" | "result";
  targetFreq: number | null;
  userFreq: number;
}

export const initialAppState: AppState = {
  phase: "init",
  targetFreq: null,
  userFreq: DEFAULT_USER_FREQ,
};

type AppAction =
  | { type: "INIT" }
  | { type: "START_ROUND"; targetFreq: number }
  | { type: "SUBMIT"; userFreq: number };

export const appReducer = (
  prevState: AppState,
  action: AppAction,
): AppState => {
  switch (action.type) {
    case "INIT":
      return { ...initialAppState };

    case "START_ROUND":
      return {
        ...prevState,
        phase: "quiz",
        targetFreq: action.targetFreq,
        userFreq: DEFAULT_USER_FREQ,
      };

    case "SUBMIT":
      return {
        ...prevState,
        phase: "result",
        targetFreq: prevState.targetFreq,
        userFreq: action.userFreq,
      };

    default:
      return prevState;
  }
};
