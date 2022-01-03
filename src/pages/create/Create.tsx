// styles
import "./Create.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { projectRecipeBook } from "../../firebase/config";
import { useFireStore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Create({}) {
  const [title, setTitle] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<string>("");
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const ingredientInput = useRef<HTMLHeadingElement>(null);
  const { addDocument, response } = useFireStore("recipes");
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, method, cookingTime, ingredients);
    addDocument({
      uid: user.uid,
      title,
      ingredients,
      method,
      cookingTime: cookingTime + " minutes",
    });
    navigate("/");

    // try {
    //   await projectRecipeBook.collection("recipes").add(doc);
    //   navigate("/");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleAdd = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const ing = newIngredient.trim();

    if (ing && !ingredients.includes(ing)) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    }

    setNewIngredient("");
    if (null !== ingredientInput.current) {
      ingredientInput.current.focus();
    }
  };

  useEffect(() => {
    if (response.success) {
      setTitle("");
      setMethod("");
      setCookingTime("");
    }
  }, [response.success]);

  return (
    <div className="create">
      <h2 className="page-title">Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Recipe title:</span>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </label>

        <label>
          <span>Recipe ingredients:</span>
          <div className="ingredients">
            <input
              type="text"
              onChange={(e) => setNewIngredient(e.target.value)}
              value={newIngredient}
            />
            <button onClick={handleAdd} className="button">
              add
            </button>
          </div>
        </label>

        <p>
          Current ingredients:{" "}
          {ingredients.map((i) => (
            <em key={i}>{i}, </em>
          ))}
        </p>

        <label>
          <span>Recipe method:</span>
          <textarea
            onChange={(e) => setMethod(e.target.value)}
            value={method}
            required
          />
        </label>

        <label>
          <span>Cooking time (minutes):</span>
          <input
            type="number"
            onChange={(e) => setCookingTime(e.target.value)}
            value={cookingTime}
            required
          />
        </label>

        <button className="button">submit</button>
      </form>
    </div>
  );
}
