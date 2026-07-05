const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const path = require("path");
// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ======================
// DATABASE
// ======================
const db = require("./config/db");

// ======================
// ROUTES
// ======================

// AUTH ROUTES
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ADMIN ROUTES (Employees CRUD)
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// ADMIN DASHBOARD ROUTES
const adminDashboardRoutes = require("./routes/adminDashboard.routes");
app.use("/api/admin-dashboard", adminDashboardRoutes);

// LEAVE ROUTES
const leaveRoutes = require("./routes/leave.routes");
app.use("/api/leave", leaveRoutes);

// ATTENDANCE ROUTES
const attendanceRoutes = require("./routes/attendance.routes");
app.use("/api/attendance", attendanceRoutes);

// NOTIFICATION ROUTES
const notificationRoutes = require("./routes/notification.routes");
app.use("/api/notifications", notificationRoutes);

// PROFILE ROUTE
const profileRoutes = require("./routes/profile.routes");

app.use("/api/profile", profileRoutes);

// MESSAGE ROUTES
const messageRoutes = require("./routes/message.routes");

app.use("/api/messages", messageRoutes);

const reportRoutes = require("./routes/report.routes");

app.use("/api/reports", reportRoutes);
const departmentRoutes = require("./routes/department.routes");
app.use("/api/departments", departmentRoutes);
const payrollRoutes = require("./routes/payroll.routes");
app.use("/api/payroll", payrollRoutes);

const applyLeaveToday = require("./leave.scheduler");

// run every 1 hour
setInterval(applyLeaveToday, 60 * 60 * 1000);
// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("Staff-Flow API is running 🚀");
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});