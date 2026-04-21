import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updatePg } from "../getPgService";
import { C, FONT, inputBase } from "../../../theme";

const GENDER_OPTIONS = [
  { value: "",       label: "Select gender preference" },
  { value: "MALE",   label: "Male only"               },
  { value: "FEMALE", label: "Female only"             },
  { value: "ANY",    label: "Any gender"              },
];

function validate(f) {
  const e = {};
  if (!f.title.trim())       e.title       = "PG name is required";
  if (!f.location.trim())    e.location    = "Location is required";
  if (!f.description.trim()) e.description = "Description is required";
  if (!f.price || Number(f.price) <= 0) e.price = "Enter a valid rent amount";
  return e;
}

export default function EditPg() {
  const { state }    = useLocation() || {};
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [form, setForm]     = useState({
    title:       state?.title           || "",
    location:    state?.location        || "",
    description: state?.description     || "",
    price:       state?.price           || "",
    gender:      state?.genderPreference|| "",
    ownerName:   state?.ownerName       || "",
  });
  const [errors, setErrors] = useState({});
  const [touch, setTouch]   = useState({});
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touch[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(v => ({ ...v, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouch(t => ({ ...t, [name]: true }));
    const errs = validate(form);
    setErrors(v => ({ ...v, [name]: errs[name] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouch({ title: true, location: true, description: true, price: true });
      return;
    }
    setStatus("loading");
    try {
      await updatePg(id, form);
      setStatus("success");
      setTimeout(() => navigate("/home/listings"), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Update failed.";
      setStatus({ error: typeof msg === "string" ? msg : "Update failed." });
    }
  };

  const inp = (name) => ({
    ...inputBase, paddingLeft: 36,
    borderColor: errors[name] ? "#fca5a5" : C.gray200,
    background:  errors[name] ? "#fff5f5" : C.white,
  });

  return (
    <>
      <style>{`
        @keyframes pgSpin { to { transform: rotate(360deg); } }
        .ep-input:focus { border-color: ${C.blue500} !important; box-shadow: 0 0 0 3px rgba(37,84,224,0.12) !important; outline: none; }
        .ep-input::placeholder { color: ${C.gray300}; font-size: 13px; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div style={S.page}>
        {/* Title bar */}
        <div style={S.titleBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={S.titleIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 9l1.5-1.5M13.5 2L14 2.5l-8 8L4.5 9l9-7z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 14h12" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 style={S.titleText}>Edit PG Listing</h1>
              <p style={S.titleSub}>Update your listing details — changes go live after review</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate("/home/listings")} style={S.backBtn}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to listings
          </button>
        </div>

        <form onSubmit={handleUpdate} noValidate style={S.form}>
          <div style={S.cards}>
            {/* Card 1 — Basic Info */}
            <div style={{ ...S.card, flex: "1.35" }}>
              <div style={{ ...S.cHead, background: "#eff6ff" }}>
                <div style={{ ...S.cIcon, background: "#dbeafe" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke={C.blue600} strokeWidth="1.4"/>
                    <path d="M5 6h6M5 9h4" stroke={C.blue600} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={S.cTitle}>Basic Information</div>
                  <div style={S.cSub}>Update name, location and description</div>
                </div>
              </div>
              <div style={S.cBody}>
                <div style={S.twoCol}>
                  <FormField label="PG Name" required error={errors.title}>
                    <div style={{ position: "relative" }}>
                      <Ico><HomeIco /></Ico>
                      <input className="ep-input" name="title" value={form.title}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="e.g. Green View PG" style={inp("title")} />
                    </div>
                  </FormField>
                  <FormField label="Location" required error={errors.location}>
                    <div style={{ position: "relative" }}>
                      <Ico><PinIco /></Ico>
                      <input className="ep-input" name="location" value={form.location}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="e.g. Koramangala, Bangalore" style={inp("location")} />
                    </div>
                  </FormField>
                </div>
                <FormField label="Owner Name" error={errors.ownerName}>
                  <div style={{ position: "relative" }}>
                    <Ico><PersonIco /></Ico>
                    <input className="ep-input" name="ownerName" value={form.ownerName}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Owner full name" style={inp("ownerName")} />
                  </div>
                </FormField>
                <FormField label="Description" required error={errors.description}>
                  <div style={{ position: "relative" }}>
                    <Ico style={{ top: 11, transform: "none" }}><TextIco /></Ico>
                    <textarea className="ep-input" name="description" value={form.description}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Describe amenities, house rules, nearby landmarks..."
                      style={{ ...inp("description"), height: 88, paddingTop: 9, resize: "none", lineHeight: 1.55 }} />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Card 2 — Pricing */}
            <div style={{ ...S.card, flex: "0.85" }}>
              <div style={{ ...S.cHead, background: "#f0fdf4" }}>
                <div style={{ ...S.cIcon, background: "#dcfce7" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#15803d" strokeWidth="1.4"/>
                    <path d="M8 4.5v7M5.5 6.5c0-.8.9-1.5 2.5-1.5s2.5.6 2.5 1.5-1 1.2-2.5 1.4-2.5.7-2.5 1.6 1 1.5 2.5 1.5 2.5-.5 2.5-1.5"
                      stroke="#15803d" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={S.cTitle}>Pricing & Preferences</div>
                  <div style={S.cSub}>Monthly rent and gender preference</div>
                </div>
              </div>
              <div style={S.cBody}>
                <FormField label="Monthly Rent (₹)" required error={errors.price}>
                  <div style={{ position: "relative" }}>
                    <span style={S.rupeeTag}>₹</span>
                    <input className="ep-input" type="number" name="price" value={form.price}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. 8500"
                      style={{ ...inp("price"), paddingLeft: 44 }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>Enter amount in Indian Rupees</div>
                </FormField>

                <FormField label="Gender Preference">
                  <div style={{ position: "relative" }}>
                    <Ico><PersonIco /></Ico>
                    <select className="ep-input" name="gender" value={form.gender}
                      onChange={handleChange}
                      style={{ ...inputBase, paddingLeft: 36, appearance: "none", cursor: "pointer", borderColor: C.gray200 }}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span style={S.chevron}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke={C.gray400} strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                </FormField>

                {status === "success" && (
                  <div style={{ ...S.toast, background: "#f0fdf4", borderColor: "#86efac", color: "#15803d" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" fill="#16a34a"/><path d="M5 8l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Updated successfully! Redirecting...
                  </div>
                )}
                {status?.error && (
                  <div style={{ ...S.toast, background: C.red50, borderColor: "#fca5a5", color: C.red600 }}>
                    <ErrIco /> {status.error}
                  </div>
                )}

                <div style={S.infoNote}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="8" cy="8" r="6" stroke="#93c5fd" strokeWidth="1.3"/>
                    <path d="M8 7v4M8 5v.5" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <span>Changes will be reviewed by our team before going live.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={S.footer}>
            <span style={{ fontSize: 12, color: C.gray400 }}>
              <span style={{ color: "#e24b4a", fontWeight: 700 }}>* </span>Required fields
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => navigate("/home/listings")}
                style={{ display: "flex", alignItems: "center", gap: 7, height: 38, padding: "0 20px", borderRadius: 8, border: `1.5px solid ${C.gray200}`, background: C.white, fontSize: 13, fontWeight: 500, color: C.gray600, cursor: "pointer", fontFamily: FONT }}>
                Cancel
              </button>
              <button type="submit" disabled={status === "loading" || status === "success"}
                style={{ display: "flex", alignItems: "center", gap: 7, height: 38, padding: "0 22px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.blue600},${C.blue500})`, fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: FONT, cursor: (status === "loading" || status === "success") ? "not-allowed" : "pointer", opacity: (status === "loading" || status === "success") ? 0.8 : 1 }}>
                {status === "loading"
                  ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "pgSpin 0.75s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }
                {status === "loading" ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
        {label} {required && <span style={{ color: "#e24b4a" }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.red600 }}>
          <ErrIco /> {error}
        </div>
      )}
    </div>
  );
}

const Ico      = ({ children, style = {} }) => <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.gray400, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 1, ...style }}>{children}</span>;
const HomeIco  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
const PinIco   = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a4 4 0 014 4c0 3-4 8-4 8S4 9 4 6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const TextIco  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 7h10M3 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const PersonIco= () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const ErrIco   = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M8 2L1.5 13h13L8 2z" stroke={C.red600} strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6.5v3M8 11v.3" stroke={C.red600} strokeWidth="1.4" strokeLinecap="round"/></svg>;

const S = {
  page:     { display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflow: "hidden", padding: "16px 20px", background: C.gray50, fontFamily: FONT },
  titleBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(135deg,#1e40af,#2563eb)`, borderRadius: 12, padding: "14px 20px", marginBottom: 14, flexShrink: 0 },
  titleIcon: { width: 38, height: 38, borderRadius: 9, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  titleText: { fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" },
  titleSub:  { fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 },
  backBtn:   { display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT },
  form:   { display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 },
  cards:  { display: "flex", gap: 14, flex: 1, minHeight: 0 },
  card:   { background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", minHeight: 0 },
  cHead:  { display: "flex", alignItems: "center", gap: 11, padding: "11px 16px", borderBottom: `1px solid ${C.gray100}`, flexShrink: 0 },
  cIcon:  { width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cTitle: { fontSize: 12.5, fontWeight: 700, color: C.gray900 },
  cSub:   { fontSize: 10.5, color: C.gray400, marginTop: 1 },
  cBody:  { padding: "14px 16px", flex: 1, overflowY: "auto" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  rupeeTag: { position: "absolute", left: 0, top: 0, bottom: 0, width: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRight: `1.5px solid ${C.gray200}`, fontSize: 13, fontWeight: 700, color: C.gray500, pointerEvents: "none", zIndex: 1, borderRadius: "8px 0 0 8px" },
  chevron:  { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" },
  toast:    { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "1px solid", fontSize: 12, fontWeight: 500, marginBottom: 10 },
  infoNote: { display: "flex", alignItems: "flex-start", gap: 8, background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: 8, padding: "9px 12px", fontSize: 11, color: C.blue600, lineHeight: 1.55, marginTop: 4 },
  footer:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
};
