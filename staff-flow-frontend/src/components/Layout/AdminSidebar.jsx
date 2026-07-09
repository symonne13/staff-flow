import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaInbox,
} from "react-icons/fa";

import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
  const admin = {
    name: localStorage.getItem("name") || "Administrator",
    role: "HR Administrator",
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        Staff-Flow
      </div>

      <div className={styles.profile}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Admin"
          className={styles.avatar}
        />

        <h3>{admin.name}</h3>

        <p>{admin.role}</p>

        <span className={styles.online}>
          ● Online
        </span>
      </div>

      <nav className={styles.menu}>
        <NavLink to="/admin" end>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink
  to="/admin/employees"
  className={({ isActive }) =>
    isActive ? styles.active : ""
  }
>
  <FaUsers />
  Employees
</NavLink>
        <NavLink to="/admin/attendance">
          <FaClipboardList /> Attendance
        </NavLink>

        <NavLink to="/admin/leave">
          <FaCalendarAlt /> Leave
        </NavLink>

        <NavLink to="/admin/payroll">
          <FaMoneyBillWave /> Payroll
        </NavLink>

        <NavLink to="/admin/departments">
          <FaBuilding /> Departments
        </NavLink>

        <NavLink to="/admin/reports">
          <FaChartBar /> Reports
        </NavLink>

        <NavLink to="/admin/notifications">
          <FaBell /> Notifications
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog /> Settings
        </NavLink>

        <NavLink to="/login">
          <FaSignOutAlt /> Logout
        </NavLink>
      </nav>
    </aside>
  );
}