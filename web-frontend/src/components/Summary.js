import React, { useEffect, useState } from "react";
import { fetchSummary } from "../api/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const Summary = ({ id, token }) => {
  const [data, setData] = useState();
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id || !token) return;
    fetchSummary(id, token)
      .then((res) => setData(res.data))
      .catch(() => setErr("Error loading summary."));
  }, [id, token]);

  if (!id) return null;
  if (err) return <div className="app-container"><div className="messages">{err}</div></div>;
  if (!data) return <div className="app-container">Loading summary...</div>;

  // Prepare Type Distribution Chart
  const typeLabels = Object.keys(data.type_distribution);
  const typeCounts = Object.values(data.type_distribution);

  // Prepare Parameter Averages Chart
  const avgLabels = ["Flowrate", "Pressure", "Temperature"];
  const avgValues = [
    data.average_flowrate,
    data.average_pressure,
    data.average_temperature
  ];

  return (
    <div className="app-container">
      <h3 style={{textAlign:"center"}}>Summary for Dataset #{id}</h3>
      <ul style={{lineHeight:"2"}}>
        <li>Total rows: {data.total_count}</li>
      </ul>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px"
      }}>
        <div style={{ width: "300px", minHeight: "220px" }}>
          <h4 style={{textAlign:"center"}}>Type Distribution</h4>
          <Bar
            data={{
              labels: typeLabels,
              datasets: [{
                label: 'Count',
                data: typeCounts,
                backgroundColor: [
                  '#296cad', '#5dc3f7', '#81e291', '#ffb45e', '#ff5779'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
        <div style={{ width: "300px", minHeight: "220px" }}>
          <h4 style={{textAlign:"center"}}>Parameter Averages</h4>
          <Doughnut
            data={{
              labels: avgLabels,
              datasets: [{
                label: 'Average',
                data: avgValues,
                backgroundColor: [
                  '#5dc3f7', '#ffb45e', '#81e291'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'bottom' } }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
