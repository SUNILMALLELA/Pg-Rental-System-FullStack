import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addPg } from "../addPgService";
import AuthContext from "../../../context/AuthContext";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:        "#f1f3f7",
  surface:   "#ffffff",
  border:    "#e4e7ef",
  borderHov: "#c5cad8",
  text:      "#111827",
  textMid:   "#4b5563",
  textSoft:  "#9ca3af",
  accent:    "#1d6af5",
  accentDk:  "#1558d6",
  accentBg:  "#eff4ff",
  accentBd:  "#bfcffd",
  green:     "#16a34a",
  greenBg:   "#f0fdf4",
  greenBd:   "#86efac",
  red:       "#dc2626",
  redBg:     "#fff1f2",
  redBd:     "#fca5a5",
  amber:     "#d97706",
  amberBg:   "#fffbeb",
  font: `"Plus Jakarta Sans", "Segoe UI", sans-serif`,
};

/* ─── Options & helpers ────────────────────────────────────────────────────── */
const GENDER_OPTIONS = [
  { value: "",       label: "Select preference" },
  { value: "MALE",   label: "Male only"         },
  { value: "FEMALE", label: "Female only"       },
  { value: "ANY",    label: "Any gender"        },
];
const INITIAL = { title:"", description:"", location:"", price:"", genderPreference:"" };

function validate(data) {
  const e = {};
  if (!data.title.trim())                      e.title            = "PG name is required";
  if (!data.location.trim())                   e.location         = "Location is required";
  if (!data.description.trim())                e.description      = "Description is required";
  if (!data.price || Number(data.price) <= 0)  e.price            = "Enter a valid rent amount";
  if (!data.genderPreference)                  e.genderPreference = "Select a gender preference";
  return e;
}

function inputStyle(hasErr) {
  return {
    width:"100%", height:40, padding:"0 12px 0 36px",
    border:`1.5px solid ${hasErr ? T.redBd : T.border}`,
    borderRadius:9, fontSize:13, fontFamily:T.font,
    color:T.text, background: hasErr ? T.redBg : "#fafbfc",
    outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s",
    appearance:"none",
  };
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Ico = {
  Home:    () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Pin:     () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2a4 4 0 014 4c0 3-4 8-4 8S4 9 4 6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Text:    () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 7h10M3 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Person:  () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Logout:  () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Check:   () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Alert:   () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6.5v3M8 11v.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Info:    () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Send:    () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 6-12 6V9l8-1-8-1V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  Spin:    () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation:"pgSpin .7s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" strokeWidth="2"/><path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  Chevron: () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Arrow:   () => <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const Wrap   = ({ children }) => <div style={{ position:"relative" }}>{children}</div>;
const IcoPos = ({ top, children }) => (
  <span style={{
    position:"absolute", left:11,
    top: top || "50%", transform: top ? "none" : "translateY(-50%)",
    color:T.textSoft, display:"flex", alignItems:"center",
    pointerEvents:"none", zIndex:1,
  }}>{children}</span>
);

function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:T.textMid, display:"flex", alignItems:"center", gap:3, letterSpacing:"0.01em" }}>
        {label}{required && <span style={{ color:T.red, marginLeft:1 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.red, fontWeight:500 }}><Ico.Alert />{error}</span>}
      {hint && !error && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.amber, fontWeight:500 }}><Ico.Info />{hint}</span>}
    </div>
  );
}

