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
    <div style={{ background: "#eef3f7", minHeight: "100vh" }}>
      <nav
        style={{
          background: "linear-gradient(135deg, #1f6396, #296cad)",
          color: "white",
          padding: "16px 32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomLeftRadius: "14px",
          borderBottomRightRadius: "14px",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <div style={{ fontWeight: "700", fontSize: "1.25em", letterSpacing: "0.6px" }}>
          Chem Equipment Visualizer
        </div>

        {token && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                background: "#ffffff",
                color: "#1f6396",
                border: "none",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.25s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#e8f3ff")}
              onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              onClick={handleLogout}
            >
              Logout
            </button>

            <button
              style={{
                background: "#5dc3f7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.25s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
              onClick={goToUpload}
            >
              Upload
            </button>

            <button
              style={{
                background: "#81e291",
                color: "#185a34",
                border: "none",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.25s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
              onClick={goToHistory}
            >
              History
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <div style={{ paddingBottom: "35px" }}>
        {content}
      </div>
    </div>
  );

}

export default App;
