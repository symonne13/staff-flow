import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";

import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <div className={styles.layout}>
      {isAdmin ? <AdminSidebar /> : <Sidebar />}

      <div
        className={`${styles.main} ${
          isAdmin ? styles.adminMain : styles.userMain
        }`}
      >
        {isAdmin && <Topbar />}

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}