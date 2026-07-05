import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./AdminDashboard.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin-dashboard/stats");

      setStats({
        totalEmployees: res.data.totalEmployees || 0,
        presentToday: res.data.presentToday || 0,
        onLeave: res.data.onLeave || 0,
        pendingLeaves: res.data.pendingLeaves || 0,
      });
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Present", "On Leave", "Pending Leave"],
    datasets: [
      {
        label: "Employees",
        data: [
          stats.totalEmployees|| 0,
          stats.onLeave || 0,
          stats.pendingLeaves || 0,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      {/* CARDS */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Employees</h3>
          <h2>{stats.totalEmployees}</h2>
        </div>

        <div className={styles.card}>
          <h3>Present Today</h3>
          <h2>{stats.presentToday}</h2>
        </div>

        <div className={styles.card}>
          <h3>On Leave</h3>
          <h2>{stats.onLeave}</h2>
        </div>

        <div className={styles.card}>
          <h3>Pending Leaves</h3>
          <h2>{stats.pendingLeaves}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className={styles.chartCard}>
        <h2>Attendance Overview</h2>

        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}