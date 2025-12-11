import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password, fullName, gender, mobile } = req.body;

    // Check if user exists
    const userExists = await db.query(
      "SELECT * FROM users WHERE email = $1 OR mobile = $2",
      [email, mobile]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.query(
      `INSERT INTO users (email, password_hash, full_name, gender, mobile)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, mobile`,
      [email, passwordHash, fullName, gender, mobile]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        fullName: newUser.rows[0].full_name,
        mobile: newUser.rows[0].mobile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        mobile: user.rows[0].mobile,
        isEmailVerified: user.rows[0].is_email_verified,
        isMobileVerified: user.rows[0].is_mobile_verified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// STUBS (you will implement later)
export const verifyMobile = async (req, res) => {
  res.json({ message: "Mobile verification placeholder" });
};

export const verifyEmail = async (req, res) => {
  res.json({ message: "Email verification placeholder" });
};
