import { useState } from "react";
import api from "../../api/axios";
import styles from "./Leave.module.css";
import LeaveHistory from "./LeaveHistory";
export default function Leave() {
  const [form, setForm] = useState({
    leave_type: "Annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/leave/apply", {
        leave_type: form.leave_type,
        date_from: form.start_date,
        date_to: form.end_date,
        reason: form.reason,
      });

      alert(res.data.message || "Leave submitted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit leave");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Leave Management</h2>

      <div className={styles.balance}>
    <center>  APPLY FOR LEAVE <strong></strong></center>  
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          name="leave_type"
          value={form.leave_type}
          onChange={handleChange}
        >
          <option>Annual</option>
          <option>Sick</option>
          <option>Maternity</option>
          <option>Paternity</option>
          <option>Emergency</option>
        </select>

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />

        <textarea
          name="reason"
          placeholder="Reason for leave..."
          value={form.reason}
          onChange={handleChange}
        />

        <button type="submit">
          Submit Leave Request
        </button>
      </form>
<hr />

<LeaveHistory />
     
    </div>
  );
}