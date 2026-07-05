const db = require("../config/db");

// ======================
// GET ALL DEPARTMENTS
// ======================
exports.getDepartments = (req, res) => {
  db.query(
    `SELECT
        d.id,
        d.name,
        d.description,
        d.created_at,
        COUNT(u.id) AS employees
     FROM departments d
     LEFT JOIN users u
       ON d.name = u.department
     GROUP BY d.id
     ORDER BY d.name ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

// ======================
// ADD DEPARTMENT
// ======================
exports.addDepartment = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Department name is required",
    });
  }

  db.query(
    "INSERT INTO departments(name, description) VALUES(?,?)",
    [name, description || null],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Department added successfully",
      });
    }
  );
};

// ======================
// UPDATE DEPARTMENT
// ======================
exports.updateDepartment = (req, res) => {
  const { name, description } = req.body;

  db.query(
    `UPDATE departments
     SET name=?, description=?
     WHERE id=?`,
    [name, description, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Department updated successfully",
      });
    }
  );
};

// ======================
// DELETE DEPARTMENT
// ======================
exports.deleteDepartment = (req, res) => {
  db.query(
    "DELETE FROM departments WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Department deleted successfully",
      });
    }
  );
};

// ======================
// GET EMPLOYEES IN DEPARTMENT
// ======================
exports.getDepartmentEmployees = (req, res) => {
  db.query(
    `SELECT
        id,
        name,
        email,
        position,
        department,
        status
     FROM users
     WHERE department=? AND role='user'
     ORDER BY name`,
    [req.params.name],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};