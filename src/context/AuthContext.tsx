import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

type ContextProps = {
  user: {
    email: string;
    password: string;
    displayName: string;
    uid: string;
  };
  authIsReady: boolean;
  dispatch: Function;
};

const initialState = {
  user: { email: "", password: "", displayName: "", uid: "" },
  authIsReady: false,
  dispatch: Function,
};

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContext = createContext<ContextProps>(initialState);

export const AuthContextProvider = ({ children }: { children: any | null }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  console.log("AuthContext state ", state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
