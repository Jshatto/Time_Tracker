import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChart = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch('/api/logs/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to load summary:', err));
  }, []);

  const chartData = {
    labels: summary.map((item) => item.project || 'Unnamed'),
    datasets: [
      {
        label: 'Hours This Week',
        data: summary.map((item) => (item.hours || item.totalHours || item.totalMs / 3600000) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DashboardChart;