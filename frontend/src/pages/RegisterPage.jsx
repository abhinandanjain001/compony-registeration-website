import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[6-9]\d{9}$/;

function getPasswordStrength(pw) {
  let score = 0;
  if (!pw) return { score, label: "Too short" };
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
  return { score, label };
}

export default function RegisterPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    mobile: "",
    gender: "male",
    avatarFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!data.avatarFile) return setPreview(null);
    const url = URL.createObjectURL(data.avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [data.avatarFile]);

  const validate = () => {
    const e = {};
    if (!data.fullName.trim()) e.fullName = "Full name required";
    if (!data.email.trim() || !emailRegex.test(data.email)) e.email = "Valid email required";
    if (!data.mobile.trim() || !mobileRegex.test(data.mobile)) e.mobile = "Valid 10-digit mobile required";
    if (!data.password || data.password.length < 8) e.password = "Password ≥ 8 chars";
    if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords must match";
    return e;
  };

  const handleChange = (field) => (ev) => {
    const val = ev.target?.type === "file" ? ev.target.files[0] : ev.target.value;
    setData((s) => ({ ...s, [field]: val }));
    setErrors((s) => ({ ...s, [field]: undefined }));
    setServerMsg(null);
  };

  const submitPayload = () => {
    // If avatar selected -> FormData, else JSON object
    if (data.avatarFile) {
      const f = new FormData();
      f.append("email", data.email.trim().toLowerCase());
      f.append("password", data.password);
      f.append("fullName", data.fullName.trim());
      f.append("mobile", data.mobile.trim());
      f.append("gender", data.gender);
      f.append("avatar", data.avatarFile);
      return { body: f, opts: {} }; // browser sets Content-Type for FormData
    } else {
      const json = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        fullName: data.fullName.trim(),
        mobile: data.mobile.trim(),
        gender: data.gender,
      };
      return { body: json, opts: { headers: { "Content-Type": "application/json" } } };
    }
  };

  const handleRegister = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setServerMsg(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    if (cancelRef.current) cancelRef.current.cancel("New request");
    cancelRef.current = axios.CancelToken.source();

    try {
      const { body, opts } = submitPayload();
      const res = await axios.post(
        `${API}/api/auth/register`,
        body,
        {
          cancelToken: cancelRef.current.token,
          timeout: 20000,
          ...opts,
        }
      );

      setServerMsg({ type: "success", text: res.data?.message || "Registered successfully" });
      // reset safe fields (keep preview cleared)
      setData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        mobile: "",
        gender: "male",
        avatarFile: null,
      });
      setPreview(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        setServerMsg({ type: "info", text: "Request canceled" });
      } else if (err?.response) {
        // show backend validation errors if provided
        const resp = err.response.data;
        if (resp?.errors && Array.isArray(resp.errors)) {
          const map = {};
          resp.errors.forEach((it) => {
            if (it.field) map[it.field] = it.message || "Invalid value";
          });
          setErrors((s) => ({ ...s, ...map }));
        }
        setServerMsg({ type: "error", text: resp?.error || resp?.message || `Request failed (${err.response.status})` });
      } else {
        setServerMsg({ type: "error", text: err.message || "Network error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const { label: pwLabel } = getPasswordStrength(data.password);

  return (
    <div style={{ maxWidth: 560, margin: "24px auto", padding: 20, fontFamily: "Inter, Arial, sans-serif" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name</label><br />
          <input value={data.fullName} onChange={handleChange("fullName")} style={{ width: "100%", padding: 8 }} />
          {errors.fullName && <div style={{ color: "crimson" }}>{errors.fullName}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input type="email" value={data.email} onChange={handleChange("email")} style={{ width: "100%", padding: 8 }} />
          {errors.email && <div style={{ color: "crimson" }}>{errors.email}</div>}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Mobile</label><br />
            <input value={data.mobile} onChange={handleChange("mobile")} style={{ width: "100%", padding: 8 }} />
            {errors.mobile && <div style={{ color: "crimson" }}>{errors.mobile}</div>}
          </div>

          <div style={{ width: 130 }}>
            <label>Gender</label><br />
            <select value={data.gender} onChange={handleChange("gender")} style={{ width: "100%", padding: 8 }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Password</label><br />
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={data.password} onChange={handleChange("password")} style={{ width: "100%", padding: 8 }} />
              <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 8, top: 6 }}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <small>Strength: {pwLabel}</small>
            {errors.password && <div style={{ color: "crimson" }}>{errors.password}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label>Confirm Password</label><br />
            <input type="password" value={data.confirmPassword} onChange={handleChange("confirmPassword")} style={{ width: "100%", padding: 8 }} />
            {errors.confirmPassword && <div style={{ color: "crimson" }}>{errors.confirmPassword}</div>}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Avatar (optional)</label><br />
          <input type="file" accept="image/*" onChange={handleChange("avatarFile")} />
          {preview && <div style={{ marginTop: 8 }}><img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} /></div>}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 16px", background: "#0b79f7", color: "#fff", border: "none", borderRadius: 6 }}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        {serverMsg && (
          <div style={{ marginTop: 12, color: serverMsg.type === "success" ? "green" : serverMsg.type === "error" ? "crimson" : "#333" }}>
            {serverMsg.text}
          </div>
        )}
      </form>
    </div>
  );
}
