const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
} = require("../controllers/department.controller");

// View all departments
router.get("/", verifyToken, getDepartments);

// Add department
router.post("/", verifyToken, isAdmin, addDepartment);

// Update department
router.put("/:id", verifyToken, isAdmin, updateDepartment);

// Delete department
router.delete("/:id", verifyToken, isAdmin, deleteDepartment);

// Employees in department
router.get("/employees/:name", verifyToken, getDepartmentEmployees);

module.exports = router;