import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./UserDashboard.module.css";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("NOT_IN_OFFICE");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  // LOAD PROFILE
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("No user ID found.");
        return;
      }

      const res = await api.get(`/profile?id=${userId}`);

      setProfile(res.data);
    } catch (err) {
      console.error("Profile Error:", err);
    }
  };

  fetchProfile();
}, []);
useEffect(() => {
  const fetchStatus = async () => {
    try {
      const res = await api.get("/attendance/status");
      setStatus(res.data.status || "NOT_IN_OFFICE");
    } catch (err) {
      console.error(err);
    }
  };

  fetchStatus();
}, []);
// LIVE CLOCK
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);


 // CHECK IN
const checkIn = async () => {
  try {
    setLoading(true);

    const res = await api.post("/attendance/checkin");

    setMessage(res.data.message || "Checked in successfully");
    await fetchStatus(); // 🔥 refresh real status
  } catch (err) {
    setMessage(err.response?.data?.message || "Error checking in");
  } finally {
    setLoading(false);
  }
};
  // CHECK OUT
const checkOut = async () => {
  try {
    setLoading(true);

    const userId = localStorage.getItem("userId");

    const res = await api.post("/attendance/checkout", {
    
    });
setStatus(res.data.status || "NOT_IN_OFFICE");
    
    setMessage(res.data.message || "Checked out successfully");
  } catch (err) {
    setMessage(err.response?.data?.message || "Error checking out");
  } finally {
    setLoading(false);
  }
};

const [leave, setLeave] = useState({
  from: "",
  to: "",
  type: "casual",
  reason: "",
});

const [leaveDaysLeft, setLeaveDaysLeft] = useState(24);
const [hasApplied, setHasApplied] = useState(false);
const applyLeave = async () => {
  try {
    if (hasApplied) {
      setMessage("You have already applied for leave");
      return;
    }

    if (!leave.from || !leave.to || !leave.reason) {
      setMessage("Please fill all leave fields");
      return;
    }

    const res = await api.post("/leave/apply", leave);

    setMessage(res.data.message || "Leave applied successfully");
    setHasApplied(true);
  } catch (err) {
    setMessage(err.response?.data?.message || "Leave request failed");
  }
};
const hour = currentTime.getHours();
let greeting = "Good Evening";

if (hour < 12) greeting = "Good Morning";
else if (hour < 18) greeting = "Good Afternoon";

const formattedDate = currentTime.toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formattedTime = currentTime.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const applyLeave = async () => {
  try {
    setLoading(true);

    const res = await api.post("/leave/apply", leave);

    setMessage("Leave submitted successfully ✅");

    setLeave({
      from: "",
      to: "",
      type: "casual",
      reason: "",
    });

  } catch (err) {
    setMessage(err.response?.data?.message || "Leave request failed");
  } finally {
    setLoading(false);
  }
};
return (
  <div className={styles.page}>

    {/* HEADER */}
    <div className={styles.header}>
      <div>
        <h2>
          👋 {greeting},{" "}
          <span>{profile?.name || "User"}</span>
        </h2>

        <p className={styles.subText}>
          {formattedDate}
        </p>

        <p className={styles.subText}>
          Department: {profile?.department || "—"} | Role: {profile?.role || "—"}
        </p>
      </div>

      <div className={styles.clock}>
        {formattedTime}
      </div>
    </div>

    {/* STATUS CARD */}
    <div className={styles.statusCard}>
      <h3>Status</h3>

      <p
        className={
          status === "IN_OFFICE"
            ? styles.inOffice
            : styles.outOffice
        }
      >
        {status}
      </p>

      {message && (
        <p className={styles.message}>
          {message}
        </p>
      )}
    </div>

    {/* ACTIONS */}
    <div className={styles.actions}>
      <button
        onClick={checkIn}
        disabled={loading}
        className={styles.checkIn}
      >
        Check In
      </button>

      <button
        onClick={checkOut}
        disabled={loading}
        className={styles.checkOut}
      >
        Check Out
      </button>
    </div>

    {/* PROFILE */}
    <div className={styles.card}>
      <h3>Profile</h3>

      <div className={styles.row}>
        <span>Name:</span> {profile?.name}
      </div>

      <div className={styles.row}>
        <span>Email:</span> {profile?.email}
      </div>

      <div className={styles.row}>
        <span>Department:</span> {profile?.department}
      </div>

      <div className={styles.row}>
        <span>Role:</span> {profile?.role}
      </div>
    </div>

    {/* LEAVE MANAGEMENT */}
    <div className={styles.card}>
      <h3>Leave Management</h3>

      <p>
        Leave Balance: <strong>{leaveDaysLeft}</strong> days
      </p>

      <select
        value={leave.type}
        onChange={(e) =>
          setLeave({
            ...leave,
            type: e.target.value,
          })
        }
      >
        <option value="casual">Casual Leave</option>
        <option value="sick">Sick Leave</option>
        <option value="emergency">Emergency Leave</option>
        <option value="maternity">Maternity Leave</option>
        <option value="paternity">Paternity Leave</option>
      </select>

     <div className={styles.leaveRow}>
  <div className={styles.leaveField}>
    <label>From:</label>

    <input
      type="date"
      value={leave.from}
      onChange={(e) =>
        setLeave({
          ...leave,
          from: e.target.value,
        })
      }
    />
  </div>

  <div className={styles.leaveField}>
    <label>To:</label>

    <input
      type="date"
      value={leave.to}
      onChange={(e) =>
        setLeave({
          ...leave,
          to: e.target.value,
        })
      }
    />
  </div>
</div>
      <textarea
        placeholder="Reason for leave"
        value={leave.reason}
        onChange={(e) =>
          setLeave({
            ...leave,
            reason: e.target.value,
          })
        }
      />
<button onClick={applyLeave} disabled={loading}>
  Submit Leave Request
</button>
    </div>

  </div>
);
}