const db = require("../config/db");

// ======================
// SEND NOTIFICATION (ADMIN)
// ======================
exports.sendNotification = (req, res) => {
  const { title, message, type } = req.body;

  db.query(
    "SELECT id FROM users WHERE role='user'",
    (err, users) => {
      if (err) return res.status(500).json(err);

      if (users.length === 0) {
        return res.status(404).json({
          message: "No users found.",
        });
      }

      const values = users.map((user) => [
        user.id,
        title,
        message,
        type || "BROADCAST",
        req.user.id,
        0,
      ]);

      db.query(
        `INSERT INTO notifications
        (user_id,title,message,type,sender_id,is_read)
        VALUES ?`,
        [values],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            success: true,
            message: `Notification sent to ${users.length} users.`,
          });
        }
      );
    }
  );
};
// ======================
// GET MY NOTIFICATIONS
// ======================
exports.getMyNotifications = (req, res) => {
  db.query(
    `SELECT 
      n.*,
      u.name AS sender
     FROM notifications n
     LEFT JOIN users u ON n.sender_id = u.id
     WHERE n.user_id = ?
     ORDER BY n.created_at DESC`,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

// ======================
// MARK AS READ (OWN ONLY)
// ======================
exports.markRead = (req, res) => {
  db.query(
    `UPDATE notifications 
     SET is_read = 1 
     WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
};

// ======================
// DELETE NOTIFICATION (USER OWN ONLY)
// ======================
exports.deleteNotification = (req, res) => {
  db.query(
    `DELETE FROM notifications 
     WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
};