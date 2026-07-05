const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const {
  getProfile,
  updateProfile,
  getAllProfiles,
  uploadProfilePicture,
} = require("../controllers/profile.controller");

// ================= USER ROUTES =================
router.get("/", verifyToken, getProfile);
router.put("/update", verifyToken, updateProfile);
router.post(
  "/upload-picture",
  verifyToken,
  upload.single("profile"),
  uploadProfilePicture
);
// ================= ADMIN ROUTES =================
router.get("/all", verifyToken, isAdmin, getAllProfiles);

module.exports = router;