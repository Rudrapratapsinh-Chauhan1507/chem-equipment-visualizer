import React, { useState } from "react";
import { register } from "../api/api"; // You need to add a register method similar to login in api.js

const Register = ({ onRegister, onShowLogin }) => {
  const [data, setData] = useState({ first_name: "", last_name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await register(data);
      setSuccess("Registration successful!");
      setTimeout(() => {
        onRegister(res.data.token);
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="app-container">
      <h2 style={{textAlign: "center"}}>Register</h2>
      {error && <div className="messages">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={data.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={data.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <div className="link">
        Already have an account?{" "}
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
          onClick={onShowLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
