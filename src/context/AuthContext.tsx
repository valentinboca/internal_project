import { createContext, Reducer, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";
import { Query } from "@firebase/firestore-types";

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

type User = {
  email: string;
  displayName: string;
  uid: string;
};

type Action = { type: string; payload: User | any };

const initialState = {
  user: { email: "", password: "", displayName: "", uid: "" },
  authIsReady: false,
  dispatch: Function,
};

type State = {
  user: User | any;
  authIsReady: boolean;
};

export const authReducer: Reducer<State, Action> = (
  state: State,
  action: Action
) => {
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

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
