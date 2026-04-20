import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authService";
import AuthContext from "../../../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const token = response.data?.token;
      if (token) { login(token); }
      setFormData({ email: "", password: "" });
      navigate("/home");
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Invalid email or password";
      localStorage.removeItem("token");
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <div>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                  <path d="M9 21V12h6v9"/>
                </svg>
              </div>
              <span style={styles.logoText}>PGRentals</span>
            </div>
            <h2 style={styles.leftHeading}>Welcome back</h2>
            <p style={styles.leftSubtext}>
              Sign in to manage your PG listings and bookings.
            </p>
            <div style={styles.featureList}>
              {[
                "Manage your PG properties",
                "Track bookings & payments",
                "Connect with tenants",
              ].map((f) => (
                <div key={f} style={styles.featureItem}>
                  <span style={styles.featureDot} />
                  <span style={styles.featureText}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={styles.copyright}>© 2025 PGRentals. All rights reserved.</p>
        </div>
        <div style={styles.rightPanel}>
          <h3 style={styles.formTitle}>Sign in</h3>
          <p style={styles.formSubtitle}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email" name="email" placeholder="sunilmallela9515@example.com"
                  value={formData.email} onChange={handleChange} required
                  style={{ ...styles.input, paddingRight: "14px" }}
                  onFocus={(e) => { e.target.style.borderColor = "#1c4ed8"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange} required
                  style={styles.input}
                  onFocus={(e) => { e.target.style.borderColor = "#1c4ed8"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right", marginTop: "-6px", marginBottom: "16px" }}>
              <span style={styles.forgotLink}>Forgot password?</span>
            </div>

            <button type="submit" style={styles.submitBtn}>
              Sign in
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{" "}
            <span style={styles.footerLink} onClick={() => navigate("/")}>
              Create one
            </span>
          </p>

          {message.text && (
            <div style={message.type === "error" ? styles.msgError : styles.msgSuccess}>
              {message.text}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",   
  paddingTop: "60px",         
  paddingLeft: "24px",
  paddingRight: "24px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
},
  card: {
    display: "flex",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
    width: "100%",
    maxWidth: "820px",
    border: "1px solid #e5e7eb",
  },
  leftPanel: {
    width: "300px",
    flexShrink: 0,
    background: "#1c4ed8",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff",
  },
  leftHeading: {
    fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700,
    color: "#fff", lineHeight: 1.3, marginBottom: "12px",
  },
  leftSubtext: {
    fontSize: "13.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7,
  },
  featureList: {
    marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px",
  },
  featureItem: { display: "flex", alignItems: "center", gap: "10px" },
  featureDot: {
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#93c5fd", flexShrink: 0,
  },
  featureText: { fontSize: "13px", color: "rgba(255,255,255,0.75)" },
  copyright: { fontSize: "11px", color: "rgba(255,255,255,0.35)" },
  rightPanel: {
    flex: 1, background: "#fff", padding: "40px 44px",
  },
  formTitle: {
    fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700,
    color: "#111827", marginBottom: "6px",
  },
  formSubtitle: {
    fontSize: "13.5px", color: "#6b7280", marginBottom: "28px",
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block", fontSize: "12.5px", fontWeight: 600,
    color: "#374151", marginBottom: "6px",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: "13px", color: "#9ca3af",
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  input: {
    width: "100%", height: "42px",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    padding: "0 42px 0 38px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "13.5px", color: "#111827",
    background: "#f9fafb", outline: "none",
    transition: "border-color 0.15s, background 0.15s",
  },
  eyeBtn: {
    position: "absolute", right: "12px",
    background: "none", border: "none",
    cursor: "pointer", color: "#9ca3af",
    display: "flex", alignItems: "center", padding: "0",
  },
  forgotLink: {
    fontSize: "12.5px", color: "#1c4ed8", fontWeight: 600, cursor: "pointer",
  },
  submitBtn: {
    width: "100%", height: "44px", background: "#1c4ed8",
    color: "#fff", border: "none", borderRadius: "10px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "14px", fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "8px", marginTop: "4px",
  },
  footerText: {
    marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#6b7280",
  },
  footerLink: { color: "#1c4ed8", fontWeight: 600, cursor: "pointer" },
  msgSuccess: {
    background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534",
    borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginTop: "14px",
  },
  msgError: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginTop: "14px",
  },
};

export default LoginPage;