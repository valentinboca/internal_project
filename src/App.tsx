import React from "react";
import "./App.css";
import { Home } from "./pages/home/Home";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import ThemeSelector from "./components/ThemeSelector";
import Create from "./pages/create/Create";
import Recipe from "./pages/recipe/Recipe";
import Search from "./pages/search/Search";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import Searchbar from "./components/SearchBar";

function App() {
  const { mode }: any = useTheme();
  const { authIsReady, user }: any = useAuthContext();

  return (
    <div className={`App ${mode}`}>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <ThemeSelector />
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate replace to="/login" />}
            />

            <Route path="/" />
            <Route
              path="/create"
              element={!user ? <Navigate replace to="/login" /> : <Create />}
            />
            <Route
              path="/recipes/:id"
              element={!user ? <Navigate replace to="/login" /> : <Recipe />}
            />
            <Route path="/search" element={<Search />} />
            <Route
              path="/login"
              element={user ? <Navigate replace to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate replace to="/" /> : <Signup />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
