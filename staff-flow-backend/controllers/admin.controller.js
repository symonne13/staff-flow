
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Get all employees
exports.getEmployees = (req, res) => {
  db.query(
    `SELECT
      id,
      name,
      email,
      department,
      role,
      phone,
      address,
      gender,
      position,
      annual_leave_balance,
      status,
      profile_picture
     FROM users
     ORDER BY name ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};
// Delete employee
exports.deleteEmployee = (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Employee deleted successfully",
      });
    }
  );
};


// Add employee
exports.addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      role,
      position,
      phone,
      address,
      gender,
    } = req.body;

    // Check if email already exists
    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, existing) => {
        if (err) return res.status(500).json(err);

        if (existing.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (
            name,
            email,
            password,
            department,
            role,
            position,
            phone,
            address,
            gender
          )
          VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            name,
            email,
            hashedPassword,
            department,
            role,
            position,
            phone,
            address,
            gender,
          ],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({
              message: "Employee added successfully",
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};
// Update employee
exports.updateEmployee = (req, res) => {
  const id = req.params.id;

  const {
    name,
    email,
    department,
    role,
    position,
    phone,
    address,
    gender,
    annual_leave_balance,
  } = req.body;

  db.query(
   db.query(
  `UPDATE users
   SET
   name=?,
   email=?,
   department=?,
   role=?,
   position=?,
   phone=?,
   address=?,
   gender=?,
   annual_leave_balance=?
   WHERE id=?`,
   [
      name,
      email,
      department,
      role,
      position,
      phone,
      address,
      gender,
      annual_leave_balance,
      id
   ],
  ),
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Employee updated successfully",
      });
    }
  );
};