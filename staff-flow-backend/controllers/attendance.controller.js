const db = require("../config/db");

// ======================
// CHECK IN
// ======================
exports.checkIn = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

db.query(
  "SELECT status FROM users WHERE id=?",
  [userId],
  (err, user) => {
    if (err) return res.status(500).json(err);

    if (user[0].status === "ON_LEAVE") {
      return res.status(403).json({
        message: "You are currently on leave",
      });
    }

  db.query(
    "SELECT * FROM attendance WHERE user_id = ? AND date = ?",
    [userId, today],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({
          message: "Already checked in today",
        });
      }

      db.query(
        `INSERT INTO attendance (user_id, check_in, status, date)
         VALUES (?, NOW(), 'IN_OFFICE', ?)`,
        [userId, today],
        (err) => {
          if (err) return res.status(500).json(err);

          // update user status
          db.query(
            "UPDATE users SET status='IN_OFFICE' WHERE id=?",
            [userId]
          );

          // notify employee
          db.query(
            `INSERT INTO notifications (user_id, title, message, type, sender_id, is_read)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              "Check In Successful",
              "You checked in successfully 👋",
              "CHECKIN",
              userId,
              0,
            ]
          );

          // notify admins
          db.query(
            "SELECT id FROM users WHERE role='admin'",
            (err2, admins) => {
              if (err2) return console.log(err2);

              admins.forEach((admin) => {
                db.query(
                  `INSERT INTO notifications (user_id, title, message, type, sender_id, is_read)
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    admin.id,
                    "Attendance Update",
                    `${req.user.name} checked in.`,
                    "ATTENDANCE",
                    req.user.id,
                    0,
                  ]
                );
              });

              return res.json({
                message: "Checked in successfully 👋",
                status: "IN_OFFICE",
              });
            }
          );
        }
      );
    }
  );
}
);
};
// ======================
// CHECK OUT
// ======================
exports.checkOut = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  db.query(
    "SELECT * FROM attendance WHERE user_id = ? AND date = ?",
    [userId, today],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(400).json({
          message: "You must check in first",
        });
      }

      db.query(
        `UPDATE attendance
         SET check_out = NOW(), status='NOT_IN_OFFICE'
         WHERE user_id=? AND date=?`,
        [userId, today],
        (err) => {
          if (err) return res.status(500).json(err);

          // update user status
          db.query(
            "UPDATE users SET status='NOT_IN_OFFICE' WHERE id=?",
            [userId]
          );

          // notify employee
          db.query(
            `INSERT INTO notifications (user_id, title, message, type, sender_id, is_read)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              "Check Out Successful",
              "You checked out successfully 👋",
              "CHECKOUT",
              userId,
              0,
            ]
          );

          // notify admins
          db.query(
            "SELECT id FROM users WHERE role='admin'",
            (err2, admins) => {
              if (err2) return console.log(err2);

              admins.forEach((admin) => {
                db.query(
                  `INSERT INTO notifications (user_id, title, message, type, sender_id, is_read)
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    admin.id,
                    "Attendance Update",
                    `${req.user.name} checked out.`,
                    "ATTENDANCE",
                    req.user.id,
                    0,
                  ]
                );
              });

              return res.json({
                message: "Checked out successfully 👋",
                status: "NOT_IN_OFFICE",
              });
            }
          );
        }
      );
    }
  );
};

// ======================
// GET TODAY STATUS
// ======================
exports.getTodayStatus = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT status FROM users WHERE id=?",
    [userId],
    (err, user) => {
      if (err) return res.status(500).json(err);

      const status = user[0].status;

      db.query(
        `SELECT * FROM attendance WHERE user_id=? AND date=CURDATE()`,
        [userId],
        (err2, result) => {
          if (err2) return res.status(500).json(err2);

          if (!result.length) {
            return res.json({
              status,
              check_in: null,
              check_out: null,
            });
          }

          res.json({
            status,
            check_in: result[0].check_in,
            check_out: result[0].check_out,
          });
        }
      );
    }
  );
};
// ======================
// GET ATTENDANCE HISTORY
// ======================
exports.getAttendanceHistory = (req, res) => {
  db.query(
    `SELECT id, date, check_in, check_out, status
     FROM attendance
     WHERE user_id = ?
     ORDER BY date DESC`,
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (!Array.isArray(results)) {
        return res.json([]);
      }

      res.json(results);
    }
  );
};
exports.getLiveAttendance = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.query(
    `SELECT 
        u.id,
        u.name,
        u.department,
        COALESCE(a.status, 'NOT_IN_OFFICE') AS status
     FROM users u
     LEFT JOIN attendance a
     ON u.id = a.user_id AND a.date = ?`,
    [today],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const users = results;

      const presentCount = users.filter(u => u.status === "IN_OFFICE").length;
      const absentCount = users.filter(u => u.status === "NOT_IN_OFFICE").length;
      const onLeaveCount = users.filter(u => u.status === "ON_LEAVE").length;

      res.json({
        users,
        summary: {
          total: users.length,
          present: presentCount,
          absent: absentCount,
          onLeave: onLeaveCount
        }
      });
    }
  );
};
exports.getAdminDashboardStats = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS totalEmployees,

      (SELECT COUNT(*)
       FROM attendance
       WHERE date = ? AND status = 'IN_OFFICE') AS presentToday,

      (SELECT COUNT(*)
       FROM attendance
       WHERE date = ? AND status = 'ON_LEAVE') AS onLeave,

      (SELECT COUNT(*)
       FROM leaves
       WHERE status = 'PENDING') AS pendingLeaves
  `;

  db.query(sql, [today, today], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      totalEmployees: result[0].totalEmployees || 0,
      presentToday: result[0].presentToday || 0,
      onLeave: result[0].onLeave || 0,
      pendingLeaves: result[0].pendingLeaves || 0,
    });
  });
};
exports.returnToWork = (req, res) => {
  const userId = req.params.id;

  db.query(
    "UPDATE users SET status='NOT_IN_OFFICE' WHERE id=?",
    [userId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "User returned to work successfully",
      });
    }
  );
};