const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  getPayroll,
  getMyPayroll,
  addPayroll,
  updatePayroll,
  deletePayroll,
  getEmployees,
} = require("../controllers/payroll.controller");

// =======================
// ADMIN
// =======================

// Get all payroll records
router.get("/", verifyToken, isAdmin, getPayroll);

// Add payroll
router.post("/", verifyToken, isAdmin, addPayroll);

// Update payroll
router.put("/:id", verifyToken, isAdmin, updatePayroll);

// Delete payroll
router.delete("/:id", verifyToken, isAdmin, deletePayroll);
router.get("/employees", verifyToken, isAdmin, getEmployees);
// =======================
// EMPLOYEE
// =======================

// View own payroll
router.get("/me", verifyToken, getMyPayroll);

module.exports = router;