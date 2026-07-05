const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  sendNotification,
  getMyNotifications,
  markRead,
  deleteNotification,
} = require("../controllers/notification.controller");

// ADMIN sends
router.post("/send", verifyToken, isAdmin, sendNotification);

// USER gets notifications
router.get("/", verifyToken, getMyNotifications);

// USER marks read
router.put("/read/:id", verifyToken, markRead);

// DELETE (both user + admin handled in controller)
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;