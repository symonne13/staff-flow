import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Layout/AdminLayout";

// USER PAGES
import DashboardHome from "./pages/DashboardHome/DashboardHome";
import Attendance from "./pages/Attendance/Attendance";
import Leave from "./pages/Leave/Leave";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";

// ADMIN PAGE
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Employees from "./pages/Employees/Employees";
import AdminSettings from "./pages/AdminSettings/AdminSettings";
import AdminNotifications from "./pages/AdminNotifications/AdminNotifications";
import Departments from "./pages/Departments/Departments";
import Reports from "./pages/Reports/Reports";
import Payroll from "./pages/Payroll/Payroll";
import AdminLeave from "./pages/AdminLeave/AdminLeave";
import AdminAttendance from "./pages/AdminAttendance/AdminAttendance";

/* PROTECTED ROUTE */
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

     {/* USER DASHBOARD */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <UserLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardHome />} />
  <Route path="attendance" element={<Attendance />} />
  <Route path="leave" element={<Leave />} />
  <Route path="notifications" element={<Notifications />} />

  <Route path="settings" element={<Settings />} />
</Route>

{/* ADMIN */}
<Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="employees" element={<Employees />} />
  <Route path="settings" element={<AdminSettings />} />
  <Route path="notifications" element={<AdminNotifications />} />
  <Route path="departments" element={<Departments />} />
  <Route path="reports" element={<Reports />} />
  <Route path="payroll" element={<Payroll />} />
 
  <Route path="leave" element={<AdminLeave />} />
  <Route path="attendance" element={<AdminAttendance />} />
</Route>
      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;