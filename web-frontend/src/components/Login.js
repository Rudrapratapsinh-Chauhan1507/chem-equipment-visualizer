import React, { useState } from "react";
import { login } from "../api/api";

const Login = ({ onLogin, onShowRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(username, password);
      onLogin(res.data.token);
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="app-container">
      <h2 style={{textAlign: "center"}}>Login</h2>
      {error && <div className="messages">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="link">
        Don't have an account?{" "}
        <button
          type="button"
          style={{
            background: "none",
            color: "#296cad",
            border: "none",
            textDecoration: "underline",
            fontWeight: "500",
            cursor: "pointer",
            padding: 0
          }}
          onClick={onShowRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
