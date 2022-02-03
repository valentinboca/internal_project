import "./Home.css";
import { useEffect, useState } from "react";
import RecipeList from "../../components/RecipeList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectRecipeBook } from "../../firebase/config";
import "../../components/Searchbar.css";

export function Home() {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState<boolean>(false);

  const [term, setTerm] = useState<string>("");
  const [documents1, setDocuments1] = useState<[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  type LoadAllDocuments = () => void

  const loadAllDocuments: LoadAllDocuments = () => {
    const unsubscribe = projectRecipeBook
      .collection("recipes")
      .where("uid", "==", user.uid)
      .orderBy("title")
      .onSnapshot(
        (snapshot) => {
          let results: any = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // update state
          setDocuments1(results);
          setError(null);
        },
        (error) => {
          console.log(error);
          setError("could not fetch the data");
        }
      );

    // unsubscribe on unmount
    return () => unsubscribe();
  };

  useEffect(() => {
    loadAllDocuments();
  }, [!term]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    console.log(e.target.value.toLowerCase())
    const term = e.target.value;
    setTerm(term);
    setTerm(e.target.value);

    const unsubscribe = projectRecipeBook
      .collection("recipes")
      .where("uid", "==", user.uid)
      .orderBy("title")
      .startAt(term)
      .endAt(term + "\uf8ff")
      .onSnapshot(
        (snapshot) => {
          let results: any = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // update state
          setDocuments1(results);
          setError(null);
        },
        (error) => {
          console.log(error);
          setError("could not fetch the data");
        }
      );

    // unsubscribe on unmount
    return () => unsubscribe();
  };

  return (
    <div className="home">
      <form>
        <label htmlFor="search">Search:</label>
        <input type="search" id="search" onChange={handleChange} required />
      </form>
      {isPending && <p className="loading">Loading...</p>}
      {documents1 && <RecipeList recipes={documents1} />}
    </div>
  );
}
