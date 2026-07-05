const db = require("../config/db");

// GET MY PROFILE
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT
      id,
      name,
      email,
      phone,
      address,
      gender,
      position,
      department,
      role,
      profile_picture,
      annual_leave_balance
    FROM users
    WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// UPDATE PROFILE
exports.updateProfile = (req, res) => {
  const userId = req.user.id;

  const {
    name,
    email,
    phone,
    address,
    gender,
    position,
  } = req.body;

  console.log("UPDATE REQUEST USER:", req.user);
  console.log("UPDATE BODY:", req.body);

  db.query(
    `
    UPDATE users
    SET
      name=?,
      email=?,
      phone=?,
      address=?,
      gender=?,
      position=?
    WHERE id=?
    `,
    [name, email, phone, address, gender, position, userId],
   (err) => {
  if (err) {
    console.log("❌ UPDATE ERROR:", err.sqlMessage || err.message);
    return res.status(500).json({
      success: false,
      error: err.sqlMessage || err.message,
    });
  }

  res.json({
    success: true,
    message: "Profile updated successfully",
  });
}
  );
};
// ADMIN: GET ALL USERS FULL PROFILE
exports.getAllProfiles = (req, res) => {
  db.query(
   "SELECT id, name, email, phone, address, gender, position, department, role, profile_picture, annual_leave_balance FROM users",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        total: result.length,
        users: result
      });
    }
  );
};
// UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded",
    });
  }

  const imagePath = `/uploads/profiles/${req.file.filename}`;

  db.query(
    "UPDATE users SET profile_picture=? WHERE id=?",
    [imagePath, userId],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to upload picture",
        });
      }

      res.json({
        success: true,
        message: "Profile picture updated",
        image: imagePath,
      });
    }
  );
};
// ======================
// GET EMPLOYEES
// ======================
exports.getEmployees = (req, res) => {
  db.query(
    `SELECT
        id,
        name,
        department,
        position
     FROM users
     WHERE role='user'
     ORDER BY name`,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};