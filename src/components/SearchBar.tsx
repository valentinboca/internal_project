import "./Searchbar.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { projectRecipeBook } from "../firebase/config";

export default function Searchbar() {
  const [term, setTerm] = useState<string>("");
  const navigate = useNavigate();

  // to be added 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setTerm(e.target.value);
  };

  return (
    <div className="searchbar">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Search:</label>
        <input type="text" id="search" onChange={handleChange} required />
      </form>
    </div>
  );
}
