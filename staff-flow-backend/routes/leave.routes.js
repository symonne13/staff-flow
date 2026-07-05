const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  applyLeave,
  getMyLeaves,
  getLeaveRequests,
  approveLeave,
  rejectLeave,
  deleteLeave,
  markOnLeave,
  returnToWork,
} = require("../controllers/leave.controller");

// ================= USER =================

router.post("/apply", verifyToken, applyLeave);

router.get("/my", verifyToken, getMyLeaves);

// ================= ADMIN =================

router.get("/all", verifyToken, isAdmin, getLeaveRequests);

router.put("/approve/:id", verifyToken, isAdmin, approveLeave);

router.put("/reject/:id", verifyToken, isAdmin, rejectLeave);

router.delete("/:id", verifyToken, isAdmin, deleteLeave);

router.put("/start/:id", verifyToken, isAdmin, markOnLeave);

router.put("/return/:id", verifyToken, isAdmin, returnToWork);

module.exports = router;