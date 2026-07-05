const db = require("../config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// ======================= REGISTER =======================
exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if email already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({
            message: err.sqlMessage || err.message,
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if this is the first user
        db.query(
          "SELECT COUNT(*) AS count FROM users",
          (err, data) => {
            if (err) {
              console.error("Database Error:", err);
              return res.status(500).json({
                message: err.sqlMessage || err.message,
              });
            }

            const role =
              data[0].count === 0 ? "admin" : "user";

            // Insert user
            db.query(
              "INSERT INTO users (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)",
              [name, email, hashedPassword, department, role],
              (err, result) => {
                if (err) {
                  console.error("Insert Error:", err);
                  return res.status(500).json({
                    message: err.sqlMessage || err.message,
                  });
                }

                return res.status(201).json({
                  success: true,
                  message: "User registered successfully.",
                  role,
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================= LOGIN =======================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: err.sqlMessage || err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Wrong password.",
        });
      }

      // 🔥 FIX: ensure token contains id
      const token = generateToken({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
        },
      });
    }
  );
};