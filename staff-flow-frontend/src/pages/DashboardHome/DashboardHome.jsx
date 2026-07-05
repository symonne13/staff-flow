import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./DashboardHome.module.css";

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  const [stats, setStats] = useState({
    status: "NOT_IN_OFFICE",
    leaveBalance: 24,
    pendingLeaves: 0,
    notifications: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const profileRes = await api.get(`/profile?id=${userId}`);

        setProfile(profileRes.data);

        // We'll connect these to the backend later
      setStats({
  status: profileRes.data.status || "NOT_IN_OFFICE",
  leaveBalance: profileRes.data.annual_leave_balance || 30,
  notifications: 0,
});

      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  const hour = time.getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";


return (
  <div className={styles.dashboard}>

    {/* HEADER */}
    <div className={styles.header}>
      <div>
        <h1>
          {greeting}, <span>{profile?.name || "User"}</span> 👋
        </h1>

        <p>
          {time.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className={styles.clock}>
        🕒 {time.toLocaleTimeString()}
      </div>
    </div>

    {/* SUMMARY CARDS */}
    <div className={styles.cards}>

      <div className={styles.card}
        onClick={() => navigate("/dashboard/attendance")}>
        <h3>🟢 Attendance Status</h3>

     
      </div>

      <div className={styles.card}
        onClick={() => navigate("/dashboard/leave")}>
        <h3>🌴 Leave Balance</h3>
        <p>{stats.leaveBalance} Days</p>
      </div>

      <div className={styles.card}onClick={() => navigate("/dashboard/notifications")}>
        <h3>🔔 Notifications</h3>
        
      </div>

    </div>

    {/* QUICK ACTIONS */}
    <div
  className={styles.quickCard}
  onClick={() => navigate("/dashboard/attendance")}
>
  <h3>🕒 Attendance</h3>
  <p>Check in or check out.</p>
</div>

<div
  className={styles.quickCard}
  onClick={() => navigate("/dashboard/leave")}
>
  <h3>🌴 Leave</h3>
  <p>Apply for leave quickly.</p>
</div>

<div
  className={styles.quickCard}
  onClick={() => navigate("/dashboard/notifications")}
>
  <h3>🔔 Notifications</h3>
  <p>View recent announcements.</p>
</div>

<div
  className={styles.quickCard}
  onClick={() => navigate("/dashboard/settings")}
>
  <h3>⚙ Settings</h3>
  <p>Update your profile.</p>
</div>

    {/* RECENT ACTIVITY */}
    <div className={styles.section}>

      <h2>📋 Recent Activity</h2>

      <div className={styles.activityCard}>
        <p>✔ Logged into Staff-Flow</p>
        <small>Today</small>
      </div>

      <div className={styles.activityCard}>
        <p>📅 Welcome to your dashboard.</p>
        <small>Latest Activity</small>
      </div>

    </div>

  </div>
);
}