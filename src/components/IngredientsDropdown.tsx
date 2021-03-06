import "./IngredientsDropdown.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useFireStore } from "../hooks/useFirestore";

export default function IngredientsDropdown({
  ingredients,
  onInputChange,
}: {
  ingredients: any[];
  onInputChange: any;
}) {
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState<string>("unit");
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [newIngredientWithQuantity, setNewIngredientWithQuantity] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);

  const handleAdd = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const duplicateIngredient = addedIngredients.find(a =>a.includes(newIngredient)); 
    const ing = newIngredient.split(" ")[0]
    
    if (ing && !duplicateIngredient) {
      setAddedIngredients((prevIngredients) => [
        ...prevIngredients,
        newIngredient + ' ' + quantity
      ]);
      setNewIngredientWithQuantity(newIngredient + ' ' + quantity)
    }

    inputRef.current!.value = ''
    setQuantity('')
    setUnit('unit')
    if (null !== inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    inputRef.current?.addEventListener("click", (e) => {
      e?.stopPropagation();
      ulRef.current!.style.display = "flex";
      ulRef.current!.style.flexDirection = "column";
      onInputChange(e);
    });
    document.addEventListener("click", (e) => {
      ulRef.current!.style.display = "none";
    });
  }, []);

  return (
    <div className="search-bar-dropdown">
      <input
        type="search"
        onChange={onInputChange}
        placeholder="Search ingredient..."
        ref={inputRef}
      />
      <input
        type="text"
        placeholder={unit}
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        required
      />
      <ul id="results" ref={ulRef}>
        {ingredients.map((ingredient) => {
          return (
            <button
              type="button"
              key={ingredient.id}
              onClick={(e) => {
                inputRef.current!.value = ingredient.label;
                setUnit(ingredient.unit);
                setNewIngredient(ingredient.label + ' (' + ingredient.unit + ')')
              }}
            >
              {ingredient.label}
            </button>
          );
        })}
      </ul>
      <button onClick={handleAdd} className="button">
        add
      </button>
      <p>
        Current ingredients:{" "}
        {addedIngredients.map((ingredient) => (
          <em key={ingredient}>{ingredient}; </em>
        ))}
      </p>
    </div>
  );
}
