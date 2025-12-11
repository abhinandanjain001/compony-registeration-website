import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches userId and email
    console.log("✓ Auth successful. User:", decoded.userId, "Email:", decoded.email);
    next();
  } catch (err) {
    console.error("✗ Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// THIS IS REQUIRED
export default auth;
