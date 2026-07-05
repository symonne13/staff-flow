const db = require("./config/db");

const applyLeaveToday = () => {
  const today = new Date().toISOString().split("T")[0];

  db.query(
    `SELECT * FROM leave_requests
     WHERE status='APPROVED'
     AND date_from <= ?
     AND date_to >= ?`,
    [today, today],
    (err, leaves) => {
      if (err) return console.log(err);

      leaves.forEach((leave) => {
        db.query(
          `UPDATE users SET status='ON_LEAVE' WHERE id=?`,
          [leave.user_id]
        );

        db.query(
          `UPDATE attendance 
           SET status='ON_LEAVE'
           WHERE user_id=? AND date=?`,
          [leave.user_id, today]
        );
      });
    }
  );
};

module.exports = applyLeaveToday;