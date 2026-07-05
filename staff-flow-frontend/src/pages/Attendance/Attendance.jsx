import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Attendance.module.css";

export default function Attendance() {
  const [attendance, setAttendance] = useState({
    status: "NOT_IN_OFFICE",
    check_in: null,
    check_out: null,
  });

  // Attendance history
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  // ======================
  // Load today's status
  // ======================
  const loadStatus = async () => {
    try {
      const res = await api.get("/attendance/status");
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // Load attendance history
  // ======================
  const loadHistory = async () => {
    try {
      const res = await api.get("/attendance/history");

      console.log("History Response:", res.data);

      // Prevent map() errors
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      } else {
        console.error("History is not an array:", res.data);
        setHistory([]);
      }
    } catch (err) {
      console.log(err);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadStatus();
    loadHistory();
  }, []);
  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const res = await api.post("/attendance/checkin");

      alert(res.data.message);

      loadStatus();
        loadHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const res = await api.post("/attendance/checkout");

      alert(res.data.message);

      loadStatus();
      loadHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Attendance</h1>

      <div className={styles.card}>
        <h2>Today's Status</h2>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              attendance.status === "IN_OFFICE"
                ? styles.inOffice
                : styles.outOffice
            }
          >
            {attendance.status === "IN_OFFICE"
              ? "🟢 In Office"
              : "🔴 Not In Office"}
          </span>
        </p>

        <p>
          <strong>Check In:</strong>{" "}
          {attendance.check_in
            ? new Date(attendance.check_in).toLocaleTimeString()
            : "--"}
        </p>

        <p>
          <strong>Check Out:</strong>{" "}
          {attendance.check_out
            ? new Date(attendance.check_out).toLocaleTimeString()
            : "--"}
        </p>

        <div className={styles.buttons}>
          <button
            onClick={handleCheckIn}
            disabled={
              loading || attendance.status === "IN_OFFICE"
            }
            className={styles.checkIn}
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={
              loading || attendance.status !== "IN_OFFICE"
            }
            className={styles.checkOut}
          >
            Check Out
          </button>
        </div>
        <div className={styles.historyCard}>
  <h2>Attendance History</h2>

  {history.length === 0 ? (
    <p>No attendance records found.</p>
  ) : (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {history.length > 0 ? (
  history.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>

            <td>
              {item.check_in
                ? new Date(item.check_in).toLocaleTimeString()
                : "--"}
            </td>

            <td>
              {item.check_out
                ? new Date(item.check_out).toLocaleTimeString()
                : "--"}
            </td>

            <td>{item.status}</td>
          </tr>
      ))
) : (
  <p>No attendance records found.</p>
) }
      </tbody>
    </table>
  )}
</div>
      </div>
    </div>
  );
}