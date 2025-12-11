import db from "../config/database.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// ================ CREATE COMPANY ================
export const createCompany = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Validate userId exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User ID missing" });
    }
    
    const {
      companyName,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      industry
    } = req.body;

    // Validate required fields
    if (!companyName || !city || !country || !state || !postalCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Creating company for userId:", userId);
    console.log("Company data:", { companyName, address, city, state, country, postalCode, website, industry });

    const newCompany = await db.query(
      `INSERT INTO company_profiles 
       (owner_id, company_name, address, city, state, country, postal_code, website, industry)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        userId,
        companyName,
        address || null,
        city,
        state,
        country,
        postalCode,
        website || null,
        industry || null,
      ]
    );

    res.status(201).json({
      success: true,
      company: newCompany.rows[0],
    });
  } catch (err) {
    console.error("Company creation error:", err.message, err.code, err.detail);
    res.status(500).json({ error: "Failed to create company profile", details: err.message });
  }
};

// ============== GET COMPANY PROFILE ==============
export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const company = await db.query(
      "SELECT * FROM company_profiles WHERE owner_id = $1 LIMIT 1",
      [userId]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    res.json({
      success: true,
      company: company.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch company profile" });
  }
};

// ============== UPDATE COMPANY PROFILE ==============
export const updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      companyName,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      industry,
    } = req.body;

    const updated = await db.query(
      `UPDATE company_profiles 
       SET company_name=$1, address=$2, city=$3, state=$4, country=$5,
           postal_code=$6, website=$7, industry=$8, updated_at=NOW()
       WHERE owner_id = $9
       RETURNING *`,
      [
        companyName,
        address,
        city,
        state,
        country,
        postalCode,
        website,
        industry,
        userId,
      ]
    );

    res.json({
      success: true,
      company: updated.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update company profile" });
  }
};

// ================ UPLOAD LOGO TO CLOUDINARY =================
export const uploadLogo = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "company_logos" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        await db.query(
          `UPDATE company_profiles SET logo_url=$1 WHERE owner_id=$2`,
          [result.secure_url, userId]
        );

        res.json({ success: true, logoUrl: result.secure_url });
      }
    );

    uploadResult.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logo upload failed" });
  }
};

// ================ UPLOAD BANNER TO CLOUDINARY =================
export const uploadBanner = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "company_banners" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        await db.query(
          `UPDATE company_profiles SET banner_url=$1 WHERE owner_id=$2`,
          [result.secure_url, userId]
        );

        res.json({ success: true, bannerUrl: result.secure_url });
      }
    );

    uploadResult.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Banner upload failed" });
  }
};
