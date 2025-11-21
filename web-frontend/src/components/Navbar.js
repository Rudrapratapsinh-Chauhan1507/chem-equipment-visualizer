import React from "react";

const Navbar = ({ onLogout, onUpload, onHistory, onTrend, token }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #1f6396, #296cad)",
      color: "white",
      padding: 16,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      borderBottomLeftRadius: "14px",
      borderBottomRightRadius: "14px",
      position: "sticky",
      top: 0,
      zIndex: 999,
    }}
  >
    <span style={{ fontWeight: "700", fontSize: "1.25em", letterSpacing: "0.6px" }}>
      Chem Equipment Visualizer
    </span>

    {token && (
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          style={btn("#ffffff", "#1f6396")}
          onClick={onUpload}
        >
          Upload
        </button>

        <button
          style={btn("#81e291", "#185a34")}
          onClick={onHistory}
        >
          History
        </button>

        <button
          style={btn("#b48cf7", "#fff")}
          onClick={onTrend}
        >
          Trend
        </button>

        <button
          style={btn("#ff7b7b", "white")}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

const btn = (bg, color) => ({
  background: bg,
  color: color,
  border: "none",
  borderRadius: "8px",
  padding: "8px 18px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.25s",
});

export default Navbar;
