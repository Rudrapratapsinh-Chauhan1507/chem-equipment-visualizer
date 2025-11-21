import React, { useEffect, useState } from "react";
import { fetchSummary } from "../api/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Summary = ({ id, token }) => {
  const [data, setData] = useState();
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id || !token) return;
    fetchSummary(id, token)
      .then((res) => setData(res.data))
      .catch(() => setErr("Error loading summary."));
  }, [id, token]);

  // 📌 Generate Summary CSV & Download
  const downloadSummaryCSV = () => {
    if (!data) return;

    let rows = [
      ["Feature", "Value"],
      ["Total Rows", data.total_count],
      ["Average Flowrate", data.average_flowrate],
      ["Average Pressure", data.average_pressure],
      ["Average Temperature", data.average_temperature],
      ["---- Equipment Type Distribution ----", ""],
    ];

    Object.entries(data.type_distribution).forEach(([type, count]) => {
      rows.push([type, count]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `summary_dataset_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "35px 25px",
      background: "#ffffff",
      marginTop: "35px",
      borderRadius: "16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    },
    title: {
      textAlign: "center",
      fontSize: "22px",
      fontWeight: 700,
      color: "#00375a",
      marginBottom: "18px",
    },
    detailList: {
      lineHeight: "2",
      fontSize: "1.05rem",
      color: "#1d374b",
      marginBottom: "20px",
    },
    chartRow: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "40px",
      marginTop: "10px",
    },
    chartBox: {
      width: "300px",
      minHeight: "220px",
      padding: "14px",
      background: "#f9fcff",
      borderRadius: "14px",
      boxShadow: "0px 3px 10px rgba(0,0,0,0.07)",
    },
    chartTitle: {
      textAlign: "center",
      marginBottom: "8px",
      color: "#00375a",
      fontWeight: "600",
    },
    loading: {
      textAlign: "center",
      padding: "12px",
      background: "#eaf2ff",
      borderRadius: "8px",
      color: "#003370",
      fontWeight: "600",
      maxWidth: "350px",
      margin: "50px auto",
    },
    error: {
      textAlign: "center",
      padding: "12px",
      background: "#ffd3d3",
      borderRadius: "8px",
      color: "#8a0000",
      fontWeight: "600",
      maxWidth: "350px",
      margin: "50px auto",
    },
    btn: {
      padding: "8px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      background: "#296cad",
      color: "white",
      marginBottom: "15px",
    },
  };

  if (!id) return null;
  if (err) return <div style={styles.error}>{err}</div>;
  if (!data) return <div style={styles.loading}>Loading summary...</div>;

  // 📊 Charts Data
  const typeLabels = Object.keys(data.type_distribution);
  const typeCounts = Object.values(data.type_distribution);
  const avgLabels = ["Flowrate", "Pressure", "Temperature"];
  const avgValues = [
    data.average_flowrate,
    data.average_pressure,
    data.average_temperature,
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Summary for Dataset #{id}</h3>

      {/* ✔ CSV Button ONLY */}
      <div style={{ textAlign: "center" }}>
        <button style={styles.btn} onClick={downloadSummaryCSV}>
          ⬇ Download Summary CSV
        </button>
      </div>

      <ul style={styles.detailList}>
        <li><b>Total rows:</b> {data.total_count}</li>
      </ul>

      <div style={styles.chartRow}>
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Type Distribution</h4>
          <Bar
            data={{
              labels: typeLabels,
              datasets: [
                {
                  label: "Count",
                  data: typeCounts,
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
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Parameter Averages</h4>
          <Doughnut
            data={{
              labels: avgLabels,
              datasets: [
                {
                  label: "Average",
                  data: avgValues,
                  backgroundColor: ["#5dc3f7", "#ffb45e", "#81e291"],
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
