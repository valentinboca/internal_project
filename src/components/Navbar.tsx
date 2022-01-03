import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useLogut } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
// styles
import "./Navbar.css";
import Searchbar from "./SearchBar";

export default function Navbar() {
  const { color, changeColor } = useTheme();
  const { logout } = useLogut();
  const { user } = useAuthContext();

  return (
    <div className="navbar" style={{ background: color }}>
      {/* <nav
        onClick={() => {
          changeColor(color);
        }}
      ></nav> */}
      {/* <Link to="/" className="brand">
        <h1>Cook Book</h1>
      </Link> */}
      {/* 
        <Searchbar />
        <Link to="/create">
          <h1>Create Recipe</h1>
        </Link> */}

      {/* <Link className="btn" to="/login">
          <h1>Login</h1>
        </Link>

        <Link className="btn" to="/signup">
          <h1>Signup</h1>
        </Link> */}

      <ul>
        <Link className="brand" to="/">
          Cook Book
        </Link>
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <Link to="/create">Create Recipe</Link>
            </li>

            <li> hello, {user.displayName}</li>
            <li>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
