import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPg, deletePg } from "../getPgService";
import { C, FONT } from "../../../theme";

export default function GetListing() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate                = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPg();
      setData(res.data);
    } catch {
      /* handle silently */
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this PG listing? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await deletePg(id);
      setData(d => d.filter(p => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const genderLabel = (g) => ({ MALE: "Male only", FEMALE: "Female only", ANY: "Any gender" }[g] || "Not specified");
  const genderColor = (g) => g === "MALE" ? { bg: "#eff6ff", color: C.blue600 } : g === "FEMALE" ? { bg: "#fdf2f8", color: "#9d174d" } : { bg: "#f0fdf4", color: "#15803d" };

  return (
    <>
      <style>{`
        @keyframes pgFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .pg-card-item { animation: pgFadeIn 0.2s ease both; }
        .pg-card-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; transform: translateY(-1px); transition: all 0.15s; }
        .pg-edit-btn:hover { background: ${C.blue50} !important; color: ${C.blue600} !important; border-color: ${C.blue100} !important; }
        .pg-del-btn:hover  { background: ${C.red100} !important; color: ${C.red600} !important; border-color: #fca5a5 !important; }
      `}</style>

      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.headTitle}>My PG Listings</h1>
            <p style={S.headSub}>Manage your properties and track their status</p>
          </div>
          <button onClick={() => navigate("/home/listings/new")} style={S.addBtn}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add New Listing
          </button>
        </div>

        {/* Stats strip */}
        <div style={S.statsRow}>
          {[
            { label: "Total Listings", value: data.length, color: C.blue600, bg: C.blue50 },
            { label: "Active",         value: data.filter(() => true).length, color: "#15803d", bg: "#f0fdf4" },
            { label: "Pending Review", value: 0, color: "#92400e", bg: "#fef3c7" },
          ].map(s => (
            <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: 10, color: C.gray400 }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ animation: "pgSpin 0.75s linear infinite" }}>
              <circle cx="8" cy="8" r="6" stroke={C.gray200} strokeWidth="2"/>
              <path d="M8 2a6 6 0 016 6" stroke={C.blue500} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Loading your listings...
          </div>
        ) : data.length === 0 ? (
          <div style={S.empty}>
            <div style={S.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke={C.gray300} strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.gray700, marginBottom: 6 }}>No listings yet</p>
            <p style={{ fontSize: 13, color: C.gray400, marginBottom: 20 }}>Add your first PG to start receiving tenant inquiries</p>
            <button onClick={() => navigate("/home/listings/new")} style={{ ...S.addBtn, height: 38 }}>
              Add your first listing
            </button>
          </div>
        ) : (
          <div style={S.grid}>
            {data.map((pg, i) => {
              const gc = genderColor(pg.genderPreference);
              return (
                <div key={pg.id} className="pg-card-item" style={{ ...S.pgCard, animationDelay: `${i * 0.05}s` }}>
                  {/* Card header */}
                  <div style={S.pgCardHead}>
                    <div style={S.pgAvatar}>
                      {pg.title?.[0]?.toUpperCase() || "P"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={S.pgName}>{pg.title}</div>
                      <div style={S.pgLoc}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M8 2a4 4 0 014 4c0 3-4 8-4 8S4 9 4 6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                        {pg.location}
                      </div>
                    </div>
                    <span style={{ ...S.genderBadge, background: gc.bg, color: gc.color }}>
                      {genderLabel(pg.genderPreference)}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={S.pgDesc}>{pg.description || "No description provided."}</p>

                  {/* Price + owner row */}
                  <div style={S.pgMeta}>
                    <div style={S.priceTag}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke={C.blue600} strokeWidth="1.3"/>
                        <path d="M8 4.5v7M5.5 6.5c0-.8.9-1.5 2.5-1.5s2.5.6 2.5 1.5-1 1.2-2.5 1.4-2.5.7-2.5 1.6 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" stroke={C.blue600} strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                      ₹{Number(pg.price).toLocaleString("en-IN")}/mo
                    </div>
                    {pg.ownerName && (
                      <div style={{ fontSize: 11, color: C.gray500, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        {pg.ownerName}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={S.pgActions}>
                    <button className="pg-edit-btn"
                      onClick={() => navigate(`/home/edit/${pg.id}`, { state: pg })}
                      style={S.editBtn}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M2 14l4-1 7.5-7.5a2 2 0 00-3-3L3 11l-1 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                    <button className="pg-del-btn"
                      onClick={() => handleDelete(pg.id)}
                      disabled={deleting === pg.id}
                      style={{ ...S.delBtn, opacity: deleting === pg.id ? 0.6 : 1 }}>
                      {deleting === pg.id
                        ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ animation: "pgSpin 0.7s linear infinite" }}><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/></svg>
                        : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4M4 5l1 9h6l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      }
                      {deleting === pg.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

const S = {
  page:     { display: "flex", flexDirection: "column", minHeight: "calc(100vh - 56px)", padding: "20px 24px", background: C.gray50, fontFamily: FONT },
  header:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexShrink: 0 },
  headTitle:{ fontSize: 18, fontWeight: 700, color: C.gray900 },
  headSub:  { fontSize: 12.5, color: C.gray500, marginTop: 3 },
  addBtn: {
    display: "flex", alignItems: "center", gap: 7, height: 36,
    padding: "0 18px", borderRadius: 8, border: "none",
    background: `linear-gradient(135deg,${C.blue600},${C.blue500})`,
    color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
  },
  statsRow: { display: "flex", gap: 12, marginBottom: 20, flexShrink: 0 },
  statCard: { flex: 1, padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.gray200}` },
  grid:     { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  pgCard:   { background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.15s" },
  pgCardHead: { display: "flex", alignItems: "flex-start", gap: 10 },
  pgAvatar: { width: 36, height: 36, borderRadius: 9, background: C.blue50, border: `1px solid ${C.blue100}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.blue600, flexShrink: 0 },
  pgName:   { fontSize: 13.5, fontWeight: 700, color: C.gray900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  pgLoc:    { display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.gray500, marginTop: 2 },
  genderBadge: { fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, flexShrink: 0, whiteSpace: "nowrap" },
  pgDesc:   { fontSize: 12, color: C.gray600, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  pgMeta:   { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.gray100}` },
  priceTag: { display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: C.blue600 },
  pgActions:{ display: "flex", gap: 8 },
  editBtn:  { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 32, borderRadius: 7, border: `1.5px solid ${C.gray200}`, background: C.white, fontSize: 12, fontWeight: 500, color: C.gray600, cursor: "pointer", fontFamily: FONT, transition: "all 0.12s" },
  delBtn:   { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 32, borderRadius: 7, border: `1.5px solid ${C.gray200}`, background: C.white, fontSize: 12, fontWeight: 500, color: C.gray600, cursor: "pointer", fontFamily: FONT, transition: "all 0.12s" },
  empty:    { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 },
  emptyIcon:{ width: 64, height: 64, borderRadius: 16, background: C.gray100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
};
