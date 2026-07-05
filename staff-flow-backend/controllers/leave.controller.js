const db = require("../config/db");

// ======================================
// APPLY LEAVE
// ======================================
exports.applyLeave = (req, res) => {
  const userId = req.user.id;

  const {
    leave_type,
    reason,
    date_from,
    date_to,
  } = req.body;

  if (!leave_type || !reason || !date_from || !date_to) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  db.query(
    `SELECT * FROM leave_requests
     WHERE user_id=? AND status='PENDING'`,
    [userId],
    (err, pending) => {
      if (err) return res.status(500).json(err);

      if (pending.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You already have a pending leave request.",
        });
      }

      const start = new Date(date_from);
      const end = new Date(date_to);

      if (end < start) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before start date.",
        });
      }

      const totalDays =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      db.query(
        `SELECT name, annual_leave_balance
         FROM users
         WHERE id=?`,
        [userId],
        (err, user) => {
          if (err) return res.status(500).json(err);

          if (!user.length) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          const balance = user[0].annual_leave_balance;

          if (
            leave_type !== "Maternity Leave" &&
            leave_type !== "Paternity Leave"
          ) {
            if (totalDays > balance) {
              return res.status(400).json({
                success: false,
                message: "Insufficient leave balance.",
              });
            }
          }

          db.query(
            `INSERT INTO leave_requests
            (
              user_id,
              reason,
              leave_type,
              date_from,
              date_to,
              total_days,
              status
            )
            VALUES(?,?,?,?,?,?,'PENDING')`,
            [
              userId,
              reason,
              leave_type,
              date_from,
              date_to,
              totalDays,
            ],
            (err) => {
              if (err) return res.status(500).json(err);

              // Notify employee
              db.query(
                `INSERT INTO notifications
                (
                  user_id,
                  title,
                  message,
                  type,
                  sender_id,
                  is_read
                )
                VALUES(?,?,?,?,?,0)`,
                [
                  userId,
                  "Leave Submitted",
                  "Your leave request has been submitted successfully.",
                  "LEAVE",
                  userId,
                ]
              );

              // Notify all admins
              db.query(
                `SELECT id
                 FROM users
                 WHERE role='admin'`,
                (err2, admins) => {
                  if (!err2) {
                    admins.forEach((admin) => {
                      db.query(
                        `INSERT INTO notifications
                        (
                          user_id,
                          title,
                          message,
                          type,
                          sender_id,
                          is_read
                        )
                        VALUES(?,?,?,?,?,0)`,
                        [
                          admin.id,
                          "New Leave Request",
                          `${user[0].name} submitted a leave request.`,
                          "LEAVE_REQUEST",
                          userId,
                        ]
                      );
                    });
                  }

                  res.json({
                    success: true,
                    message:
                      "Leave request submitted successfully.",
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

// ======================================
// USER LEAVE HISTORY
// ======================================
exports.getMyLeaves = (req, res) => {
  db.query(
    `SELECT
      id,
      leave_type,
      reason,
      date_from,
      date_to,
      total_days,
      status,
      rejection_reason,
      created_at
     FROM leave_requests
     WHERE user_id=?
     ORDER BY created_at DESC`,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};
// ======================================
// GET ALL LEAVE REQUESTS (ADMIN)
// ======================================
exports.getLeaveRequests = (req, res) => {
  db.query(
    `SELECT
        lr.*,
        u.name,
        u.department,
        u.position,
        u.annual_leave_balance
     FROM leave_requests lr
     JOIN users u
        ON lr.user_id=u.id
     ORDER BY
        CASE
            WHEN lr.status='PENDING' THEN 1
            WHEN lr.status='APPROVED' THEN 2
            WHEN lr.status='REJECTED' THEN 3
        END,
        lr.created_at DESC`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        total: result.length,
        requests: result,
      });
    }
  );
};

// ======================================
// APPROVE LEAVE
// ======================================
exports.approveLeave = (req, res) => {
  const leaveId = req.params.id;

  db.query(
    `SELECT *
     FROM leave_requests
     WHERE id=?`,
    [leaveId],
    (err, leaveData) => {

      if (err) return res.status(500).json(err);

      if (!leaveData.length) {
        return res.status(404).json({
          message: "Leave request not found",
        });
      }

      const leave = leaveData[0];

      db.query(
        `UPDATE leave_requests
         SET status='APPROVED'
         WHERE id=?`,
        [leaveId],
        (err) => {

          if (err) return res.status(500).json(err);

          if (
            leave.leave_type !== "Maternity Leave" &&
            leave.leave_type !== "Paternity Leave"
          ) {

            db.query(
              `UPDATE users
               SET annual_leave_balance=
               annual_leave_balance-?
               WHERE id=?`,
              [
                leave.total_days,
                leave.user_id,
              ]
            );

          }

          db.query(
            `INSERT INTO notifications
            (
              user_id,
              title,
              message,
              type,
              sender_id,
              is_read
            )
            VALUES(?,?,?,?,?,0)`,
            [
              leave.user_id,
              "Leave Approved",
              "Your leave request has been approved.",
              "LEAVE_APPROVED",
              req.user.id,
            ]
          );

          res.json({
            success: true,
            message: "Leave approved successfully.",
          });

        }
      );

    }
  );
};

// ======================================
// REJECT LEAVE
// ======================================
exports.rejectLeave = (req, res) => {

  const leaveId = req.params.id;

  const { rejection_reason } = req.body;

  if (!rejection_reason) {
    return res.status(400).json({
      message: "Rejection reason is required.",
    });
  }

  db.query(
    `SELECT *
     FROM leave_requests
     WHERE id=?`,
    [leaveId],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({
          message: "Leave not found",
        });
      }

      const leave = result[0];

      db.query(
        `UPDATE leave_requests
         SET
           status='REJECTED',
           rejection_reason=?
         WHERE id=?`,
        [
          rejection_reason,
          leaveId,
        ],
        (err) => {

          if (err) return res.status(500).json(err);

          db.query(
            `INSERT INTO notifications
            (
              user_id,
              title,
              message,
              type,
              sender_id,
              is_read
            )
            VALUES(?,?,?,?,?,0)`,
            [
              leave.user_id,
              "Leave Rejected",
              `Your leave request was rejected.\nReason: ${rejection_reason}`,
              "LEAVE_REJECTED",
              req.user.id,
            ]
          );

          res.json({
            success: true,
            message: "Leave rejected successfully.",
          });

        }
      );

    }
  );
};
// ======================================
// DELETE LEAVE REQUEST
// ======================================
exports.deleteLeave = (req, res) => {
  const leaveId = req.params.id;

  db.query(
    "DELETE FROM leave_requests WHERE id=?",
    [leaveId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Leave request deleted successfully.",
      });
    }
  );
};

// ======================================
// MARK EMPLOYEE AS ON LEAVE
// ======================================
exports.markOnLeave = (req, res) => {
  const leaveId = req.params.id;

  db.query(
    `SELECT lr.*, u.name
     FROM leave_requests lr
     JOIN users u ON lr.user_id=u.id
     WHERE lr.id=?`,
    [leaveId],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({
          message: "Leave request not found.",
        });
      }

      const leave = result[0];

      if (leave.status !== "APPROVED") {
        return res.status(400).json({
          message: "Only approved leave can be started.",
        });
      }

      // Update user status
      db.query(
        `UPDATE users
         SET status='ON_LEAVE'
         WHERE id=?`,
        [leave.user_id]
      );

      // Update today's attendance
     const today = new Date().toISOString().split("T")[0];

db.query(
  `UPDATE attendance
   SET status='ON_LEAVE'
   WHERE user_id=? AND date=?`,
  [leave.user_id, today]
);

      // Notify employee
      db.query(
        `INSERT INTO notifications
        (user_id,title,message,type,sender_id,is_read)
        VALUES(?,?,?,?,?,0)`,
        [
          leave.user_id,
          "Leave Started",
          "Your leave has officially started.",
          "ON_LEAVE",
          req.user.id,
        ]
      );

      res.json({
        success: true,
        message: `${leave.name} is now on leave.`,
      });

    }
  );
};

// ======================================
// RETURN EMPLOYEE TO WORK
// ======================================
exports.returnToWork = (req, res) => {

  const leaveId = req.params.id;

  db.query(
    `SELECT lr.*,u.name
     FROM leave_requests lr
     JOIN users u
       ON lr.user_id=u.id
     WHERE lr.id=?`,
    [leaveId],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({
          message: "Leave request not found.",
        });
      }

      const leave = result[0];

      db.query(
        `UPDATE users
         SET status='NOT_IN_OFFICE'
         WHERE id=?`,
        [leave.user_id]
      );
const today = new Date().toISOString().split("T")[0];

db.query(
  `UPDATE attendance
   SET status='NOT_IN_OFFICE'
   WHERE user_id=? AND date=?`,
  [leave.user_id, today]
);
      
      db.query(
        `INSERT INTO notifications
        (user_id,title,message,type,sender_id,is_read)
        VALUES(?,?,?,?,?,0)`,
        [
          leave.user_id,
          "Welcome Back",
          "You have been returned to work. You may now check in.",
          "RETURN_TO_WORK",
          req.user.id,
        ]
      );

      res.json({
        success: true,
        message: `${leave.name} has returned to work.`,
      });

    }
  );
};