import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import History from "./components/History";
import Summary from "./components/Summary";
import "./App.css";

function App() {
  const [mode, setMode] = useState("login"); // Controls which "page" is shown
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [selectedId, setSelectedId] = useState(null);
  const [lastUploadedId, setLastUploadedId] = useState(null);

  // Handle login/register success
  const handleLogin = tk => {
    localStorage.setItem("token", tk);
    setToken(tk);
    setMode("upload");
  };
  const handleRegister = tk => {
    localStorage.setItem("token", tk);
    setToken(tk);
    setMode("upload");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMode("login");
    setSelectedId(null);
    setLastUploadedId(null);
  };

  // Handle navigation between pages
  const goToRegister = () => setMode("register");
  const goToLogin = () => setMode("login");
  const goToUpload = () => setMode("upload");
  const goToHistory = () => setMode("history");
  const goToSummary = () => {
    if (lastUploadedId || selectedId) {
      setMode("summary");
    }
  };

  // Pass lastUploadedId when Upload finishes
  const onUploadAnalytics = data => {
    setLastUploadedId(data.id || null);
    setSelectedId(data.id || null);
  };

  // Choose which page to show
  let content;
  if (!token) {
    content = mode === "register"
      ? <Register onRegister={handleRegister} onShowLogin={goToLogin}/>
      : <Login onLogin={handleLogin} onShowRegister={goToRegister}/>;
  } else if (mode === "upload") {
    content = (
      <Upload
        token={token}
        onGoHistory={goToHistory}
        onGoSummary={goToSummary}
        summaryId={lastUploadedId}
        onUpload={onUploadAnalytics}
      />
    );
  } else if (mode === "history") {
    content = (
      <History
        token={token}
        onSelect={id => {
          setSelectedId(id);
          setLastUploadedId(id);
          setMode("summary");
        }}
      />
    );
  } else if (mode === "summary") {
    content = (
      <Summary
        id={lastUploadedId || selectedId}
        token={token}
      />
    );
  }

  // Top navigation bar
  return (
    <div>
      <nav
        style={{
          background: "#296cad",
          color: "white",
          padding: "16px 32px",
          borderRadius: "0 0 10px 10px",
          marginBottom: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{fontWeight: "bold", fontSize: "1.15em"}}>
          Chem Equipment Visualizer
        </div>
        {token && (
          <div>
            <button
              style={{
                background: "#fff",
                color: "#296cad",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              style={{
                background: "#5dc3f7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer",
                marginLeft: "18px"
              }}
              onClick={goToUpload}
            >
              Upload
            </button>
            <button
              style={{
                background: "#81e291",
                color: "#185a34",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer",
                marginLeft: "7px"
              }}
              onClick={goToHistory}
            >
              History
            </button>
          </div>
        )}
      </nav>
      {content}
    </div>
  );
}

export default App;
