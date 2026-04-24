import React, { useEffect, useState } from "react";
import { getAllPg, searchPg } from "../browsePgService";
import { useNavigate } from "react-router-dom";

// ── icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const LocationIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const RupeeIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 3h12M6 8h12M6 13h8a4 4 0 0 0 0-8M6 21l8-8" />
  </svg>
);
const HomeIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── helpers ───────────────────────────────────────────────────────────────────
const GENDER_CONFIG = {
  MALE:   { label: "Male only",   bg: "#DBEAFE", color: "#1d4ed8" },
  FEMALE: { label: "Female only", bg: "#FCE7F3", color: "#9d174d" },
  ANY:    { label: "Any gender",  bg: "#EEF2FF", color: "#3730a3" },
};

const CARD_GRADIENTS = [
  "linear-gradient(135deg,#c7d2fe,#a5f3fc)",
  "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  "linear-gradient(135deg,#d1fae5,#a7f3d0)",
  "linear-gradient(135deg,#fef3c7,#fde68a)",
  "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
  "linear-gradient(135deg,#cffafe,#a5f3fc)",
];

const formatPrice = (p) =>
  "₹" + Number(p).toLocaleString("en-IN") + "/mo";

// ── skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardImg, background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ padding: "14px 16px" }}>
        {[80, 55, 100, 60].map((w, i) => (
          <div key={i} style={{
            height: 12, width: `${w}%`, borderRadius: 6,
            background: "#f3f4f6", marginBottom: 10,
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── PG card ───────────────────────────────────────────────────────────────────
function PgCard({ pg, index, onView }) {
  const [hovered, setHovered] = useState(false);
  const gender = GENDER_CONFIG[pg.genderPreference] || GENDER_CONFIG.ANY;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* image area */}
      <div style={{ ...styles.cardImg, background: gradient, position: "relative", overflow: "hidden" }}>
        <img
          src={`/public/assets/Image${index + 1}.jpg`}
          alt={pg.title}
          onError={(e) => { e.target.style.display = "none"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
        {/* gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 60%)" }} />

        {/* gender badge */}
        <div style={{ ...styles.badge, background: gender.bg, color: gender.color, position: "absolute", top: 10, right: 10 }}>
          {gender.label}
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={styles.cardTitle}>{pg.title}</div>
        <div style={styles.cardLoc}>
          <LocationIcon />
          <span>{pg.location}</span>
        </div>
        <div style={styles.cardDesc}>{pg.description}</div>

        {/* footer */}
        <div style={styles.cardFooter}>
          <div style={styles.cardPrice}>
            <RupeeIcon />
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              {formatPrice(pg.price)}
            </span>
          </div>
          <button
            onClick={() => onView(pg.id)}
            style={{ ...styles.btnPrimary, display: "flex", alignItems: "center", gap: 6 }}
          >
            View PG <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onReset }) {
  return (
    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>
        <svg width="56" height="56" fill="none" stroke="#d1d5db" strokeWidth="1.2" viewBox="0 0 24 24" style={{ margin: "0 auto" }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 500, color: "#374151", marginBottom: 6 }}>No PGs found</p>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Try adjusting your filters or search in a different location.</p>
      <button onClick={onReset} style={styles.btnOutline}>Clear filters</button>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function BrowsePgs() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ location: "", gender: "", minPrice: "", maxPrice: "" });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPg();
      setPgs(res.data);
    } catch {
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const res = await searchPg(cleaned);
      setPgs(res.data);
      setActiveFiltersCount(Object.keys(cleaned).length);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ location: "", gender: "", minPrice: "", maxPrice: "" });
    setActiveFiltersCount(0);
    fetchAll();
  };

  const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .pg-card-anim { animation: fadeIn 0.35s ease forwards; }
      `}</style>

      {/* ── page header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Find Your Ideal PG Accommodation</h1>
<p style={styles.pageSubtitle}>
  {loading ? "Loading listings…" : `${pgs.length} PGs available based on your search`}
</p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{ ...styles.btnOutline, display: "flex", alignItems: "center", gap: 8 }}
        >
          <FilterIcon />
          Filters
          {activeFiltersCount > 0 && (
            <span style={{ ...styles.badge, background: "#3730a3", color: "#fff", marginLeft: 2 }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── search bar (always visible) ── */}
      <div style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIconWrap}><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search by location, PG name…"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.searchInput}
          />
          {filters.location && (
            <button onClick={() => updateFilter("location", "")} style={styles.searchClear}><XIcon /></button>
          )}
        </div>
        <button onClick={handleSearch} style={styles.btnPrimary}>Search</button>
      </div>

      {/* ── expanded filters ── */}
      {showFilters && (
        <div style={styles.filterPanel}>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Gender preference</label>
              <select
                value={filters.gender}
                onChange={(e) => updateFilter("gender", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Any gender</option>
                <option value="MALE">Male only</option>
                <option value="FEMALE">Female only</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min price (₹/mo)</label>
              <input
                type="number"
                placeholder="e.g. 3000"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max price (₹/mo)</label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                style={styles.filterInput}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSearch} style={styles.btnPrimary}>Apply filters</button>
            <button onClick={handleReset} style={styles.btnOutline}>Reset all</button>
          </div>
        </div>
      )}

      {/* ── active filter chips ── */}
      {activeFiltersCount > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {filters.gender && (
            <span style={styles.filterChip}>
              {GENDER_CONFIG[filters.gender]?.label}
              <button onClick={() => { updateFilter("gender", ""); handleSearch(); }} style={styles.chipX}><XIcon /></button>
            </span>
          )}
          {filters.minPrice && (
            <span style={styles.filterChip}>
              Min ₹{Number(filters.minPrice).toLocaleString("en-IN")}
              <button onClick={() => { updateFilter("minPrice", ""); handleSearch(); }} style={styles.chipX}><XIcon /></button>
            </span>
          )}
          {filters.maxPrice && (
            <span style={styles.filterChip}>
              Max ₹{Number(filters.maxPrice).toLocaleString("en-IN")}
              <button onClick={() => { updateFilter("maxPrice", ""); handleSearch(); }} style={styles.chipX}><XIcon /></button>
            </span>
          )}
        </div>
      )}

      {/* ── error ── */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={fetchAll} style={{ ...styles.btnOutline, padding: "4px 12px", fontSize: 13 }}>Retry</button>
        </div>
      )}

      {/* ── grid ── */}
      <div style={styles.grid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : pgs.length === 0
            ? <EmptyState onReset={handleReset} />
            : pgs.map((pg, i) => (
                <div key={pg.id} className="pg-card-anim" style={{ animationDelay: `${i * 0.05}s` }}>
                  <PgCard pg={pg} index={i} onView={(id) => navigate(`/home/view/${id}`)} />
                </div>
              ))
        }
      </div>
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    padding: "28px 32px",
    maxWidth: 1200,
    margin: "0 auto",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    lineHeight: 1.2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  searchWrap: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIconWrap: {
    position: "absolute",
    left: 12,
    color: "#9ca3af",
    display: "flex",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 40px 10px 38px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  searchClear: {
    position: "absolute",
    right: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    display: "flex",
    padding: 2,
  },
  filterPanel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 20,
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
    cursor: "pointer",
  },
  filterInput: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
  },
  filterChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#EEF2FF",
    color: "#3730a3",
    fontSize: 13,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 99,
  },
  chipX: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6366f1",
    display: "flex",
    padding: 0,
    lineHeight: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
    cursor: "pointer",
  },
  cardHover: {
     border: "1px solid #a5b4fc",
    boxShadow: "0 4px 24px rgba(99,102,241,0.10)",
    transform: "translateY(-2px)",
  },
  cardImg: {
    width: "100%",
    height: 168,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardLoc: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.55,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: 14,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTop: "1px solid #f3f4f6",
  },
  cardPrice: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "#374151",
  },
  badge: {
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 9px",
    borderRadius: 99,
  },
  btnPrimary: {
    background: "#3730a3",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  btnOutline: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  errorBanner: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
};

export default BrowsePgs;
