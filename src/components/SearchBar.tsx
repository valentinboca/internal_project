import "./Searchbar.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { projectRecipeBook } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";
import { Query } from "@firebase/firestore-types";
import RecipeList from "./RecipeList";
import React from "react";

export default function Searchbar() {
  const { user } = useAuthContext();
  const [term, setTerm] = useState<string>("");
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // to be added
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    console.log(e.target.value);
    setTerm(e.target.value);
    const unsubscribe = projectRecipeBook
      .collection("recipes")
      .where("title".toLowerCase(), "==", e.target.value.toLowerCase())
      .where("uid", "==", user.uid)
      .onSnapshot(
        (snapshot) => {
          let results: any = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // update state
          setDocuments(results);
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
    <div className="searchbar">
      <div>
        <label htmlFor="search">Search:</label>
        <input type="search" id="search" onChange={handleChange} required />
      </div>
      {documents && <RecipeList recipes={documents} />}
    </div>
  );
}