function CardHead({ accent, title, sub, icon }) {
  const palette = accent === "blue"
    ? { bg:"#eff4ff", iconBg:"#dbeafe", color:T.accent }
    : { bg:"#f0fdf4", iconBg:"#dcfce7", color:"#16a34a" };
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"13px 20px", borderBottom:`1px solid ${T.border}`,
      background:palette.bg, flexShrink:0,
    }}>
      <div style={{
        width:32, height:32, borderRadius:9,
        background:palette.iconBg, color:palette.color,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:T.text, letterSpacing:"-0.2px" }}>{title}</div>
        <div style={{ fontSize:11, color:T.textSoft, marginTop:2 }}>{sub}</div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function AddListing() {
  const [data, setData]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touch, setTouch]   = useState({});
  const [status, setStatus] = useState(null);
  const { logout }          = useContext(AuthContext);
  const navigate            = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]:value }));
    if (touch[name]) {
      const errs = validate({ ...data, [name]:value });
      setErrors(v => ({ ...v, [name]:errs[name] }));
    }
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouch(t => ({ ...t, [name]:true }));
    setErrors(v => ({ ...v, [name]:validate(data)[name] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouch({ title:true, location:true, description:true, price:true, genderPreference:true });
      return;
    }
    setStatus("loading");
    try {
      await addPg(data);
      setStatus("success");
      setTimeout(() => navigate("/home/listings"), 2000);
    } catch (err) {
      const msg = typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message || "Something went wrong.";
      setStatus({ error:msg });
    }
  };
  const handleReset = () => { setData(INITIAL); setErrors({}); setTouch({}); setStatus(null); };

  const hasErr   = (n) => touch[n] && errors[n];
  const disabled = status === "loading" || status === "success";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pgSpin  { to { transform: rotate(360deg); } }
        @keyframes pgFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pgPop   { from { opacity:0; transform:scale(.97) translateY(-4px); } to { opacity:1; transform:scale(1) translateY(0); } }

        .pg-input:focus {
          border-color: ${T.accent} !important;
          box-shadow: 0 0 0 3px rgba(29,106,245,.1) !important;
          background: #fff !important;
          outline: none;
        }
        .pg-input:hover:not(:focus) { border-color: ${T.borderHov} !important; }
        .pg-input::placeholder { color:#c2c6d0; font-size:12.5px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }

        .pg-scroll::-webkit-scrollbar { width:4px; }
        .pg-scroll::-webkit-scrollbar-track { background:transparent; }
        .pg-scroll::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px; }

        .pg-ghost {
          height:38px; padding:0 18px; border-radius:9px;
          border:1.5px solid ${T.border}; background:transparent;
          color:${T.textMid}; font-size:13px; font-weight:600;
          font-family:${T.font}; cursor:pointer; transition:all .15s;
        }
        .pg-ghost:hover { background:${T.bg}; border-color:${T.borderHov}; color:${T.text}; }

        .pg-logout:hover { background:${T.redBg} !important; border-color:${T.redBd} !important; color:${T.red} !important; }

        .pg-root { animation: pgFadeUp .3s ease both; }
      `}</style>

      <div className="pg-root" style={{
        display:"flex", flexDirection:"column",
        height:"calc(100vh - 56px)",
        overflow:"hidden", padding:"18px 24px",
        background:T.bg, fontFamily:T.font,
      }}>

        {/* ── Title bar ──────────────────────────────────────────────── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:13, padding:"12px 20px", marginBottom:16, flexShrink:0,
          boxShadow:"0 1px 6px rgba(0,0,0,.05)",
        }}>
          {/* Left: icon + title */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{
              width:40, height:40, borderRadius:11,
              background:`linear-gradient(135deg,${T.accentDk},${T.accent})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 12px rgba(29,106,245,.28)`, flexShrink:0,
            }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <h1 style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"-0.4px" }}>
                  Add New PG Listing
                </h1>
                <span style={{
                  fontSize:10, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase",
                  color:T.accent, background:T.accentBg, border:`1px solid ${T.accentBd}`,
                  padding:"2px 8px", borderRadius:20,
                }}>Draft</span>
              </div>
              <p style={{ fontSize:11.5, color:T.textSoft, marginTop:2 }}>
                All fields marked <span style={{ color:T.red, fontWeight:700 }}>*</span> are required · Listing goes live after review
              </p>
            </div>
          </div>

          {/* Right: breadcrumb + logout */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.textSoft }}>
              <span>Listings</span>
              <Ico.Arrow />
              <span style={{ color:T.accent, fontWeight:600 }}>Add new</span>
            </div>
            <div style={{ width:1, height:18, background:T.border }} />
            <button onClick={logout} type="button" className="pg-logout" style={{
              display:"flex", alignItems:"center", gap:6,
              height:34, padding:"0 14px", borderRadius:8,
              border:`1.5px solid ${T.border}`, background:"transparent",
              color:T.textMid, fontSize:12, fontWeight:600, fontFamily:T.font,
              cursor:"pointer", transition:"all .15s",
            }}>
              <Ico.Logout /> Sign out
            </button>
          </div>
        </div>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate style={{
          display:"flex", flexDirection:"column", gap:14, flex:1, minHeight:0,
        }}>
          {/* Two-card row */}
          <div style={{ display:"flex", gap:16, flex:1, minHeight:0 }}>

            {/* ── Card 1: Basic Info ───────────────────────────────── */}
            <div style={{
              flex:"1.35", background:T.surface,
              border:`1px solid ${T.border}`, borderRadius:13,
              overflow:"hidden", display:"flex", flexDirection:"column",
              boxShadow:"0 2px 8px rgba(0,0,0,.04)", minHeight:0,
            }}>
              <CardHead
                accent="blue" title="Basic Information"
                sub="PG name, location and a compelling description"
                icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              />
              <div className="pg-scroll" style={{ padding:"18px 20px", flex:1, overflowY:"auto" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Field label="PG Name" required error={errors.title}>
                    <Wrap>
                      <IcoPos><Ico.Home /></IcoPos>
                      <input className="pg-input" name="title" value={data.title}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="e.g. Green View PG"
                        style={inputStyle(hasErr("title"))} />
                    </Wrap>
                  </Field>
                  <Field label="Location" required error={errors.location}>
                    <Wrap>
                      <IcoPos><Ico.Pin /></IcoPos>
                      <input className="pg-input" name="location" value={data.location}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="e.g. Koramangala, Bangalore"
                        style={inputStyle(hasErr("location"))} />
                    </Wrap>
                  </Field>
                </div>

                <Field label="Description" required error={errors.description}
                 >
                  <Wrap>
                    <IcoPos top={12}><Ico.Text /></IcoPos>
                    <textarea className="pg-input" name="description" value={data.description}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Describe amenities, house rules, nearby landmarks, metro distance..."
                      style={{ ...inputStyle(hasErr("description")), height:96, paddingTop:10, resize:"none", lineHeight:1.6 }} />
                  </Wrap>
                </Field>

                {/* Amber tip strip */}
                <div style={{
                  display:"flex", alignItems:"flex-start", gap:8,
                  padding:"9px 12px", borderRadius:9,
                  background:T.amberBg, border:"1px solid #fde68a",
                  fontSize:11.5, color:"#92400e", lineHeight:1.55, marginTop:2,
                }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                    <circle cx="8" cy="8" r="6" stroke="#d97706" strokeWidth="1.3"/>
                    <path d="M8 5v3.5M8 10.5v.3" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <span><strong style={{ fontWeight:700 }}>Pro tip:</strong> Mention WiFi speed, meal plan, AC, and nearest metro station to stand out.</span>
                </div>
              </div>
            </div>

            {/* ── Card 2: Pricing ─────────────────────────────────── */}
            <div style={{
              flex:"0.85", background:T.surface,
              border:`1px solid ${T.border}`, borderRadius:13,
              overflow:"hidden", display:"flex", flexDirection:"column",
              boxShadow:"0 2px 8px rgba(0,0,0,.04)", minHeight:0,
            }}>
              <CardHead
                accent="emerald" title="Pricing & Preferences"
                sub="Monthly rent and tenant gender preference"
                icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5v7M5.5 6.5c0-.8.9-1.5 2.5-1.5s2.5.6 2.5 1.5-1 1.2-2.5 1.4-2.5.7-2.5 1.6 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
              />
              <div className="pg-scroll" style={{ padding:"18px 20px", flex:1, overflowY:"auto" }}>

                <Field label="Monthly Rent (₹)" required error={errors.price}>
                  <Wrap>
                    <span style={{
                      position:"absolute", left:0, top:0, bottom:0, width:38,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      borderRight:`1.5px solid ${T.border}`, borderRadius:"9px 0 0 9px",
                      fontSize:14, fontWeight:800, color:T.accent,
                      background:T.accentBg, pointerEvents:"none", zIndex:1,
                    }}>₹</span>
                    <input className="pg-input" type="number" name="price" value={data.price}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. 8500"
                      style={{ ...inputStyle(hasErr("price")), paddingLeft:48 }} />
                  </Wrap>
                  <span style={{ fontSize:11, color:T.textSoft }}>Enter amount in Indian Rupees</span>
                </Field>

                <Field label="Gender Preference" required error={errors.genderPreference}>
                  <Wrap>
                    <IcoPos><Ico.Person /></IcoPos>
                    <select className="pg-input" name="genderPreference" value={data.genderPreference}
                      onChange={handleChange} onBlur={handleBlur}
                      style={{ ...inputStyle(hasErr("genderPreference")), cursor:"pointer" }}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", color:T.textSoft, pointerEvents:"none" }}>
                      <Ico.Chevron />
                    </span>
                  </Wrap>
                </Field>

                {/* Thin divider */}
                <div style={{ height:1, background:T.border, margin:"2px 0 14px" }} />

                {/* Success toast */}
                {status === "success" && (
                  <div style={{
                    display:"flex", alignItems:"flex-start", gap:10,
                    padding:"11px 13px", borderRadius:10,
                    background:T.greenBg, border:`1.5px solid ${T.greenBd}`,
                    fontSize:12.5, color:"#14532d", fontWeight:500, marginBottom:12,
                    animation:"pgPop .25s ease both",
                  }}>
                    <span style={{
                      width:20, height:20, borderRadius:"50%", background:T.green,
                      color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0, marginTop:1,
                    }}><Ico.Check /></span>
                    <div>
                      <div style={{ fontWeight:700, marginBottom:2 }}>Listing submitted!</div>
                      <div style={{ opacity:.75, fontSize:11.5 }}>Redirecting to your listings…</div>
                    </div>
                  </div>
                )}

                {/* Error toast */}
                {status?.error && (
                  <div style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 13px", borderRadius:10,
                    background:T.redBg, border:`1.5px solid ${T.redBd}`,
                    fontSize:12.5, color:T.red, fontWeight:500, marginBottom:12,
                    animation:"pgPop .25s ease both",
                  }}>
                    <Ico.Alert /> {status.error}
                  </div>
                )}

                {/* Info note */}
                <div style={{
                  display:"flex", alignItems:"flex-start", gap:9,
                  background:T.accentBg, border:`1px solid ${T.accentBd}`,
                  borderRadius:10, padding:"10px 13px",
                  fontSize:11.5, color:"#1e40af", lineHeight:1.6,
                }}>
                  <span style={{ flexShrink:0, marginTop:2, color:T.accent, display:"flex" }}><Ico.Info /></span>
                  <span>Listing goes live after our team review — usually within <strong style={{ fontWeight:700 }}>24 hours</strong>.</span>
                </div>

                {/* Quick stats */}
                <div style={{
                  display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14,
                }}>
                  
                      
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"11px 18px",
            background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:11, flexShrink:0,
            boxShadow:"0 -1px 0 rgba(0,0,0,.03)",
          }}>
            <span style={{ fontSize:12, color:T.textSoft, display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ color:T.red, fontWeight:700, fontSize:14 }}>*</span> Required fields
            </span>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <button type="button" className="pg-ghost" onClick={handleReset}>Discard</button>
              <button type="submit" disabled={disabled} style={{
                display:"flex", alignItems:"center", gap:8,
                height:38, padding:"0 22px", borderRadius:9, border:"none",
                background: disabled
                  ? "#93b8fc"
                  : `linear-gradient(135deg,${T.accentDk},${T.accent})`,
                fontSize:13, fontWeight:700, color:"#fff", fontFamily:T.font,
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: disabled ? "none" : "0 4px 14px rgba(29,106,245,.32)",
                transition:"all .15s", letterSpacing:"-0.1px",
              }}>
                {status === "loading" ? <Ico.Spin /> : <Ico.Send />}
                {status === "loading" ? "Submitting…" : "Submit Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
