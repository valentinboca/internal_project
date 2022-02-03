import { createContext, Reducer, useReducer } from "react";

type ContextProps = {
  changeColor: (color: string) => void;
  changeMode: (mode: string) => void;
  color: string;
  mode: string;
};

const initialState = {
  changeColor: (color: string) => {
    dispatch({ type: '', payload: color });
  },
  changeMode: (mode: string) => {
    dispatch({ type: '', payload: mode });
  },
  color: "grey",
  mode: "dark",
};

type State = {
  changeColor: (color: string) => void;
  changeMode: (mode: string) => void;
  color: string;
  mode: string;
};

type Action = {
  type: string,
  payload: string
}

export const ThemeContext = createContext<ContextProps>(initialState);

const themeReducer: Reducer<any, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case "CHANGE_COLOR":
      return { ...state, color: action.payload };
    case "CHANGE_MODE":
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

export function ThemeProvider({ children }: { children: any | null }) {
  console.log('children',typeof children)
  const [state, dispatch] = useReducer(themeReducer, initialState.color);

  const changeColor = (color: string) => {
    dispatch({ type: "CHANGE_COLOR", payload: color });
  };

  const changeMode = (mode: string) => {
    dispatch({ type: "CHANGE_MODE", payload: mode });
  };

  return (
    <ThemeContext.Provider value={{ ...state, changeColor, changeMode }}>
      {children},
    </ThemeContext.Provider>
  );
}
function dispatch(arg0: {}) {
  throw new Error("Function not implemented.");
}
