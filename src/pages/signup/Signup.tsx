import "./Signup.css";
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup(email, password, displayName);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
        <label>
          <span>email:</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>password:</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="on"
          />
        </label>
        <label>
          <span>display name:</span>
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        {!isPending && <button className="btn">Signup</button>}
        {isPending && (
          <button className="btn" disabled>
            loading
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
