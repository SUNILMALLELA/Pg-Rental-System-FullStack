import React, { useEffect, useState } from "react";
import { getOwnerBookings, updateBookingStatus } from "../ownerBooking";
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
const UserIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const HomeIconSm = () => (
  <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const EmptyBoxIcon = () => (
  <svg width="56" height="56" fill="none" stroke="#d1d5db" strokeWidth="1.2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const MessageIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: "Pending",   bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", border: "#FDE68A" },
  APPROVED:  { label: "Approved",  bg: "#D1FAE5", color: "#065F46", dot: "#10B981", border: "#A7F3D0" },
  REJECTED:  { label: "Rejected",  bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", border: "#FECACA" },
  CANCELLED: { label: "Cancelled", bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF", border: "#E5E7EB" },
};

const GRADIENTS = [
  "linear-gradient(135deg,#c7d2fe,#a5f3fc)",
  "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  "linear-gradient(135deg,#d1fae5,#a7f3d0)",
  "linear-gradient(135deg,#fef3c7,#fde68a)",
  "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
  "linear-gradient(135deg,#cffafe,#a5f3fc)",
];

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  : null;

// ── skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ ...S.card, display: "flex", overflow: "hidden", minHeight: 110 }}>
      <div style={{ width: 4, background: "#f3f4f6", flexShrink: 0 }} />
      <div style={{ width: 88, background: "#f3f4f6", flexShrink: 0, animation: "opulse 1.4s ease-in-out infinite" }} />
      <div style={{ flex: 1, padding: "16px 20px" }}>
        {[50, 33, 65, 40].map((w, i) => (
          <div key={i} style={{ height: 11, width: `${w}%`, borderRadius: 6, background: "#f3f4f6", marginBottom: 10, animation: "opulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
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

// ── confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ action, pgTitle, tenantName, onConfirm, onCancel, loading }) {
  const isApprove = action === "APPROVED";
  return (
    <div
      style={S.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ ...S.modal, animation: "mslide 0.25s ease forwards" }}>
        {/* icon */}
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: isApprove ? "#D1FAE5" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: isApprove ? "#065F46" : "#991B1B" }}>
          {isApprove ? <CheckIcon /> : <XIcon />}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", textAlign: "center", marginBottom: 8 }}>
          {isApprove ? "Approve this request?" : "Reject this request?"}
        </h3>
        <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
          {isApprove
            ? <>You're approving <strong style={{ color: "#111827" }}>{tenantName || "the tenant"}</strong>'s visit to <strong style={{ color: "#111827" }}>{pgTitle}</strong>. They will be notified.</>
            : <>You're rejecting <strong style={{ color: "#111827" }}>{tenantName || "the tenant"}</strong>'s request for <strong style={{ color: "#111827" }}>{pgTitle}</strong>.</>
          }
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ ...S.btnOutline, flex: 1, justifyContent: "center" }}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", border: "none",
              background: isApprove ? "#059669" : "#dc2626", color: "#fff", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing…" : isApprove ? <><CheckIcon /> Approve</> : <><XIcon /> Reject</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── booking card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, index, onAction }) {
  const [hovered, setHovered] = useState(false);
  const st   = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const grad = GRADIENTS[index % GRADIENTS.length];
  const isPending = booking.status === "PENDING";

  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}), display: "flex", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* status accent bar */}
      <div style={{ width: 4, flexShrink: 0, background: st.dot }} />

      {/* pg thumbnail */}
      <div style={{ width: 88, flexShrink: 0, background: grad, position: "relative", minHeight: 120 }}>
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

      {/* content */}
      <div style={{ flex: 1, padding: "14px 18px", minWidth: 0 }}>
        {/* title + status badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {booking.pgTitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
            {st.label}
          </div>
        </div>

        {/* meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 12 }}>
          {booking.tenantName && (
            <span style={S.meta}><UserIcon />{booking.tenantName}</span>
          )}
          {booking.location && (
            <span style={S.meta}><LocationIcon />{booking.location}</span>
          )}
          {booking.visitDate && (
            <span style={S.meta}><CalendarIcon />Visit: {fmtDate(booking.visitDate)}</span>
          )}
          {booking.createdAt && (
            <span style={S.meta}><ClockIcon />Requested: {fmtDate(booking.createdAt)}</span>
          )}
        </div>

        {/* tenant note */}
        {booking.note && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, background: "#F8FAFC", border: "1px solid #e5e7eb", color: "#374151", fontSize: 13, padding: "8px 11px", borderRadius: 8, marginBottom: 12 }}>
            <span style={{ color: "#9ca3af", flexShrink: 0, marginTop: 1 }}><MessageIcon /></span>
            <span style={{ lineHeight: 1.5 }}>{booking.note}</span>
          </div>
        )}

        {/* action buttons (PENDING only) */}
        {isPending && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onAction(booking.bookingId, "APPROVED", booking.pgTitle, booking.tenantName)}
              style={S.btnApprove}
            >
              <CheckIcon /> Approve
            </button>
            <button
              onClick={() => onAction(booking.bookingId, "REJECTED", booking.pgTitle, booking.tenantName)}
              style={S.btnReject}
            >
              <XIcon /> Reject
            </button>
          </div>
        )}

        {/* resolved state message */}
        {!isPending && (
          <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            {booking.status === "APPROVED" && "✓ You approved this visit request."}
            {booking.status === "REJECTED" && "✕ You rejected this visit request."}
            {booking.status === "CANCELLED" && "Tenant cancelled this request."}
          </div>
        )}
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function OwnerBookings() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeFilter, setFilter]   = useState("ALL");
  const [search, setSearch]         = useState("");
  const [confirm, setConfirm]       = useState(null); // { id, action, pgTitle, tenantName }
  const [actionLoading, setActLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try   { const r = await getOwnerBookings(); setBookings(r.data); }
    catch { setError("Could not load booking requests. Please try again."); }
    finally { setLoading(false); }
  };

  // open confirm modal instead of acting immediately
  const handleAction = (id, action, pgTitle, tenantName) => {
    setConfirm({ id, action, pgTitle, tenantName });
  };

  // confirmed → call API
  const handleConfirmed = async () => {
    if (!confirm) return;
    setActLoad(true);
    try {
      await updateBookingStatus(confirm.id, confirm.action);
      setConfirm(null);
      await load();
    } catch {
      setConfirm(null);
      setError("Action failed. Please try again.");
    } finally {
      setActLoad(false);
    }
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
      b.tenantName?.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes opulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes ofade  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes mslide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .ocard { animation: ofade 0.3s ease forwards; }
      `}</style>

      {/* ── confirm modal ── */}
      {confirm && (
        <ConfirmModal
          action={confirm.action}
          pgTitle={confirm.pgTitle}
          tenantName={confirm.tenantName}
          loading={actionLoading}
          onConfirm={handleConfirmed}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── page header ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Booking Requests</h1>
          <p style={S.subtitle}>Review and manage visit requests from tenants</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/home/listings/new")} style={S.btnPrimary}>
            + Add Listing
          </button>
        </div>
      </div>

      {/* ── pending alert banner ── */}
      {!loading && counts.PENDING > 0 && (
        <div style={S.alertBanner}>
          <ClockIcon />
          <span>
            You have <strong>{counts.PENDING}</strong> pending request{counts.PENDING > 1 ? "s" : ""} waiting for your response.
          </span>
          <button onClick={() => setFilter("PENDING")} style={{ marginLeft: "auto", background: "#92400E", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            View pending
          </button>
        </div>
      )}

      {/* ── filter pills ── */}
      {!loading && bookings.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { key: "ALL",      label: "All requests", dotColor: "#6366f1" },
            { key: "PENDING",  label: "Pending",      dotColor: "#F59E0B" },
            { key: "APPROVED", label: "Approved",     dotColor: "#10B981" },
            { key: "REJECTED", label: "Rejected",     dotColor: "#EF4444" },
          ].map(({ key, label, dotColor }) => (
            <FilterPill key={key} label={label} count={counts[key]} active={activeFilter === key}
              dotColor={dotColor} onClick={() => setFilter(key)} />
          ))}
        </div>
      )}

      {/* ── search ── */}
      {!loading && bookings.length > 0 && (
        <div style={{ position: "relative", marginBottom: 18, display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: 12, color: "#9ca3af", display: "flex", pointerEvents: "none" }}><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search by PG name, tenant name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={S.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 4 }}>✕</button>
          )}
        </div>
      )}

      {/* ── results label ── */}
      {!loading && visible.length > 0 && (
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
          Showing {visible.length} of {bookings.length} request{bookings.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── error ── */}
      {error && (
        <div style={S.errorBanner}>
          <span>{error}</span>
          <button onClick={load} style={{ ...S.btnOutline, padding: "4px 12px", fontSize: 13 }}>Retry</button>
        </div>
      )}

      {/* ── list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : visible.length === 0
            ? (
              <div style={S.empty}>
                <EmptyBoxIcon />
                <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginTop: 16, marginBottom: 4 }}>
                  {bookings.length === 0 ? "No requests yet" : "No results found"}
                </p>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                  {bookings.length === 0
                    ? "You don’t have access to this page. This section is available only for property owners."
                    : "Try adjusting your search or filter."}
                </p>
                {bookings.length === 0
                  ? <button onClick={() => navigate("/home/listings")} style={S.btnPrimary}>My Listings</button>
                  : <button onClick={() => { setFilter("ALL"); setSearch(""); }} style={S.btnOutline}>Clear filters</button>
                }
              </div>
            )
            : visible.map((b, i) => (
              <div key={b.bookingId} className="ocard" style={{ animationDelay: `${i * 0.05}s` }}>
                <BookingCard booking={b} index={i} onAction={handleAction} />
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  page:        { padding: "28px 32px", maxWidth: 860, margin: "0 auto", fontFamily: "'DM Sans', system-ui, sans-serif" },
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  title:       { fontSize: 24, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.2 },
  subtitle:    { fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 0 },
  alertBanner: { display: "flex", alignItems: "center", gap: 8, background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 500, marginBottom: 18 },
  pill:        { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", transition: "all 0.15s" },
  pillActive:  { background: "#3730a3", color: "#fff", borderColor: "#3730a3" },
  searchInput: { width: "100%", padding: "9px 36px 9px 36px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box" },
  card:        { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, transition: "border-color 0.15s, box-shadow 0.15s" },
  cardHover:   { borderColor: "#a5b4fc", boxShadow: "0 4px 18px rgba(99,102,241,0.09)" },
  meta:        { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" },
  empty:       { textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center" },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 8, padding: "12px 16px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  btnPrimary:  { background: "#3730a3", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  btnOutline:  { background: "#fff", color: "#374151", border: "1px solid #e5e7eb", padding: "9px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  btnApprove:  { background: "#F0FDF4", color: "#065F46", border: "1px solid #A7F3D0", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" },
  btnReject:   { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" },
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal:       { background: "#fff", borderRadius: 16, padding: "28px 28px 24px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
};

export default OwnerBookings;
