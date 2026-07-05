import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./AdminNotifications.module.css";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  // get user from localStorage (or your auth system)
  const user = JSON.parse(localStorage.getItem("user"));

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // MARK AS READ
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

 const deleteNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`);
    loadNotifications();
  } catch (err) {
    console.log(err);
  }
};
  const sendNotification = async () => {
    if (!title || !message) {
      return alert("Fill all fields");
    }

    try {
      await api.post("/notifications/send", {
        title,
        message,
        type: "announcement",
      });

      alert("Notification sent!");

      setTitle("");
      setMessage("");

      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.page}>
      <h1>📢 Notifications</h1>

      <div className={styles.card}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Message"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendNotification}>
          Send Announcement
        </button>
      </div>

      <div className={styles.history}>
        <h2>Recent Notifications</h2>

        {notifications.map((item) => (
          <div className={styles.notification} key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.message}</p>

            <small>
              {new Date(item.created_at).toLocaleString()}
            </small>
<button onClick={() => deleteNotification(item.id)}>
  Delete
</button>
            {/* MARK AS READ */}
            {!item.is_read && (
              <button onClick={() => markAsRead(item.id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}