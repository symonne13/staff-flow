const db = require("../config/db");

// ======================
// ATTENDANCE REPORT
// ======================
exports.getAttendanceReport = (req, res) => {
  const { date, department, search } = req.query;

  const reportDate =
    date || new Date().toISOString().split("T")[0];

  let sql = `
    SELECT
      u.id,
      u.name,
      u.department,
      u.position,

      a.check_in,
      a.check_out,

      CASE
        WHEN a.id IS NULL THEN 'ABSENT'
        ELSE a.status
      END AS status,

      ? AS report_date

    FROM users u

    LEFT JOIN attendance a
      ON u.id = a.user_id
      AND a.date = ?

    WHERE u.role='user'
  `;

  const params = [reportDate, reportDate];

  if (department && department !== "All") {
    sql += " AND u.department=?";
    params.push(department);
  }

  if (search) {
    sql += " AND u.name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " ORDER BY u.name ASC";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json(err);

    const summary = {
      total: rows.length,
      present: rows.filter(
        (r) =>
          r.status === "IN_OFFICE" ||
          r.status === "NOT_IN_OFFICE"
      ).length,
      absent: rows.filter(
        (r) => r.status === "ABSENT"
      ).length,
      onLeave: rows.filter(
        (r) => r.status === "ON_LEAVE"
      ).length,
    };
const departments = [
  ...new Set(rows.map((r) => r.department)),
];

res.json({
  summary,
  report: rows,
  departments,
});
    
  });
};
