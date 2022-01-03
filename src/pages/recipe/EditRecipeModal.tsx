import { useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { projectRecipeBook } from "../../firebase/config";
import { useEffect, useState } from "react";
import { DocumentData } from "@firebase/firestore-types";
import { useNavigate } from "react-router";

// styles
import "./Recipe.css";

export default function EditRecipeModal() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<string>("");
  const [recipe, setRecipe] = useState<DocumentData | undefined>(undefined);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditRecipe, setShowEditRecipe] = useState<boolean>(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = {
      title,
      method,
      cookingTime: cookingTime + " minutes",
    };

    try {
      await projectRecipeBook.collection("recipes").doc(id).update(doc);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="edit-recipe-modal" className="modal">
      {recipe && (
        <>
          <h2 className="page-title">Edit recipe</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Recipe title:</span>
              <input
                type="text"
                defaultValue={recipe.title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Recipe method:</span>
              <textarea
                defaultValue={recipe.method}
                onChange={(e) => setMethod(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Cooking time (minutes):</span>
              <input
                type="text"
                defaultValue={recipe.cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </label>
            <button className="btn">Update</button>
          </form>
        </>
      )}
    </div>
  );
}
