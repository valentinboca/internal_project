import { createContext, useReducer } from "react";

type ContextProps = {
  changeColor: Function;
  changeMode: Function;
  color: string;
  mode: string
};

const initialState = {
  changeColor: Function,
  changeMode: Function,
  color: 'green',
  mode: 'dark'
};

export const ThemeContext = createContext<ContextProps>(initialState);

const themeReducer = (state: any, action: any) => {
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
