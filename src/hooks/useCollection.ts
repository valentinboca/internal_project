import { useEffect, useState } from "react";
import { projectRecipeBook } from "../firebase/config";
import "firebase/firestore";
import { Query } from "@firebase/firestore-types";

export const useCollection = (collection: any, toBeNamedFunction: Function) => {
  const [documents, setDocuments] = useState<[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call

  useEffect(() => {
    let ref: Query = projectRecipeBook
      .collection(collection)
      
      ref = toBeNamedFunction(ref)

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results: any = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collection]);

  return { documents, error };
};
