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
    page: {
      display: "flex",
      justifyContent: "center",
      padding: "40px 0",
      background: "#eef3f7",
      minHeight: "100vh",
    },
    card: {
      width: "900px",
      background: "#ffffff",
      borderRadius: "18px",
      padding: "35px 45px",
      boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
    },
    header: {
      textAlign: "center",
      color: "#003b6d",
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "25px",
      letterSpacing: "0.5px",
    },
    navBar: {
      display: "flex",
      justifyContent: "center",
      gap: "14px",
      marginBottom: "30px",
    },
    navBtn: {
      padding: "9px 24px",
      borderRadius: "10px",
      border: "none",
      fontWeight: 600,
      fontSize: "15px",
      cursor: "pointer",
      transition: "0.25s",
    },
    history: {
      backgroundColor: "#7ee6a1",
      color: "#08351d",
    },
    summary: {
      backgroundColor: "#5cc4fa",
      color: "#09313a",
      opacity: 1,
    },
    noSummary: {
      backgroundColor: "#5cc4fa",
      color: "#09313a",
      opacity: 0.4,
      cursor: "not-allowed",
    },
    uploadContainer: {
      background: "#f9fcff",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #cddce8",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      border: "1px solid #b7c4d1",
      borderRadius: "8px",
      padding: "10px 12px",
      fontSize: "15px",
    },
    uploadBtn: {
      width: "100%",
      background: "#296cad",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "13px 0",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "12px",
      transition: "0.25s",
    },
    success: {
      background: "#d6ffe9",
      padding: "10px",
      borderRadius: "8px",
      color: "#035a2d",
      marginTop: "12px",
      fontWeight: 600,
    },
    error: {
      background: "#ffd3d3",
      padding: "10px",
      borderRadius: "8px",
      color: "#a30000",
      marginTop: "12px",
      fontWeight: 600,
    },
    summaryBox: {
      marginTop: "35px",
      padding: "30px",
      background: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
    },
    summaryTitle: {
      textAlign: "center",
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#00385b",
    },
    charts: {
      display: "flex",
      justifyContent: "center",
      gap: "35px",
      flexWrap: "wrap",
      marginTop: "10px",
    },
    chartCard: {
      padding: "16px",
      background: "#fdfdfd",
      borderRadius: "14px",
      width: "270px",
      boxShadow: "0px 3px 10px rgba(0,0,0,0.07)",
    },
    label: {
      textAlign: "center",
      fontWeight: "600",
      marginTop: "8px",
      color: "#264355",
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
    <div style={styles.page}>
      <div style={styles.card}>
        <h3 style={styles.header}>Upload Equipment CSV</h3>

        <div style={styles.navBar}>
          <button style={{ ...styles.navBtn, ...styles.history }} onClick={onGoHistory}>
            History
          </button>

          <button
            style={
              summaryId ? { ...styles.navBtn, ...styles.summary } : { ...styles.navBtn, ...styles.noSummary }
            }
            onClick={() => summaryId && onGoSummary()}
          >
            Summary
          </button>
        </div>

        <div style={styles.uploadContainer}>
          <input type="file" accept=".csv" onChange={handleFileChange} style={styles.input} />
          <button style={styles.uploadBtn} onClick={handleUpload}>
            Upload & Analyze
          </button>
          {status && <div style={styles.success}>{status}</div>}
          {error && <div style={styles.error}>{error}</div>}
        </div>

        {summary && (
          <div style={styles.summaryBox}>
            <h4 style={styles.summaryTitle}>Equipment Analytics Summary</h4>

            <ul>
              <li>
                <b>Total Rows:</b> {summary.total_count}
              </li>
            </ul>

            <div style={styles.charts}>
              <div style={styles.chartCard}>
                <Bar data={chartBarData} options={{ plugins: { legend: { display: false } } }} />
                <div style={styles.label}>Type Distribution</div>
              </div>

              <div style={styles.chartCard}>
                <Doughnut data={chartDoughnutData} options={{ plugins: { legend: { position: "bottom" } } }} />
                <div style={styles.label}>Parameter Averages</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
