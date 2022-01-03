import { useReducer, useEffect, useState } from "react";
import { projectRecipeBook } from "../firebase/config";

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state: any, action: any) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        document: null,
        isPending: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFireStore = (collection: string) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  //collection ref
  const ref = projectRecipeBook.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action: object) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add document
  const addDocument = async (doc: object) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const addedDocument = await ref.add(doc);
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error });
    }
  };

  // delete document
  const deleteDocument = async (id: string) => {};

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response}
};
