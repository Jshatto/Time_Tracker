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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/logs/summary`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch summary: ${res.status}`);
        }
        
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load summary:', err);
        setError('Failed to load chart data');
        setSummary([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  const chartData = {
    labels: summary.map((item) => item?.project || 'Unnamed Project'),
    datasets: [
      {
        label: 'Hours This Week',
        data: summary.map((item) => {
          if (typeof item?.hours === 'number') return item.hours;
          if (typeof item?.totalHours === 'number') return item.totalHours;
          if (typeof item?.totalMs === 'number') return item.totalMs / 3600000;
          
          const numValue = parseFloat(item?.hours || item?.totalHours || 0);
          return isNaN(numValue) ? 0 : numValue;
        }),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#334155',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} hours`;
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
          color: '#475569',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.1)',
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Projects',
          color: '#475569',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="loading-message">
          Loading chart data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (summary.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          No time tracking data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="recent-entries">Time Tracking Summary</h3>
      <div className="chart-container" style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;