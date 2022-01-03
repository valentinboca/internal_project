import { useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { projectRecipeBook } from "../../firebase/config";
import { useEffect, useState } from "react";
import { DocumentData } from "@firebase/firestore-types";
import { useNavigate } from "react-router";

// styles
import "./Recipe.css";
import EditRecipeModal from "./EditRecipeModal";

export default function Recipe() {
  const { id } = useParams();
  const { mode } = useTheme();

  const [recipe, setRecipe] = useState<DocumentData | undefined>(undefined);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditRecipe, setShowEditRecipe] = useState<boolean>(false);
  const [editButtonText, setEditButtonText] = useState<string>('Edit')
  const navigate = useNavigate();

  useEffect(() => {
    setIsPending(true);

    const unsub = projectRecipeBook
      .collection("recipes")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setIsPending(false);
          setRecipe(doc.data());
        } else {
          setIsPending(false);
          setError("Could not find that recipe");
        }
      });

    return () => unsub();
  }, [id]);

  const showRecipe = () => {
    if(showEditRecipe === false){
      setShowEditRecipe(true)
    } else {
      setShowEditRecipe(false)
    }
  };

  const changeEditButtonText = () => {
    if(showEditRecipe === false){
      setEditButtonText('Cancel edit')
    } else {
      setEditButtonText('Edit')
    }
    
  }

  return (
    <div className={`recipe ${mode}`}>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {recipe && (
        <>
          <h2 className="page-title">{recipe.title}</h2>
          <p>Takes {recipe.cookingTime} to cook.</p>
          <ul>
            {recipe.ingredients.map((ing: string) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
          <p className="method">{recipe.method}</p>
          <button className="btn" onClick={()=> {showRecipe(); changeEditButtonText()}}>{editButtonText}</button>
        </>
      )}
      <div>{showEditRecipe ? <EditRecipeModal /> : null}</div>
    </div>
  );
}
