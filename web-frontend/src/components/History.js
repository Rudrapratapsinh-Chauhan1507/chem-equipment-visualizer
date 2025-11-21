import React, { useEffect, useState } from "react";
import { fetchHistory } from "../api/api";

const History = ({ token, onSelect }) => {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchHistory(token)
      .then((res) => setList(res.data))
      .catch(() => setErr("Failed to load history."));
  }, [token]);

  const styles = {
    container: {
      maxWidth: "650px",
      margin: "0 auto",
      padding: "30px 25px",
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
      marginTop: "35px",
    },
    title: {
      textAlign: "center",
      fontSize: "22px",
      fontWeight: 700,
      color: "#00375a",
      marginBottom: "20px",
    },
    message: {
      background: "#ffd3d3",
      color: "#8a0000",
      padding: "10px 14px",
      borderRadius: "8px",
      fontWeight: "600",
      marginBottom: "14px",
      textAlign: "center",
    },
    list: {
      listStyle: "none",
      padding: 0,
      marginTop: "10px",
    },
    button: {
      width: "100%",
      background: "#81e291",
      color: "#16301c",
      fontWeight: 600,
      border: "none",
      borderRadius: "10px",
      padding: "12px",
      cursor: "pointer",
      fontSize: "15px",
      transition: "0.25s",
    },
    buttonHover: {
      background: "#6ad27e",
    },
    listItem: {
      marginBottom: "12px",
    },
    datasetTag: {
      color: "#2d5f3a",
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📁 Last 5 Uploaded Datasets</h3>

      {err && <div style={styles.message}>{err}</div>}

      <ul style={styles.list}>
        {list.map((entry) => (
          <li key={entry.id} style={styles.listItem}>
            <button
              style={styles.button}
              onMouseOver={(e) => (e.target.style.background = "#6ad27e")}
              onMouseOut={(e) => (e.target.style.background = "#81e291")}
              onClick={() => onSelect(entry.id)}
            >
              <span style={styles.datasetTag}>Dataset #{entry.id}</span> —{" "}
              {entry.upload_time.slice(0, 19).replace("T", " ")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
