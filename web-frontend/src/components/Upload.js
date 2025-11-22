import React, { useState } from "react";
import { uploadCSV } from "../api/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Upload = ({ token, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState(null);

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

      const summaryData = res.data.summary ?? res.data;
      setSummary(summaryData);

      // send dataset info with ID
      if (res.data.id) onUpload(res.data);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Upload failed. Please try again."
      );
    }
  };

  let chartBarData = null, chartDoughnutData = null;
  const hasSummary = summary && summary.total_count;

  if (hasSummary) {
    const types = summary.type_distribution || {};
    chartBarData = {
      labels: Object.keys(types),
      datasets: [{
        label: "Count",
        data: Object.values(types),
        backgroundColor: ["#7C83F6","#B2C8DF","#D6E6F2","#FFF7FC","#5F6F94"]
      }]
    };

    chartDoughnutData = {
      labels: ["Flowrate", "Pressure", "Temperature"],
      datasets: [{
        label: "Average",
        data: [
          summary.average_flowrate ?? 0,
          summary.average_pressure ?? 0,
          summary.average_temperature ?? 0
        ],
        backgroundColor: ["#20CA7D","#F2C335","#E93A52"]
      }]
    };
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", background: "#eef3f7", minHeight: "100vh" }}>
      <div style={{ width: "900px", background: "#ffffff", borderRadius: "18px", padding: "35px 45px", boxShadow: "0px 6px 18px rgba(0,0,0,0.1)" }}>
        
        <h3 style={{ textAlign: "center", color: "#003b6d", fontSize: "28px", fontWeight: "700", marginBottom: "25px" }}>
          Upload Equipment CSV
        </h3>

        <div style={{ background: "#f9fcff", padding: "20px", borderRadius: "12px", border: "1px solid #cddce8", marginBottom: "20px" }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ width: "100%", border: "1px solid #b7c4d1", borderRadius: "8px", padding: "10px 12px", fontSize: "15px" }}
          />

          <button
            style={{ width: "100%", background: "#296cad", color: "white", border: "none", borderRadius: "10px", padding: "13px 0", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "12px" }}
            onClick={handleUpload}
          >
            Upload & Analyze
          </button>

          {status && <div style={{ background: "#d6ffe9", padding: "10px", borderRadius: "8px", color: "#035a2d", marginTop: "12px", fontWeight: 600 }}>{status}</div>}
          {error && <div style={{ background: "#ffd3d3", padding: "10px", borderRadius: "8px", color: "#a30000", marginTop: "12px", fontWeight: 600 }}>{error}</div>}
        </div>

        {hasSummary && (
          <div style={{ marginTop: "35px", padding: "30px", background: "#ffffff", borderRadius: "15px", boxShadow: "0px 4px 14px rgba(0,0,0,0.08)" }}>
            <h4 style={{ textAlign: "center", fontSize: "22px", fontWeight: 700, marginBottom: "20px", color: "#00385b" }}>Equipment Analytics Summary</h4>

            <ul><li><b>Total Rows:</b> {summary.total_count}</li></ul>

            <div style={{ display: "flex", justifyContent: "center", gap: "35px", flexWrap: "wrap", marginTop: "10px" }}>
              <div style={{ padding: "16px", background: "#fdfdfd", borderRadius: "14px", width: "270px", boxShadow: "0px 3px 10px rgba(0,0,0,0.07)" }}>
                <Bar data={chartBarData} options={{ plugins: { legend: { display: false }}}} />
                <div style={{ textAlign: "center", fontWeight: "600", marginTop: "8px", color: "#264355" }}>Type Distribution</div>
              </div>

              <div style={{ padding: "16px", background: "#fdfdfd", borderRadius: "14px", width: "270px", boxShadow: "0px 3px 10px rgba(0,0,0,0.07)" }}>
                <Doughnut data={chartDoughnutData} options={{ plugins: { legend: { position: "bottom" }}}} />
                <div style={{ textAlign: "center", fontWeight: "600", marginTop: "8px", color: "#264355" }}>Parameter Averages</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Upload;
