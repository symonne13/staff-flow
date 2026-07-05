const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/role.middleware");
const verifyToken = require("../middleware/auth.middleware");

const {
  checkIn,
  checkOut,
  getTodayStatus,
  getAttendanceHistory,
  getLiveAttendance,
  returnToWork,
} = require("../controllers/attendance.controller");

router.post("/checkin", verifyToken, checkIn);
router.post("/checkout", verifyToken, checkOut);
router.get("/status", verifyToken, getTodayStatus);
router.get("/history", verifyToken, getAttendanceHistory);
router.get("/live", verifyToken, isAdmin, getLiveAttendance);
router.put(
  "/return/:id",
  verifyToken,
  isAdmin,
  returnToWork
);
module.exports = router;