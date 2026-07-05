const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
const adminDashboardRoutes =
  require("./routes/adminDashboard.routes");
const profileRoutes = require("./routes/profile.routes");
const notificationRoutes = require("./routes/notification.routes");
const leaveRoutes =
  require("./routes/leave.routes");
const adminRoutes = require("./routes/admin.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const authRoutes = require("./routes/auth.routes");
const verifyToken = require("./middleware/auth.middleware");

app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

// TEST ROUTE (MUST BE HERE)
app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = app;