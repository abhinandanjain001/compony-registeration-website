import express from "express";
import { body } from "express-validator";

import {
  register,
  login,
  verifyMobile,
  verifyEmail,
} from "../controllers/authController.js";

import validate from "../middleware/validation.js";

const router = express.Router();

// VALIDATION RULES
const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("fullName").notEmpty().trim(),
  body("mobile").isMobilePhone("any"),
  body("gender").isIn(["male", "female", "other"]).optional(),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

// ROUTES
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/verify-mobile", verifyMobile);
router.get("/verify-email/:token", verifyEmail);

export default router;
