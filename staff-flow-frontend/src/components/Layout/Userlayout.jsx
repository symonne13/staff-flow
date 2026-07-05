import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import styles from "./UserLayout.module.css";

export default function UserLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}