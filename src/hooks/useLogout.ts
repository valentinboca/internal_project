import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogut = () => {
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // signout user
    try {
      await projectAuth.signOut();

      //   dispatch logout action
      dispatch({ type: "LOGOUT" });

      //   update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error: any) {
      if (!isCancelled) {
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { error, isPending, logout };
};
