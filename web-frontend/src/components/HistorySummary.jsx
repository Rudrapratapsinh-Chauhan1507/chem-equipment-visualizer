import React, { useEffect, useState } from "react";
import { fetchHistory, fetchSummary, deleteDataset } from "../api/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const HistorySummary = ({ token }) => {
  const [historyList, setHistoryList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [summary, setSummary] = useState(null);

  // Fetch history list
  useEffect(() => {
    fetchHistory(token)
      .then((res) => setHistoryList(res.data))
      .catch(() => {});
  }, [token]);

  // Fetch summary when any dataset is selected
  useEffect(() => {
    if (!selectedId) return;
    fetchSummary(selectedId, token)
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
  }, [selectedId, token]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
      {/* LEFT SIDEBAR HISTORY */}
      <div
        style={{
          width: "260px",
          background: "#f1f4f7",
          borderRight: "2px solid #d6dce3",
          padding: "14px",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: "12px", color: "#1f6396", fontWeight: "700" }}>
          📄 History
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {historyList.map((h) => (
            <li key={h.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {/* SELECT ITEM BUTTON */}
                <button
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    background:
                      selectedId === h.id ? "#296cad" : "#81e291",
                    color:
                      selectedId === h.id ? "white" : "#185a34",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                  onClick={() => setSelectedId(h.id)}
                >
                  {h.file.split("/").pop()}
                  <br />
                  <small style={{ fontSize: "11px" }}>
                    {h.upload_time.slice(0, 10)}
                  </small>
                </button>

                {/* DELETE ICON BUTTON */}
                <button
                title="Delete Dataset"
                onClick={() => {
                    if (window.confirm("Delete this dataset?")) {
                    deleteDataset(h.id, token).then(() => {
                        if (selectedId === h.id) {
                        setSelectedId(null);
                        setSummary(null);
                        }
                        setHistoryList(historyList.filter(x => x.id !== h.id));
                    });
                    }
                }}
                style={{
                    padding: "6px",
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.25s",
                }}
                onMouseOver={(e) => (e.target.style.background = "#d63434")}
                onMouseOut={(e) => (e.target.style.background = "#ff4d4d")}
                >
                🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SUMMARY PANEL */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {!selectedId && (
          <div
            style={{
              textAlign: "center",
              marginTop: "60px",
              fontSize: "18px",
              color: "#555",
            }}
          >
            👈 Select a dataset from history
          </div>
        )}

        {selectedId && summary && (
          <div>
            <h2 style={{ marginBottom: "10px", color: "#003b6d" }}>
              📊 Dataset Summary
            </h2>

            <p style={{ fontSize: "16px" }}>
              <b>Total Rows:</b> {summary.total_count}
            </p>

            {/* CHARTS */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "30px",
                marginTop: "15px",
              }}
            >
              {/* Type Distribution */}
              <div style={{ width: "300px" }}>
                <h4>Type Distribution</h4>
                <Bar
                  data={{
                    labels: Object.keys(summary.type_distribution),
                    datasets: [
                      {
                        label: "Count",
                        data: Object.values(summary.type_distribution),
                        backgroundColor: [
                          "#296cad",
                          "#5dc3f7",
                          "#81e291",
                          "#ffb45e",
                          "#ff5779",
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>

              {/* Parameter Averages */}
              <div style={{ width: "300px" }}>
                <h4>Parameter Averages</h4>
                <Doughnut
                  data={{
                    labels: ["Flowrate", "Pressure", "Temperature"],
                    datasets: [
                      {
                        data: [
                          summary.average_flowrate,
                          summary.average_pressure,
                          summary.average_temperature,
                        ],
                        backgroundColor: ["#5dc3f7", "#ffb45e", "#81e291"],
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySummary;
