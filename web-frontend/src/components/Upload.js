import React, { useState } from "react";
import { uploadCSV } from "../api/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Upload = ({ token, onGoHistory, onGoSummary, summaryId }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState(null);

  const styles = {
    container: {
      padding: "40px 30px",
      maxWidth: "850px",
      margin: "0 auto",
      background: "#f5f8fb",
      borderRadius: "14px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    },
    title: {
      textAlign: "center",
      color: "#234f7e",
      fontSize: "26px",
      letterSpacing: "1px",
      marginBottom: "25px",
      fontWeight: "700",
    },
    navButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "18px",
      marginBottom: "22px",
    },
    navButton: {
      border: "none",
      borderRadius: "8px",
      padding: "10px 24px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "15px",
    },
    historyBtn: {
      backgroundColor: "#7ee6a1",
      color: "#08351d",
    },
    summaryBtn: {
      backgroundColor: "#5cc4fa",
      color: "#083930",
    },
    fileBlock: {
      marginBottom: "16px",
      background: "#fff",
      padding: "18px",
      borderRadius: "10px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
    },
    fileInput: {
      border: "1px solid #c9c9c9",
      borderRadius: "6px",
      padding: "7px",
      width: "100%",
    },
    uploadBtn: {
      background: "#296cad",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "12px 22px",
      fontWeight: 600,
      marginTop: "14px",
      width: "100%",
      cursor: "pointer",
      fontSize: "16px",
    },
    messageSuccess: {
      marginTop: "12px",
      padding: "10px",
      background: "#d7f8e5",
      borderRadius: "6px",
      color: "#0d5e2c",
      fontWeight: "600",
    },
    messageError: {
      marginTop: "12px",
      padding: "10px",
      background: "#ffd4d4",
      borderRadius: "6px",
      color: "#a10000",
      fontWeight: "600",
    },
    summaryContainer: {
      marginTop: "35px",
      background: "#ffffff",
      padding: "28px",
      borderRadius: "14px",
      boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
    },
    summaryTitle: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "22px",
      fontWeight: 700,
      color: "#1d425f",
    },
    list: {
      listStyle: "none",
      paddingLeft: 0,
      fontSize: "1.05rem",
      lineHeight: "1.9",
    },
    chartsRow: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "35px",
      marginTop: "20px",
    },
    chartCard: {
      background: "#ffffff",
      padding: "18px",
      width: "270px",
      borderRadius: "14px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },
    chartLabel: {
      textAlign: "center",
      marginTop: "8px",
      fontSize: "0.98em",
      fontWeight: "600",
      color: "#27445c",
    },
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setStatus("");
    setSummary(null);
  };

  const handleUpload = async () => {
    setError("");
    setStatus("");
    setSummary(null);

    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }
    try {
      const res = await uploadCSV(file, token);
      setStatus("File uploaded and analyzed successfully!");
      setSummary(res.data.summary || res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Upload failed. Please try again."
      );
    }
  };

  let chartBarData = null,
    chartDoughnutData = null;

  if (summary && summary.type_distribution && summary.average_flowrate) {
    chartBarData = {
      labels: Object.keys(summary.type_distribution),
      datasets: [
        {
          label: "Count",
          data: Object.values(summary.type_distribution),
          backgroundColor: ["#7C83F6", "#B2C8DF", "#D6E6F2", "#FFF7FC", "#5F6F94"],
        },
      ],
    };

    chartDoughnutData = {
      labels: ["Flowrate", "Pressure", "Temperature"],
      datasets: [
        {
          label: "Average",
          data: [
            summary.average_flowrate,
            summary.average_pressure,
            summary.average_temperature,
          ],
          backgroundColor: ["#20CA7D", "#F2C335", "#E93A52"],
        },
      ],
    };
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Upload Equipment CSV</h3>

      <div style={styles.navButtons}>
        <button style={{ ...styles.navButton, ...styles.historyBtn }} onClick={onGoHistory}>
          History
        </button>

        <button
          style={{
            ...styles.navButton,
            ...styles.summaryBtn,
            cursor: summaryId ? "pointer" : "not-allowed",
            opacity: summaryId ? 1 : 0.6,
          }}
          onClick={() => summaryId && onGoSummary()}
        >
          Summary
        </button>
      </div>

      <div style={styles.fileBlock}>
        <input type="file" accept=".csv" onChange={handleFileChange} style={styles.fileInput} />

        <button style={styles.uploadBtn} onClick={handleUpload}>
          Upload & Analyze
        </button>

        {status && <div style={styles.messageSuccess}>{status}</div>}
        {error && <div style={styles.messageError}>{error}</div>}
      </div>

      {summary && (
        <div style={styles.summaryContainer}>
          <h4 style={styles.summaryTitle}>Equipment Analytics Summary</h4>

          <ul style={styles.list}>
            <li>
              <b>Total rows:</b> {summary.total_count}
            </li>
          </ul>

          <div style={styles.chartsRow}>
            <div style={styles.chartCard}>
              <Bar data={chartBarData} options={{ plugins: { legend: { display: false } } }} />
              <div style={styles.chartLabel}>Type Distribution</div>
            </div>

            <div style={styles.chartCard}>
              <Doughnut
                data={chartDoughnutData}
                options={{ plugins: { legend: { position: "bottom" } } }}
              />
              <div style={styles.chartLabel}>Parameter Averages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
