import "./Home.css";
import { useEffect, useState } from "react";
import RecipeList from "../../components/RecipeList";
import { projectRecipeBook } from "../../firebase/config";

export function Home() {
  const [data, setData] = useState<string[] | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPending(true);

    const unsub = projectRecipeBook.collection("recipes").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("No recipes to load");
          setIsPending(false);
        } else {
          let results: string[] = [];
          snapshot.docs.forEach((doc: any) => {
            results.push({ id: doc.id, ...doc.data() });
            console.log(results);
          });
          setData(results);
          setIsPending(false);
        }
      },
      (err) => {
        setError(err.message);
        setIsPending(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div className="home">
      <h1>home</h1>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <RecipeList recipes={data} />}
    </div>
  );
}
