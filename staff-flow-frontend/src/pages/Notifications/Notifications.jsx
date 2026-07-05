import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Notifications.module.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

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
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: 1 } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE (USER OWN ONLY)
const deleteNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`);
    loadNotifications();
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className={styles.page}>
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${
              !item.is_read ? styles.unread : ""
            }`}
          >
            <h3>{item.title}</h3>

            <p>{item.message}</p>

            <small>
              From: {item.sender || "System"}
            </small>

            <br />

            <small>
              {new Date(item.created_at).toLocaleString()}
            </small>

            {/* MARK AS READ */}
            {!item.is_read && (
              <button onClick={() => markRead(item.id)}>
                Mark as Read
              </button>
            )}
<button onClick={() => deleteNotification(item.id)}>
  Delete
</button>
          
          </div>
        ))
      )}
    </div>
  );
}