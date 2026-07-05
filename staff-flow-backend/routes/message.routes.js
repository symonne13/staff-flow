const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");

const {
  getUsers,
  sendMessage,
  getConversation,
  markAsRead,
  deleteConversation
} = require("../controllers/message.controller");

router.get("/users", verifyToken, getUsers);

router.post("/send", verifyToken, sendMessage);

router.get("/conversation/:id", verifyToken, getConversation);

router.put("/read/:id", verifyToken, markAsRead);

router.delete("/conversation/:id", verifyToken, deleteConversation);

module.exports = router;