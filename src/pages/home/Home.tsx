import "./Home.css";
import { useState } from "react";
import RecipeList from "../../components/RecipeList";
import { useCollection } from "../../hooks/useCollection";
import { Query } from "@firebase/firestore-types";
import { useAuthContext } from "../../hooks/useAuthContext";

export function Home() {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState<boolean>(false);
  const { documents, error } = useCollection("recipes", (ref: Query) => {
    return ref.where("uid", "==", user.uid);
  });

  return (
    <div className="home">
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {documents && <RecipeList recipes={documents} />}
    </div>
  );
}
