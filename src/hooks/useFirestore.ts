import { useReducer, useEffect, useState, Reducer } from "react";
import { projectRecipeBook } from "../firebase/config";
import { Query } from "@firebase/firestore-types";

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

type Recipe = {
  uid: string;
  title: string;
  ingredients: string[];
  method: string;
  cookingTime: string;
};

type Ingredient = {
  ingredient: string;
};

type Ingredient2 = {
  label: string | null;
  value: string | null
}

type State = {
  isPending: boolean | null;
  error: string | null;
  success: boolean;
  document: Recipe | null;
};

type Action = {
  type: string;
  payload: Recipe | any;
};

const firestoreReducer: Reducer<any, any> = (state, action) => {
  console.log('actionul este ', action.type)
  console.log('payloadul este ', action.payload)
  switch (action.type) {
    case "IS_PENDING":
      return {
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case "ADDED_RECIPE":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ADDED_INGREDIENT":
      console.log('asd  ', action.payload)
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
  const dispatchIfNotCancelled = (action: any) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add document
  const addRecipe = async (doc: Recipe) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const addedRecipe = await ref.add(doc);
      dispatchIfNotCancelled({
        type: "ADDED_RECIPE",
        payload: addedRecipe,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error });
    }
  };

  const addIngredient = async (doc: Ingredient) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const addedIngredient = await ref.add(doc);
      dispatchIfNotCancelled({
        type: "ADDED_INGREDIENT",
        payload: addedIngredient,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error });
    }
  };

  const addIngredient1 = async (doc: Ingredient2) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const addedIngredient = await ref.add(doc);
      dispatchIfNotCancelled({
        type: "ADDED_INGREDIENT",
        payload: addedIngredient,
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

  return { addRecipe, addIngredient, addIngredient1, deleteDocument, response };
};
