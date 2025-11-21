import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import HistorySummary from "./components/HistorySummary";
import Trend from "./components/Trend";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);
    setMode("upload");
  };

  const handleRegister = handleLogin;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMode("login");
  };

  const onUpload = () => {
    setMode("history"); // ⬅ jump directly to history+summary page
  };

  return (
    <div style={{ background: "#eef3f7", minHeight: "100vh" }}>

      <Navbar
        token={token}
        onLogout={handleLogout}
        onUpload={() => setMode("upload")}
        onHistory={() => setMode("history")}
        onTrend={() => setMode("trend")}
      />

      <div style={{ paddingBottom: "35px" }}>
        {!token && (
          mode === "register"
            ? <Register onRegister={handleRegister} onShowLogin={() => setMode("login")} />
            : <Login onLogin={handleLogin} onShowRegister={() => setMode("register")} />
        )}

        {token && mode === "upload" && <Upload token={token} onUpload={onUpload} />}
        {token && mode === "history" && <HistorySummary token={token} />}
        {token && mode === "trend" && <Trend token={token} />}
      </div>

    </div>
  );
}

export default App;
