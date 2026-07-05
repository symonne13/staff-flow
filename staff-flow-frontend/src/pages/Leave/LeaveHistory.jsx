import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Leave.module.css";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    const res = await api.get("/leave/my");
    setLeaves(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.container}>
      <h2>My Leave History</h2>

      {leaves.length === 0 ? (
        <p>No leave requests yet.</p>
      ) : (
        leaves.map((l) => (
          <div key={l.id} className={styles.card}>
            <h3>{l.leave_type}</h3>

            <p>
              <b>From:</b> {l.date_from}
            </p>

            <p>
              <b>To:</b> {l.date_to}
            </p>

            <p>
              <b>Reason:</b> {l.reason}
            </p>

            <p>
              <b>Days:</b> {l.total_days}
            </p>

            <p
              style={{
                color:
                  l.status === "APPROVED"
                    ? "green"
                    : l.status === "REJECTED"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {l.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}