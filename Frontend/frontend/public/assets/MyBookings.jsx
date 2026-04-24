import React, { useEffect, useState } from "react";
import { getMyBookings } from "../myBooking";
import { useNavigate } from "react-router-dom";

// ── icons ─────────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const RupeeIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 3h12M6 8h12M6 13h8a4 4 0 0 0 0-8M6 21l8-8" />
  </svg>
);
const HomeIconSm = () => (
  <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const EmptyBoxIcon = () => (
  <svg width="56" height="56" fill="none" stroke="#d1d5db" strokeWidth="1.2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
  </svg>
);
const XCircleIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: "Pending",   bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", border: "#FDE68A", icon: <ClockIcon /> },
  APPROVED:  { label: "Approved",  bg: "#D1FAE5", color: "#065F46", dot: "#10B981", border: "#A7F3D0", icon: <CheckCircleIcon /> },
  REJECTED:  { label: "Rejected",  bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", border: "#FECACA", icon: <XCircleIcon /> },
  CANCELLED: { label: "Cancelled", bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF", border: "#E5E7EB", icon: null },
};

const GRADIENTS = [
  "linear-gradient(135deg,#c7d2fe,#a5f3fc)",
  "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  "linear-gradient(135deg,#d1fae5,#a7f3d0)",
  "linear-gradient(135deg,#fef3c7,#fde68a)",
  "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
  "linear-gradient(135deg,#cffafe,#a5f3fc)",
];

const INFO_MSG = {
  APPROVED:  { bg: "#F0FDF4", color: "#065F46", text: "Your visit has been approved — the owner will contact you shortly." },
  REJECTED:  { bg: "#FEF2F2", color: "#991B1B", text: "This request was declined. You can explore and book other PGs." },
  PENDING:   { bg: "#FFFBEB", color: "#92400E", text: "Awaiting owner confirmation. We'll notify you once confirmed." },
  CANCELLED: { bg: "#F9FAFB", color: "#6B7280", text: "This booking was cancelled." },
};

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
const fmtPrice = (p) => p ? "₹" + Number(p).toLocaleString("en-IN") + "/mo" : null;

// ── skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ ...S.card, display: "flex", overflow: "hidden", minHeight: 100 }}>
      <div style={{ width: 4, background: "#f3f4f6", flexShrink: 0 }} />
      <div style={{ width: 88, background: "#f3f4f6", flexShrink: 0, animation: "mpulse 1.4s ease-in-out infinite" }} />
      <div style={{ flex: 1, padding: "16px 20px" }}>
        {[55, 35, 72].map((w, i) => (
          <div key={i} style={{ height: 11, width: `${w}%`, borderRadius: 6, background: "#f3f4f6", marginBottom: 10, animation: "mpulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ label, count, active, dotColor, onClick }) {
  return (
    <button onClick={onClick} style={{ ...S.pill, ...(active ? S.pillActive : {}) }}>
      {dotColor && <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#fff" : dotColor }} />}
      {label}
      <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: active ? "rgba(255,255,255,0.25)" : "#f3f4f6", color: active ? "#fff" : "#6b7280" }}>
        {count}
      </span>
    </button>
  );
}

// ── booking card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, index, onView }) {
  const [hovered, setHovered] = useState(false);
  const st  = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const msg = INFO_MSG[booking.status];
  const grad = GRADIENTS[index % GRADIENTS.length];

  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}), display: "flex", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* status accent bar */}
      <div style={{ width: 4, flexShrink: 0, background: st.dot }} />

      {/* thumbnail */}
      <div style={{ width: 88, flexShrink: 0, background: grad, position: "relative", minHeight: 110 }}>
        <img
          src={`/assets/Image${(index % 6) + 1}.jpg`}
          alt={booking.pgTitle}
          onError={(e) => { e.target.style.display = "none"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HomeIconSm />
        </div>
      </div>

      {/* main content */}
      <div style={{ flex: 1, padding: "14px 18px", minWidth: 0 }}>
        {/* title + badge row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {booking.pgTitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
            {st.label}
          </div>
        </div>

        {/* meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 10 }}>
          {booking.location   && <span style={S.meta}><LocationIcon />{booking.location}</span>}
          {booking.visitDate  && <span style={S.meta}><CalendarIcon />Visit: {fmtDate(booking.visitDate)}</span>}
          {booking.price      && <span style={S.meta}><RupeeIcon />{fmtPrice(booking.price)}</span>}
        </div>

        {/* info banner */}
        {msg && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: msg.bg, color: msg.color, fontSize: 12, fontWeight: 500, padding: "6px 10px", borderRadius: 7 }}>
            {st.icon}
            {msg.text}
          </div>
        )}
      </div>

      {/* view action */}
      <div style={{ padding: "14px 16px 14px 0", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => onView(booking.pgId)} style={{ ...S.btnOutline, fontSize: 13, padding: "7px 13px", gap: 5 }}>
          View PG <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function MyBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeFilter, setFilter] = useState("ALL");
  const [search, setSearch]       = useState("");
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try   { const r = await getMyBookings(); setBookings(r.data); }
    catch { setError("Could not load your bookings. Please try again."); }
    finally { setLoading(false); }
  };

  const counts = {
    ALL:      bookings.length,
    PENDING:  bookings.filter(b => b.status === "PENDING").length,
    APPROVED: bookings.filter(b => b.status === "APPROVED").length,
    REJECTED: bookings.filter(b => b.status === "REJECTED").length,
  };

  const visible = bookings
    .filter(b => activeFilter === "ALL" || b.status === activeFilter)
    .filter(b => !search ||
      b.pgTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes mpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes mfade  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .mcard { animation: mfade 0.3s ease forwards; }
      `}</style>

      {/* ── page header ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>My Bookings</h1>
          <p style={S.subtitle}>Track all your PG visit requests and their status</p>
        </div>
        <button onClick={() => navigate("/home/browse")} style={S.btnPrimary}>Browse PGs</button>
      </div>

      {/* ── filter pills + stats ── */}
      {!loading && bookings.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { key: "ALL",      label: "All",      dotColor: "#6366f1" },
            { key: "PENDING",  label: "Pending",  dotColor: "#F59E0B" },
            { key: "APPROVED", label: "Approved", dotColor: "#10B981" },
            { key: "REJECTED", label: "Rejected", dotColor: "#EF4444" },
          ].map(({ key, label, dotColor }) => (
            <FilterPill key={key} label={label} count={counts[key]} active={activeFilter === key}
              dotColor={dotColor} onClick={() => setFilter(key)} />
          ))}
        </div>
      )}

      {/* ── search bar ── */}
      {!loading && bookings.length > 0 && (
        <div style={{ position: "relative", marginBottom: 18, display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: 12, color: "#9ca3af", display: "flex", pointerEvents: "none" }}><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search by PG name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={S.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 4 }}>✕</button>
          )}
        </div>
      )}

      {/* ── results count ── */}
      {!loading && visible.length > 0 && (
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
          Showing {visible.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── error ── */}
      {error && (
        <div style={S.errorBanner}>
          <span>{error}</span>
          <button onClick={load} style={{ ...S.btnOutline, padding: "4px 12px", fontSize: 13 }}>Retry</button>
        </div>
      )}

      {/* ── booking list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : visible.length === 0
            ? (
              <div style={S.empty}>
                <EmptyBoxIcon />
                <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginTop: 16, marginBottom: 4 }}>
                  {bookings.length === 0 ? "No bookings yet" : "No results found"}
                </p>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                  {bookings.length === 0
                    ? "Browse PGs and book a visit to get started."
                    : "Try a different search term or filter."}
                </p>
                {bookings.length === 0
                  ? <button onClick={() => navigate("/home/browse")} style={S.btnPrimary}>Browse PGs</button>
                  : <button onClick={() => { setFilter("ALL"); setSearch(""); }} style={S.btnOutline}>Clear filters</button>
                }
              </div>
            )
            : visible.map((b, i) => (
              <div key={b.bookingId} className="mcard" style={{ animationDelay: `${i * 0.05}s` }}>
                <BookingCard booking={b} index={i} onView={pgId => navigate(`/home/view/${pgId}`)} />
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  page:       { padding: "28px 32px", maxWidth: 860, margin: "0 auto", fontFamily: "'DM Sans', system-ui, sans-serif" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  title:      { fontSize: 24, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.2 },
  subtitle:   { fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 },
  pill:       { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", transition: "all 0.15s" },
  pillActive: { background: "#3730a3", color: "#fff", borderColor: "#3730a3" },
  searchInput:{ width: "100%", padding: "9px 36px 9px 36px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box" },
  card:       { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, transition: "border-color 0.15s, box-shadow 0.15s" },
  cardHover:  { borderColor: "#a5b4fc", boxShadow: "0 4px 18px rgba(99,102,241,0.09)" },
  meta:       { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" },
  empty:      { textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center" },
  errorBanner:{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 8, padding: "12px 16px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  btnPrimary: { background: "#3730a3", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  btnOutline: { background: "#fff", color: "#374151", border: "1px solid #e5e7eb", padding: "9px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
};

export default MyBookings;
