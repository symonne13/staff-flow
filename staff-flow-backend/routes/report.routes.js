const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  getAttendanceReport,
} = require("../controllers/report.controller");

router.get(
  "/attendance",
  verifyToken,
  isAdmin,
  getAttendanceReport
);

module.exports = router;