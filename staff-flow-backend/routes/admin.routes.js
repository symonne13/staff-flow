const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  
} = require("../controllers/admin.controller");

// Get all employees
router.get(
  "/employees",
  verifyToken,
  isAdmin,
  getEmployees
);

// Delete employee
router.delete(
  "/employees/:id",
  verifyToken,
  isAdmin,
  deleteEmployee
);
//add employee
router.post(
  "/employees",
  verifyToken,
  isAdmin,
  addEmployee
);
//update employee
router.put(
  "/employees/:id",
  verifyToken,
  isAdmin,
  updateEmployee
);
module.exports = router;