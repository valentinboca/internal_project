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
import IngredientsDropdown from "../../components/IngredientsDropdown";

export default function Create({}) {
  const [title, setTitle] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<string>("");
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const ingredientInput = useRef<HTMLHeadingElement>(null);
  const { addRecipe, response } = useFireStore("recipes");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [ingredientsFromDB, setIngredientsFromDB] = useState<string[]>([]);
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState<string>("unit");
  const [quantity, setQuantity] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);

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

  // const handleCreateIngredient = (v: any): v is Option => {
  //   if ((v as Option).value !== undefined) return v.value;
  //   return false;
  // };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const term = e.target.value;
    const unsubscribe = projectRecipeBook
      .collection("ingredients")
      .orderBy("label")
      .startAt(term)
      .endAt(term + "\uf8ff")
      .onSnapshot(
        (snapshot) => {
          let results: any = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // update state
          setOptions(results);
          console.log(results);
        },
        (error) => {
          console.log(error);
        }
      );

    // unsubscribe on unmount
    return () => unsubscribe();
  };

  const handleAdd = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const duplicateIngredient = ingredients.find((a) =>
      a.includes(newIngredient)
    );
    const ing = newIngredient.split(" ")[0];

    if (ing && !duplicateIngredient) {
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        newIngredient + " " + quantity,
      ]);
    }

    inputRef.current!.value = "";
    setQuantity("");
    setUnit("unit");
    if (null !== inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    inputRef.current?.addEventListener("click", (e) => {
      e?.stopPropagation();
      ulRef.current!.style.display = "flex";
      ulRef.current!.style.flexDirection = "column";
      // onInputChange(e);
      const x = (e.target as HTMLTextAreaElement).value;
      const unsubscribe = projectRecipeBook
        .collection("ingredients")
        .orderBy("label")
        .startAt(x)
        .endAt(x + "\uf8ff")
        .onSnapshot(
          (snapshot) => {
            let results: any = [];
            snapshot.docs.forEach((doc) => {
              results.push({ ...doc.data(), id: doc.id });
            });

            // update state
            setOptions(results);
          },
          (error) => {
            console.log(error);
          }
        );

      // unsubscribe on unmount
      return () => unsubscribe();
    });
    document.addEventListener("click", (e) => {
      ulRef.current!.style.display = "none";
    });
  }, []);

  return (
    <div className="create">
      {/* <IngredientsDropdown ingredients={options} onInputChange={handleChange} /> */}
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

        <label className="search-bar-dropdown">
          <span>Recipe ingredients:</span>
          <input
            type="search"
            onChange={handleChange}
            placeholder="Search ingredient..."
            ref={inputRef}
          />
          <ul id="results" ref={ulRef}>
            {options.map((option) => {
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={(e) => {
                    inputRef.current!.value = option.label;
                    setUnit(option.unit);
                    setNewIngredient(option.label + " (" + option.unit + ")");
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </ul>
          <input
            type="text"
            placeholder={unit}
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
          />
          <button onClick={handleAdd} className="button">
            add
          </button>
          <p>
            Current ingredients:{" "}
            {ingredients.map((ingredient) => (
              <em key={ingredient}>{ingredient}; </em>
            ))}
          </p>
        </label>

        {/* <label>
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
        </p> */}

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
        {/* <Creatable
        isClearable
        onChange={async (v) => {
          if (handleCreateIngredient(v)) {
            console.log(v.value)
            const ref = projectRecipeBook.collection("ingredients");
            // const snapshot = await projectRecipeBook
            //   .collection("ingredients")
            //   .get();
            // let docRef = projectRecipeBook
            //   .collection("ingredients")
            //   .where("label", "!=", v.label)
            // docRef.get().then((doc) => {
            //   console.log("ddad", doc);
            //   // if (doc.exists) {
            //   //   addIngredient1({ value: v.value, label: v.value });
            //   // }
            // });
            ref
              .where("label", "==", v.label)
              .get()
              // .then((doc) => {
              //   // for (var i = 0; i < doc.docs.length; i++) {
              //   //   // console.log(doc.docs[i].data().label)
              //   //   // console.log(doc.docs[i].data().label !== v.label)
              //   //   let x = doc.docs[i].data().label
              //   //   console.log(x)
              //   //   if (doc.docs[i].data().label !== v.label) {
              //   //     // addIngredient1({
              //   //     //   value: v.value.toLowerCase(),
              //   //     //   label: v.value.charAt(0).toUpperCase() + v.value.slice(1),
              //   //     // });
              //   //   }
              //   // }
              //   console.log(doc.docs.length)
              // });
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(!doc.exists)
                  if (doc.exists) {
                    addIngredient1({
                      value: v.value.toLowerCase(),
                      label: v.value.charAt(0).toUpperCase() + v.value.slice(1),
                    });
                  }
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
            // .onSnapshot(
            //   (snapshot) => {
            //     console.log("ss", snapshot.docs);
            //     snapshot.docs.forEach((doc) => {
            //        console.log("aici e ", doc.data());
            //        console.log("ce scriu e ", v.label);
            //       console.log(doc.data().label != v.label)
            //       // addIngredient1({
            //       //   value: v.value.toLowerCase(),
            //       //   label:
            //       //     v.value.charAt(0).toUpperCase() + v.value.slice(1),
            //       // });
            //       // if (doc.data().label === v.label) {
            //       //   addIngredient1({
            //       //     value: v.value.toLowerCase(),
            //       //     label:
            //       //       v.value.charAt(0).toUpperCase() + v.value.slice(1),
            //       //   });
            //       // }
            //       // console.log('daca e' , doc.data().label)
            //     });

            //     // update state
            //   },
            //   (error) => {
            //     console.log(error);
            //   }
            // );
            //   const doc = await ref.doc('02Zbp8SIpCSRLWLLNlrW')
            //   doc.get().then((doc) => {
            //     if (doc.exists) {
            //         console.log("Document data:", doc.data());
            //     } else {
            //         // doc.data() will be undefined in this case
            //         console.log("No such document!");
            //     }
            // }).catch((error) => {
            //     console.log("Error getting document:", error);
            // });
            //   if (1 > 2) {
            // addIngredient1({ value: v.value.toLowerCase(), label: v.value.charAt(0).toUpperCase() + v.value.slice(1) });
            // }
          }
        }}
        // onInputChange={handleChange}
        options={ingredientsFromDB}
      /> */}
      </form>
    </div>
  );
}
