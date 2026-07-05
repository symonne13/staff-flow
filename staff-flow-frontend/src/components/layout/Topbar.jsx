import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import styles from "./Topbar.module.css";

export default function Topbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const user =
  localStorage.getItem("name") || "User";

  const today = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className={styles.topbar}>
      <div>
        <h2>
          👋 {greeting}, {user}
        </h2>

        <p>{today}</p>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.search}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search employees..."
          />
        </div>

        <button className={styles.iconBtn}>
          <FaBell />
        </button>

        <div className={styles.profile}>
          <FaUserCircle size={32} />
          <span>{user}</span>
        </div>

        <div className={styles.clock}>
          {time.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}