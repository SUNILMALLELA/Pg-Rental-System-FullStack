import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../authService";

const C = {
  blue600: "#1c4ed8", blue500: "#2563eb", blue50: "#eff6ff",
  gray900: "#111827", gray600: "#4b5563", gray500: "#6b7280",
  gray400: "#9ca3af", gray200: "#e5e7eb", gray50: "#f9fafb",
  white: "#ffffff", red600: "#dc2626", red50: "#fef2f2",
};

const FONT = "'Plus Jakarta Sans', sans-serif";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${FONT}; }
  @keyframes pgFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pgSpin { to { transform: rotate(360deg); } }
  .pg-input {
    width: 100%; height: 42px;
    border: 1.5px solid ${C.gray200}; border-radius: 10px;
    padding: 0 14px 0 38px;
    font-family: ${FONT}; font-size: 13.5px; color: ${C.gray900};
    background: ${C.gray50}; outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .pg-input:focus {
    border-color: ${C.blue500};
    background: ${C.white};
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .pg-btn-primary {
    width: 100%; height: 44px; background: ${C.blue600};
    color: #fff; border: none; border-radius: 10px;
    font-family: ${FONT}; font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 8px;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 2px 8px rgba(28,78,216,0.25);
  }
  .pg-btn-primary:hover:not(:disabled) { background: ${C.blue500}; box-shadow: 0 4px 14px rgba(28,78,216,0.35); }
  .pg-btn-primary:active:not(:disabled) { transform: translateY(1px); }
  .pg-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const ROLES = [
  { value: "USER",  label: "Tenant" },
  { value: "OWNER", label: "Owner" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", phoneNumber: "", email: "", password: "", role: "USER",
  });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus]   = useState(null); // null | "loading" | { error } | { success }
  const navigate              = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName    = "Full name is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{10,13}$/.test(form.phoneNumber.replace(/\s/g, "")))
      e.phoneNumber = "Enter a valid phone number";
    if (!form.email.trim())       e.email       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)           e.password    = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(v => ({ ...v, [name]: undefined }));
    if (status?.error) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    try {
      const response = await registerUser(form);
      setStatus({ success: typeof response.data === "string" ? response.data : "Account created successfully!" });
      setForm({ fullName: "", phoneNumber: "", email: "", password: "", role: "USER" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const msg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Registration failed. Please try again.";
      setStatus({ error: msg });
    }
  };

  const inp = (name) => ({
    borderColor: errors[name] ? "#fca5a5" : C.gray200,
    background:  errors[name] ? "#fff5f5" : C.gray50,
  });

  return (
    <>
      <style>{GLOBAL_CSS + `
        .auth-page {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; background: ${C.gray50}; padding: 20px;
        }
        .auth-card {
          display: flex; width: 940px; max-width: 100%; min-height: 560px;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          animation: pgFadeIn 0.3s ease;
        }
        .auth-left {
          flex: 0.9; background: linear-gradient(160deg, ${C.blue600} 0%, #1e40af 60%, #1e3a8a 100%);
          padding: 44px 40px; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px; background: rgba(255,255,255,0.06); border-radius: 50%;
        }
        .auth-left::after {
          content: ''; position: absolute; bottom: -80px; left: -40px;
          width: 280px; height: 280px; background: rgba(255,255,255,0.04); border-radius: 50%;
        }
        .auth-right {
          flex: 1.2; background: ${C.white}; padding: 40px 48px;
          display: flex; flex-direction: column; justify-content: center; overflow-y: auto;
        }
        .auth-feature {
          display: flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.85); font-size: 13.5px; margin-bottom: 12px;
        }
        .auth-feature-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.6); flex-shrink: 0;
        }
        .field-err {
          font-size: 11px; color: ${C.red600}; margin-top: 4px;
          display: flex; align-items: center; gap: 5px;
        }
        .role-btn {
          flex: 1; height: 38px; border: 1.5px solid ${C.gray200};
          border-radius: 8px; background: ${C.white}; color: ${C.gray600};
          font-size: 12.5px; font-weight: 500; font-family: ${FONT};
          cursor: pointer; transition: all 0.15s;
        }
        .role-btn.active {
          border-color: ${C.blue500}; background: ${C.blue50};
          color: ${C.blue600}; font-weight: 600;
        }
        @media (max-width: 680px) {
          .auth-left { display: none; }
          .auth-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">

          {/* Left panel */}
          <div className="auth-left">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40, position:"relative", zIndex:1 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ color:"#fff", fontWeight:700, fontSize:16, letterSpacing:"-0.3px", fontFamily:"'Sora', sans-serif" }}>PGRentals</span>
            </div>

            <div style={{ position:"relative", zIndex:1, flex:1 }}>
              <h2 style={{ color:"#fff", fontSize:24, fontWeight:700, lineHeight:1.3, marginBottom:12, fontFamily:"'Sora', sans-serif" }}>
                Join thousands of owners
              </h2>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13.5, lineHeight:1.6, marginBottom:32 }}>
                List your PG and start getting tenants today.
              </p>
              {["Free to list your property", "Verified tenant profiles", "Instant booking alerts"].map(f => (
                <div className="auth-feature" key={f}>
                  <span className="auth-feature-dot" />
                  {f}
                </div>
              ))}

              {/* Stats strip */}
              <div style={{ display:"flex", gap:20, marginTop:36 }}>
                {[["2,400+", "PGs Listed"], ["18k+", "Happy Tenants"], ["4.8★", "Avg Rating"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:17 }}>{n}</div>
                    <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11, position:"relative", zIndex:1, marginTop:20 }}>
              © 2025 PGRentals. All rights reserved.
            </p>
          </div>

          {/* Right panel */}
          <div className="auth-right">
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:21, fontWeight:700, color:C.gray900, marginBottom:5, fontFamily:"'Sora', sans-serif" }}>Create account</h1>
              <p style={{ fontSize:13, color:C.gray500 }}>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column" }}>

              {/* Full name + Phone */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <div style={{ position:"relative" }}>
                    <span style={iconStyle}><PersonIcon /></span>
                    <input className="pg-input" name="fullName" value={form.fullName}
                      onChange={handleChange} placeholder="Sunil Reddy" style={inp("fullName")} />
                  </div>
                  {errors.fullName && <div className="field-err"><ErrIcon />{errors.fullName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Phone number</label>
                  <div style={{ position:"relative" }}>
                    <span style={iconStyle}><PhoneIcon /></span>
                    <input className="pg-input" name="phoneNumber" value={form.phoneNumber}
                      onChange={handleChange} placeholder="+91 9000000000" style={inp("phoneNumber")} />
                  </div>
                  {errors.phoneNumber && <div className="field-err"><ErrIcon />{errors.phoneNumber}</div>}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Email address</label>
                <div style={{ position:"relative" }}>
                  <span style={iconStyle}><MailIcon /></span>
                  <input className="pg-input" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com" style={inp("email")} />
                </div>
                {errors.email && <div className="field-err"><ErrIcon />{errors.email}</div>}
              </div>

              {/* Password + Role */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position:"relative" }}>
                    <span style={iconStyle}><LockIcon /></span>
                    <input className="pg-input" type={showPwd ? "text" : "password"} name="password"
                      value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                      style={{ ...inp("password"), paddingRight:38 }} />
                    <button type="button" onClick={() => setShowPwd(s => !s)}
                      style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.gray400, padding:3, display:"flex", alignItems:"center" }}>
                      {showPwd ? <EyeOff /> : <EyeOn />}
                    </button>
                  </div>
                  {errors.password && <div className="field-err"><ErrIcon />{errors.password}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Register as</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {ROLES.map(r => (
                      <button key={r.value} type="button"
                        className={`role-btn${form.role === r.value ? " active" : ""}`}
                        onClick={() => setForm(f => ({ ...f, role: r.value }))}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error banner */}
              {status?.error && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:8, border:"1px solid #fca5a5", background:C.red50, color:C.red600, fontSize:12.5, fontWeight:500, marginBottom:14 }}>
                  <ErrIcon color={C.red600} /> {status.error}
                </div>
              )}

              {/* Success banner */}
              {status?.success && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:8, border:"1px solid #bbf7d0", background:"#f0fdf4", color:"#166534", fontSize:12.5, fontWeight:500, marginBottom:14 }}>
                  ✓ {status.success} Redirecting to login...
                </div>
              )}

              <button type="submit" disabled={status === "loading" || status?.success} className="pg-btn-primary" style={{ marginTop:4 }}>
                {status === "loading" ? <Spinner /> : <ArrowRight />}
                {status === "loading" ? "Creating account..." : "Create account"}
              </button>

              <p style={{ textAlign:"center", fontSize:13, color:C.gray500, marginTop:18 }}>
                Already have an account?{" "}
                <span
                  style={{ color:C.blue500, fontWeight:600, cursor:"pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

const labelStyle = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 };
const iconStyle  = { position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", alignItems:"center", pointerEvents:"none", zIndex:1 };

const PersonIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const PhoneIcon  = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 2h3l1.5 3.5-2 1.2a8 8 0 004 4l1.2-2L14 10v3a1 1 0 01-1 1A11 11 0 012 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
const MailIcon   = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.4"/></svg>;
const LockIcon   = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4"/></svg>;
const ErrIcon    = ({ color = "#dc2626" }) => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}><path d="M8 2L1.5 13h13L8 2z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6.5v3M8 11v.3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
const EyeOn      = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>;
const EyeOff     = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0010 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M4.2 4.3C2.5 5.4 1 8 1 8s3 5 7 5c1.4 0 2.7-.5 3.8-1.2M7 3.1A7 7 0 0115 8s-.8 1.6-2.2 2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Spinner    = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation:"pgSpin 0.75s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>;
