const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  getDashboardStats,
} = require("../controllers/adminDashboard.controller");

router.get(
  "/stats",
  verifyToken,
  isAdmin,
  getDashboardStats
);

module.exports = router;