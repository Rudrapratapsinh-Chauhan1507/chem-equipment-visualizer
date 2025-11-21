import React, { useEffect, useState } from "react";
import { fetchHistory } from "../api/api";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Trend = ({ token }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchHistory(token)
      .then((res) => setList(res.data))
      .catch(() => {});
  }, [token]);

  if (!list.length)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          color: "#555",
        }}
      >
        ⏳ Loading Trends...
      </div>
    );

  // Use filename as labels
  const labels = list.map((d) => d.file.split("/").pop());

  const flow = list.map((d) => d.summary.average_flowrate || 0);
  const pres = list.map((d) => d.summary.average_pressure || 0);
  const temp = list.map((d) => d.summary.average_temperature || 0);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        minHeight: "calc(100vh - 120px)", // allows page height adjust
        overflowY: "auto", // enables vertical scroll
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#003b6d",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        📈 Trend Analysis (Uploaded History)
      </h2>

      <div style={{ width: "100%", overflowX: "hidden" }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Flowrate",
                data: flow,
                borderColor: "#007bff",
                backgroundColor: "rgba(0,123,255,0.15)",
                tension: 0.3,
                borderWidth: 3,
              },
              {
                label: "Pressure",
                data: pres,
                borderColor: "#34c759",
                backgroundColor: "rgba(52,199,89,0.15)",
                tension: 0.3,
                borderWidth: 3,
              },
              {
                label: "Temperature",
                data: temp,
                borderColor: "#ff3b30",
                backgroundColor: "rgba(255,59,48,0.15)",
                tension: 0.3,
                borderWidth: 3,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Values" },
              },
              x: {
                title: { display: true, text: "Uploaded CSV Files" },
              },
            },
          }}
          height={350}
        />
      </div>
    </div>
  );
};

export default Trend;
