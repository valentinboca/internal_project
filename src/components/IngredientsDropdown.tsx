import "./IngredientsDropdown.css";
import { useEffect } from "react";
import { useRef } from "react";

export default function IngredientsDropdown({
  ingredients,
  onInputChange,
}: {
  ingredients: any[];
  onInputChange: any;
}) {
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.addEventListener("click", (e) => {
        e?.stopPropagation()
        console.log('clicked')
        ulRef.current!.style.display = 'flex'
        onInputChange(e)
    });
    document.addEventListener("click", (e) => {
        console.log('ul    ',ulRef.current)
        ulRef.current!.style.display = 'none'
    });
  }, []);

  return (
    <div className="search-bar-dropdown">
      <input
        type="text"
        onChange={onInputChange}
        placeholder="Search ingredient..."
        ref={inputRef}
      />
      <ul id="results" ref={ulRef}>
        {ingredients.map((ingredient) => {
          return (
            <button type="button" key={ingredient.id} onClick={e => {
                inputRef.current!.value = ingredient
            }}>
              {ingredient.label}
            </button>
          );
        })}
      </ul>
    </div>
  );
}
