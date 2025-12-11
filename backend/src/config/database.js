import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Uncomment if you're using Render / Railway / Supabase / Cloud DB
  // ssl: { rejectUnauthorized: false }
});

// OPTIONAL → Log successful connection
pool.connect()
  .then(() => console.log("🟢 Connected to PostgreSQL"))
  .catch((err) => console.error("🔴 PostgreSQL Connection Error:", err));

// Export usable database query function
export const query = (text, params) => pool.query(text, params);

// Also export the pool if needed elsewhere
export default pool;
