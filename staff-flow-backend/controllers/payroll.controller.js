const db = require("../config/db");

// ======================
// GET ALL PAYROLL
// ======================
exports.getPayroll = (req, res) => {
  db.query(
    `SELECT
      p.*,
      u.name,
      u.department,
      u.position
     FROM payroll p
     JOIN users u
       ON p.user_id = u.id
     ORDER BY p.year DESC, p.month DESC, u.name ASC`,
    (err, payroll) => {
      if (err) return res.status(500).json(err);

      const summary = {
        employees: payroll.length,
        totalPayroll: 0,
        averageSalary: 0,
      };

      payroll.forEach((p) => {
        summary.totalPayroll += Number(p.net_salary);
      });

      summary.averageSalary =
        payroll.length > 0
          ? summary.totalPayroll / payroll.length
          : 0;

      res.json({
        payroll,
        summary,
      });
    }
  );
};

// ======================
// GET MY PAYROLL
// ======================
exports.getMyPayroll = (req, res) => {
  db.query(
    `SELECT *
     FROM payroll
     WHERE user_id=?
     ORDER BY year DESC, month DESC`,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

// ======================
// ADD PAYROLL
// ======================
exports.addPayroll = (req, res) => {
  const {
    user_id,
    basic_salary,
    allowances,
    deductions,
    overtime,
    month,
    year,
  } = req.body;

  const net_salary =
    Number(basic_salary) +
    Number(allowances || 0) +
    Number(overtime || 0) -
    Number(deductions || 0);

  db.query(
    `INSERT INTO payroll
    (
      user_id,
      basic_salary,
      allowances,
      deductions,
      overtime,
      net_salary,
      month,
      year
    )
    VALUES(?,?,?,?,?,?,?,?)`,
    [
      user_id,
      basic_salary,
      allowances || 0,
      deductions || 0,
      overtime || 0,
      net_salary,
      month,
      year,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Payroll added successfully",
      });
    }
  );
};

// ======================
// UPDATE PAYROLL
// ======================
exports.updatePayroll = (req, res) => {
  const {
    basic_salary,
    allowances,
    deductions,
    overtime,
    month,
    year,
  } = req.body;

  const net_salary =
    Number(basic_salary) +
    Number(allowances || 0) +
    Number(overtime || 0) -
    Number(deductions || 0);

  db.query(
    `UPDATE payroll
     SET
      basic_salary=?,
      allowances=?,
      deductions=?,
      overtime=?,
      net_salary=?,
      month=?,
      year=?
     WHERE id=?`,
    [
      basic_salary,
      allowances,
      deductions,
      overtime,
      net_salary,
      month,
      year,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Payroll updated successfully",
      });
    }
  );
};

// ======================
// DELETE PAYROLL
// ======================
exports.deletePayroll = (req, res) => {
  db.query(
    "DELETE FROM payroll WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Payroll deleted successfully",
      });
    }
  );
};
exports.getEmployees = (req, res) => {
  db.query(
    `SELECT id, name, department, position 
     FROM users
     WHERE role = 'user'`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};