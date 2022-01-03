import "./RecipeList.css";
import { Link } from "react-router-dom";
// import { useTheme } from "./../hooks/useTheme";
import deleteIcon from "../assets/delete.svg";
import { projectRecipeBook } from "../firebase/config";

export default function RecipeList({ recipes }: { recipes: any[] }) {
  if (recipes.length === 0) {
    return <div className="error">No recipes to load...</div>;
  }

  const deleteRecipe = (id: string) => {
    projectRecipeBook.collection("recipes").doc(id).delete();
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe.id} className={`card`}>
          <h3>{recipe.title}</h3>
          <p>{recipe.cookingTime} to make.</p>
          <div>{recipe.method.substring(0, 100)}...</div>
          <Link to={`/recipes/${recipe.id}`}>Cook This</Link>
          <img
            className="delete"
            src={deleteIcon}
            onClick={() => deleteRecipe(recipe.id)}
            alt="delete"
          />
        </div>
      ))}
    </div>
  );
}
