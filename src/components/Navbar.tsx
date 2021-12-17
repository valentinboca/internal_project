import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
// styles
import "./Navbar.css";

// import Searchbar from "./Searchbar";

export default function Navbar() {
  const { color, changeColor } = useTheme();

  return (
    <div className="navbar" style={{background: color}}>
      <nav onClick={() => {changeColor('pink')}}>
        <Link to="/" className="brand">
          <h1>Cook Book</h1>
        </Link>
        <Link to="/create">
          <h1>Create Recipe</h1>
        </Link>
      </nav>
    </div>
  );
}
