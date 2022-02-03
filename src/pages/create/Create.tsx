// styles
import "./Create.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { projectRecipeBook } from "../../firebase/config";
import { useFireStore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import React, { Component } from "react";
import Select from "react-select";
import Creatable, { useCreatable } from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";
import ValueType from "react-select";

export default function Create({}) {
  const [title, setTitle] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<string>("");
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const ingredientInput = useRef<HTMLHeadingElement>(null);
  const { addRecipe, response } = useFireStore("recipes");
  const { addIngredient } = useFireStore("ingredients");
  const { addIngredient1 } = useFireStore("ingredients");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [ingredientsFromDB, setIngredientsFromDB] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, method, cookingTime, ingredients);
    addRecipe({
      uid: user.uid,
      title,
      ingredients,
      method,
      cookingTime: cookingTime + " minutes",
    });
    navigate("/");
  };

  const handleAdd = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // const ing = newIngredient.trim();

    // if (ing && !ingredients.includes(ing)) {
    //   setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    //   addIngredient({ ingredient: ing });
    // }

    // setNewIngredient("");
    // if (null !== ingredientInput.current) {
    //   ingredientInput.current.focus();
    // }
  };

  interface Option {
    label: string;
    value: string;
  }

  const handleCreateIngredient = (v: any): v is Option => {
    if ((v as Option).value !== undefined) return v.value;
    return false;
  };

  const handleChange1 = (inputValue: any) => console.log(inputValue);
  // addIngredient1({ value: newIngredient.toLowerCase(), label: newIngredient.charAt(0).toUpperCase() + newIngredient.slice(1)});

  useEffect(() => {
    if (response.success) {
      setTitle("");
      setMethod("");
      setCookingTime("");
    }
  }, [response.success]);

  type LoadAllIngredients = () => void;

  const loadAllIngredients: LoadAllIngredients = () => {
    const unsubscribe = projectRecipeBook.collection("ingredients").onSnapshot(
      (snapshot) => {
        let results: any = [];
        snapshot.docs.forEach((doc) => {
          results.push(doc.data());
        });

        // update state
        setIngredientsFromDB(results);
      },
      (error) => {
        console.log(error);
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  };

  useEffect(() => {
    loadAllIngredients();
  }, []);

  return (
    <div className="create">
      <Creatable
        isClearable
        onChange={async (v) => {
          if (handleCreateIngredient(v)) {
            // const snapshot = await projectRecipeBook
            //   .collection("ingredients")
            //   .get();
            // let docRef = projectRecipeBook
            //   .collection("ingredients")
            //   .doc(v.value);
            // docRef.get().then((doc) => {
            //   console.log("ddad", doc.data());
            //   if (doc.exists) {
            //     addIngredient1({ value: v.value, label: v.value });
            //   }
            // });
            addIngredient1({ value: v.value, label: v.value });
          }
        }}
        // onInputChange={handleChange}
        options={ingredientsFromDB}
      />
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
