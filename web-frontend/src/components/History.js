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

  return (
    <div className="app-container">
      <h3 style={{textAlign:"center"}}>Last 5 Uploaded Datasets</h3>
      {err && <div className="messages">{err}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {list.map((entry) => (
          <li key={entry.id} style={{ margin: "12px 0" }}>
            <button
              style={{
                width: "100%",
                background: "#81e291",
                color: "#16301c",
                fontWeight: 600
              }}
              onClick={() => onSelect(entry.id)}
            >
              Dataset #{entry.id} ({entry.upload_time.slice(0, 19).replace("T", " ")})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
