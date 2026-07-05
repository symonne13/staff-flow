const db = require("../config/db");

// ============================
// GET ALL USERS
// ============================
exports.getUsers = (req, res) => {
  db.query(
    `SELECT id, name, email, department, role
     FROM users
     ORDER BY name`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

// ============================
// SEND MESSAGE
// ============================
exports.sendMessage = (req, res) => {
  const sender = req.user.id;

  const {
    receiver_id,
    subject,
    message
  } = req.body;

 db.query(
  `INSERT INTO messages
  (sender_id, receiver_id, subject, message)
  VALUES (?,?,?,?)`,
  [sender, receiver_id, subject, message],
  (err) => {
    if (err) return res.status(500).json(err);

    // Create notification for receiver
    db.query(
      `INSERT INTO notifications
      (user_id, message, type)
      VALUES (?, ?, ?)`,
      [
        receiver_id,
        "📩 You received a new message.",
        "MESSAGE",
      ],
      (err2) => {
        if (err2) console.log(err2);

        res.json({
          success: true,
          message: "Message sent successfully",
        });
      }
    );
  }
);
};
// ============================
// GET CONVERSATION
// ============================
exports.getConversation = (req, res) => {
  const user1 = req.user.id;
  const user2 = req.params.id;

  db.query(
    `
    SELECT
      m.*,
      u.name AS sender_name
    FROM messages m
    JOIN users u
      ON m.sender_id = u.id
    WHERE
      (sender_id=? AND receiver_id=?)
      OR
      (sender_id=? AND receiver_id=?)
    ORDER BY created_at ASC
    `,
    [user1, user2, user2, user1],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};
// ============================
// MARK AS READ
// ============================
exports.markAsRead = (req, res) => {
  const sender = req.params.id;
  const receiver = req.user.id;

  db.query(
    `
    UPDATE messages
    SET is_read=1
    WHERE sender_id=?
    AND receiver_id=?
    `,
    [sender, receiver],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true
      });
    }
  );
};
// ============================
// DELETE CONVERSATION
// ============================
exports.deleteConversation = (req, res) => {
  const user1 = req.user.id;
  const user2 = req.params.id;

  db.query(
    `
    DELETE FROM messages
    WHERE
      (sender_id=? AND receiver_id=?)
      OR
      (sender_id=? AND receiver_id=?)
    `,
    [user1, user2, user2, user1],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Conversation deleted"
      });
    }
  );
};
// ============================
// SEND TO DEPARTMENT
// ============================
exports.sendDepartmentMessage = (req, res) => {
  const sender = req.user.id;

  const {
    department,
    subject,
    message,
  } = req.body;

  db.query(
    "SELECT id FROM users WHERE department=?",
    [department],
    (err, users) => {
      if (err) return res.status(500).json(err);

      if (users.length === 0) {
        return res.json({
          success: false,
          message: "No users found",
        });
      }

      users.forEach((user) => {
        db.query(
          `INSERT INTO messages
          (sender_id, receiver_id, subject, message)
          VALUES (?,?,?,?)`,
          [
            sender,
            user.id,
            subject,
            message,
          ]
        );

        db.query(
          `INSERT INTO notifications
          (user_id,message,type)
          VALUES (?,?,?)`,
          [
            user.id,
            "📩 HR sent a department message.",
            "MESSAGE",
          ]
        );
      });

      res.json({
        success: true,
      });
    }
  );
};
// ============================
// SEND TO EVERYONE
// ============================
exports.broadcastMessage = (req, res) => {
  const sender = req.user.id;

  const {
    subject,
    message,
  } = req.body;

  db.query(
    "SELECT id FROM users",
    (err, users) => {
      if (err) return res.status(500).json(err);

      users.forEach((user) => {
        if (user.id === sender) return;

        db.query(
          `INSERT INTO messages
          (sender_id, receiver_id, subject, message)
          VALUES (?,?,?,?)`,
          [
            sender,
            user.id,
            subject,
            message,
          ]
        );

        db.query(
          `INSERT INTO notifications
          (user_id,message,type)
          VALUES (?,?,?)`,
          [
            user.id,
            "📢 HR sent a broadcast message.",
            "MESSAGE",
          ]
        );
      });

      res.json({
        success: true,
      });
    }
  );
};