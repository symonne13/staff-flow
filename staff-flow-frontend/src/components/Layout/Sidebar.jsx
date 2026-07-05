
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardCheck,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaInbox,
} from "react-icons/fa";

import styles from "./Sidebar.module.css";
import { useState, useEffect } from "react";
export default function Sidebar() {
  const navigate = useNavigate();
   const [photo, setPhoto] = useState(
  localStorage.getItem("profilePicture") || ""
);

useEffect(() => {
  localStorage.setItem("profilePicture", photo);
}, [photo]);

const uploadPhoto = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setPhoto(reader.result);
  };

  reader.readAsDataURL(file);
};

const removePhoto = () => {
  setPhoto("");
  localStorage.removeItem("profilePicture");
};
  const role = localStorage.getItem("role") || "user";

const user = {
  name: localStorage.getItem("name") || "User",
  email: localStorage.getItem("email") || "",
  department: localStorage.getItem("department") || "",
  role,
  photo: localStorage.getItem("profilePicture"),
};
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Staff-Flow</h2>
    <div className={styles.profile}>

  {photo ? (
    <img
      src={photo}
      alt="Profile"
      className={styles.avatar}
    />
  ) : (
    <FaUserCircle className={styles.avatarIcon} />
  )}

  <span className={styles.online}></span>
<h3>{user.name}</h3>

<p>{user.department}</p>

<small>{user.role.toUpperCase()}</small>
 
  <label className={styles.uploadBtn}>
    Upload Photo
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={uploadPhoto}
    />
  </label>

  <button
    className={styles.removeBtn}
    onClick={removePhoto}
  >
    Remove Photo
  </button>

</div>

      <nav className={styles.menu}>
        <NavLink
          to={role === "admin" ? "/admin" : "/dashboard"}
          className={({ isActive }) =>
            isActive ? styles.active : ""
          }
        >
          <FaHome />
          Dashboard
        </NavLink>

        {role === "admin" && (
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <FaUsers />
            Employees
          </NavLink>
        )}

        <NavLink
          to="/dashboard/attendance"
          className={({ isActive }) =>
            isActive ? styles.active : ""
          }
        >
          <FaClipboardCheck />
          Attendance
        </NavLink>

        <NavLink
          to="/dashboard/leave"
          className={({ isActive }) =>
            isActive ? styles.active : ""
          }
        >
          <FaCalendarAlt />
          Leave
        </NavLink>

        <NavLink
          to="/dashboard/notifications"
          className={({ isActive }) =>
            isActive ? styles.active : ""
          }
        >
          <FaBell />
          Notifications
        </NavLink>
<NavLink
  to="/dashboard/inbox"
  className={({ isActive }) =>
    isActive ? styles.active : ""
  }
>
  <FaInbox />
  Inbox
</NavLink>
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            isActive ? styles.active : ""
          }
        >
          <FaCog />
          Settings
        </NavLink>
      </nav>

      <button
        className={styles.logout}
        onClick={logout}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

