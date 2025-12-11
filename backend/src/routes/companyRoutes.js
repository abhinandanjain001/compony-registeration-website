// backend/src/routes/companyRoutes.js
import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";

import {
  createCompany,
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  uploadBanner,
} from "../controllers/companyController.js";

const router = express.Router();

// Multer memory storage (buffer will go to Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// Create company profile
router.post("/register", auth, createCompany);

// Get logged-in user's company profile
router.get("/profile", auth, getCompanyProfile);

// Update company profile
router.put("/profile", auth, updateCompanyProfile);

// Upload logo (field name "logo")
router.post(
  "/upload-logo",
  auth,
  upload.single("logo"),
  uploadLogo
);

// Upload banner (field name "banner")
router.post(
  "/upload-banner",
  auth,
  upload.single("banner"),
  uploadBanner
);

export default router;
