import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./AdminAttendance.module.css";

export default function AdminAttendance() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
  });

  const [loading, setLoading] = useState(false);
const [today, setToday] = useState({
  status: "NOT_IN_OFFICE",
  check_in: null,
  check_out: null,
});
const loadToday = async () => {
  const res = await api.get("/attendance/status");
  setToday(res.data);
};
  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/attendance/live");

      setUsers(res.data.users);
      setSummary(res.data.summary);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
    loadAttendance();
     loadSummary();  
    const interval = setInterval(() => {
      loadAttendance();
    }, 5000); // auto refresh every 5s

    return () => clearInterval(interval);
  }, []);
  const loadSummary = async () => {
  try {
    const res = await api.get("/attendance/live");
    setSummary(res.data.summary);
  } catch (err) {
    console.log(err);
  }
};
const checkIn = async () => {
  try {
    const res = await api.post("/attendance/checkin");
    alert(res.data.message);

    loadToday();
    loadAttendance();
    loadSummary();
  } catch (err) {
    alert(err.response?.data?.message || "Check-in failed");
  }
};
const checkOut = async () => {
  try {
    const res = await api.post("/attendance/checkout");
    alert(res.data.message);

    loadToday();
    loadAttendance();
    loadSummary();
  } catch (err) {
    alert(err.response?.data?.message || "Check-out failed");
  }
};
  return (
    
    <div className={styles.page}>
        <div className={styles.card}>
  <h2>👨‍💼 My Attendance</h2>

  <p>
    Status:{" "}
    <b>
      {today.status === "IN_OFFICE"
        ? "🟢 In Office"
        : "🔴 Not In Office"}
    </b>
  </p>

  <p>
    Check In:{" "}
    {today.check_in
      ? new Date(today.check_in).toLocaleTimeString()
      : "--"}
  </p>

  <p>
    Check Out:{" "}
    {today.check_out
      ? new Date(today.check_out).toLocaleTimeString()
      : "--"}
  </p>

  <button
    onClick={checkIn}
    disabled={today.status === "IN_OFFICE"}
  >
    Check In
  </button>

  <button
    onClick={checkOut}
    disabled={today.status !== "IN_OFFICE"}
  >
    Check Out
  </button>
</div>
      <h1>📡 Live Attendance</h1>

      {/* SUMMARY CARDS */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total</h3>
          <h2>{summary.total}</h2>
        </div>

        <div className={styles.card}>
          <h3>🟢 Present</h3>
          <h2>{summary.present}</h2>
        </div>

        <div className={styles.card}>
          <h3>🔴 Absent</h3>
          <h2>{summary.absent}</h2>
        </div>

        <div className={styles.card}>
          <h3>🌴 On Leave</h3>
          <h2>{summary.onLeave}</h2>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p>Loading live data...</p>}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.department}</td>

                <td>
                  <span
                    className={
                      user.status === "IN_OFFICE"
                        ? styles.in
                        : user.status === "ON_LEAVE"
                        ? styles.leave
                        : styles.out
                    }
                  >
                    {user.status === "IN_OFFICE"
                      ? "🟢 In Office"
                      : user.status === "ON_LEAVE"
                      ? "🌴 On Leave"
                      : "🔴 Not In Office"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}