import { useLocation } from "react-router-dom";
import RecipeList from "../../components/RecipeList";
import { useParams } from "react-router-dom";

// styles
import "./Search.css";
import { useEffect } from "react";
import { projectRecipeBook } from "../../firebase/config";

export default function Search() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get("q");
  const { id } = useParams();

  const url = "http://localhost:3000/recipes/" + query;
  //   const { error, isPending, data } = useFetch(url);

  useEffect(() => {
    const unsub = projectRecipeBook
      .collection("recipes")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          // console.log(doc.data());
          //   setRecipe(doc.data())
        } else {
          console.log("ERRRORRRRR");
        }
      });

    return () => unsub();
  }, [id]);

  return (
    <div>
      <h2 className="page-title">Recipes including "{query} "</h2>
      {/* {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <RecipeList recipes={data}></RecipeList>} */}
    </div>
  );
}
