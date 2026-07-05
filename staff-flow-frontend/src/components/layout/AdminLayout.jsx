import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.main}>
        <Topbar />

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}