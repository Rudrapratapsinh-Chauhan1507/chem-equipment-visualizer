import React from "react";

const Navbar = ({ onLogout }) => (
  <div style={{
    background: "#296cad", color: "white", padding: 12,
    display: "flex", justifyContent: "space-between", alignItems: "center"
  }}>
    <span style={{ fontWeight: "bold" }}>Chemical Equipment Visualizer</span>
    <button style={{ background: "white", color: "#296cad", border: "none", borderRadius: 3, padding: "4px 12px" }} onClick={onLogout}>Logout</button>
  </div>
);

export default Navbar;
