const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.query(
    "SELECT COUNT(*) AS totalEmployees FROM users",
    (err, employees) => {
      if (err) return res.status(500).json(err);

      stats.totalEmployees = employees[0].totalEmployees;

      const today = new Date().toISOString().split("T")[0];

      db.query(
        `SELECT COUNT(DISTINCT user_id) AS activeToday
         FROM attendance
         WHERE date=? AND status='IN_OFFICE'`,
        [today],
        (err, active) => {
          if (err) return res.status(500).json(err);

          stats.activeToday = active[0].activeToday;

          db.query(
            `SELECT COUNT(*) AS inactiveToday
             FROM users
             WHERE id NOT IN (
                SELECT user_id
                FROM attendance
                WHERE date=?
             )`,
            [today],
            (err, inactive) => {
              if (err) return res.status(500).json(err);

              stats.inactiveToday =
                inactive[0].inactiveToday;

              db.query(
                `SELECT COUNT(*) AS onLeave
                 FROM leave_requests
                 WHERE status='APPROVED'`,
                (err, leave) => {
                  if (err) return res.status(500).json(err);

                  stats.onLeave =
                    leave[0].onLeave;

                  res.json(stats);
                }
              );
            }
          );
        }
      );
    }
  );
};