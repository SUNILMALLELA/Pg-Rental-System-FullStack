import React, { useEffect, useState } from "react";
import { getUserBookings } from "../dashboard";
import { useNavigate } from "react-router-dom";

// ── icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const LocationIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.31 2 2 0 0 1 3.6 1.1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.95-1.04a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.9 16l.02.92z" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const EmptyIcon = () => (
  <svg width="44" height="44" fill="none" stroke="#d1d5db" strokeWidth="1.2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
  </svg>
);

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  APPROVED:  { label: "Approved",  bg: "#D1FAE5", color: "#065F46", dot: "#10B981", border: "#A7F3D0" },
  PENDING:   { label: "Pending",   bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", border: "#FDE68A" },
  REJECTED:  { label: "Rejected",  bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", border: "#FECACA" },
  CANCELLED: { label: "Cancelled", bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF", border: "#E5E7EB" },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

function Skeleton({ w = "100%", h = 12, radius = 6, delay = 0 }) {
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: "#f3f4f6", animation: `ubtpulse 1.4s ease-in-out ${delay}s infinite` }} />
  );
}

const PER_PAGE = 8;

// ── main component ────────────────────────────────────────────────────────────
const UserBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("ALL");
  const [page,     setPage]     = useState(1);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getUserBookings();
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusTabs = ["ALL", "APPROVED", "PENDING", "REJECTED"];

  const filtered = bookings
    .filter(b => status === "ALL" || b.status === status)
    .filter(b => !search || [b.pgTitle, b.location, b.ownerPhone]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleStatus = (val) => { setStatus(val);  setPage(1); };

  return (
    <div style={S.card}>
      <style>{`@keyframes ubtpulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

      {/* ── card header ── */}
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>My Booking Requests</div>
          <div style={S.cardSubtitle}>
            {loading ? "Loading…" : `${filtered.length} record${filtered.length !== 1 ? "s" : ""} found`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={fetchBookings} style={S.btnOutline}>Refresh</button>
          <button onClick={() => navigate("/home/bookings")} style={{ ...S.btnOutline, display: "inline-flex", alignItems: "center", gap: 6 }}>
            View all <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* ── controls row ── */}
      <div style={S.controlsRow}>
        {/* search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by PG name, location, phone…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={S.searchInput}
          />
          {search && (
            <button onClick={() => handleSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 2 }}>✕</button>
          )}
        </div>

        {/* status filter tabs */}
        <div style={{ display: "flex", gap: 5 }}>
          {statusTabs.map(tab => {
            const cfg = STATUS_CONFIG[tab];
            const isActive = status === tab;
            return (
              <button
                key={tab}
                onClick={() => handleStatus(tab)}
                style={{
                  padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                  background: isActive ? (cfg ? cfg.bg : "#EEF2FF") : "#fff",
                  color:      isActive ? (cfg ? cfg.color : "#3730a3") : "#6b7280",
                  borderColor:isActive ? (cfg ? cfg.border : "#a5b4fc") : "#e5e7eb",
                }}
              >
                {tab === "ALL" ? "All" : cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── error ── */}
      {error && (
        <div style={S.errorBanner}>
          <span>{error}</span>
          <button onClick={fetchBookings} style={{ ...S.btnOutline, padding: "4px 10px", fontSize: 12 }}>Retry</button>
        </div>
      )}

      {/* ── table ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["#", "PG Name", "Location", "Owner Phone", "Date", "Status"].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} style={S.td}>
                        <Skeleton w={j === 6 ? 72 : "80%"} delay={i * 0.06} />
                      </td>
                    ))}
                  </tr>
                ))
              : paginated.length === 0
                ? (
                  <tr>
                    <td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "48px 0" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <EmptyIcon />
                        <span style={{ color: "#9ca3af", fontSize: 14 }}>No bookings match your filters</span>
                        {(search || status !== "ALL") && (
                          <button onClick={() => { handleSearch(""); handleStatus("ALL"); }} style={{ ...S.btnOutline, marginTop: 4, fontSize: 13 }}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
                : paginated.map((b, i) => {
                    const st  = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
                    const rowBg = i % 2 === 0 ? "#fff" : "#fafafa";
                    return (
                      <tr
                        key={b.bookingId}
                        style={{ background: rowBg }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F5F3FF")}
                        onMouseLeave={e => (e.currentTarget.style.background = rowBg)}
                      >
                        <td style={{ ...S.td, color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>
                          #{b.bookingId}
                        </td>
                        <td style={{ ...S.td, fontWeight: 600, color: "#111827", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.pgTitle}
                        </td>
                        <td style={S.td}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#6b7280", fontSize: 13 }}>
                            <LocationIcon /> {b.location || "—"}
                          </span>
                        </td>
                        <td style={S.td}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#6b7280", fontSize: 13 }}>
                            <PhoneIcon /> {b.ownerPhone || "—"}
                          </span>
                        </td>
                        <td style={{ ...S.td, color: "#6b7280", fontSize: 13 }}>
                          {fmtDate(b.createdAt)}
                        </td>
                        <td style={S.td}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot }} />
                            {st.label}
                          </div>
                        </td>
                      </tr>
                    );
                  })
            }
          </tbody>
        </table>
      </div>

      {/* ── pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={S.pagination}>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>
            Page {page} of {totalPages} · {filtered.length} results
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...S.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
            >
              <ChevronLeftIcon />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{ ...S.pageBtn, background: page === i + 1 ? "#3730a3" : "#fff", color: page === i + 1 ? "#fff" : "#6b7280", borderColor: page === i + 1 ? "#3730a3" : "#e5e7eb" }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ ...S.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  card:        { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif" },
  cardHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" },
  cardTitle:   { fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 3 },
  cardSubtitle:{ fontSize: 13, color: "#9ca3af" },
  controlsRow: { display: "flex", gap: 10, padding: "12px 20px", alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #f3f4f6", background: "#fafafa" },
  searchInput: { width: "100%", padding: "7px 28px 7px 32px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box" },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 8, padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "12px 20px" },
  th:          { padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6b7280", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" },
  td:          { padding: "13px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f9fafb", verticalAlign: "middle" },
  pagination:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f3f4f6" },
  pageBtn:     { width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  btnOutline:  { background: "#fff", color: "#374151", border: "1px solid #e5e7eb", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
};

export default UserBookingsTable;
