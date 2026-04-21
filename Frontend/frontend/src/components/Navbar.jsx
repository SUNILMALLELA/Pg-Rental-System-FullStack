import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { C, FONT } from "../theme";

const Navbar = () => {
  const { user, logout }  = useContext(AuthContext);
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials   = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  const formatRole = (r) => r ? r.replace("ROLE_", "").replace(/^\w/, c => c.toUpperCase()).toLowerCase().replace(/^\w/, c => c.toUpperCase()) : "User";

  return (
    <>
      <style>{`
        .nb-search:focus { border-color: ${C.blue500} !important; outline: none; box-shadow: 0 0 0 3px rgba(37,84,224,0.1); }
        .nb-search::placeholder { color: ${C.gray400}; font-size: 13px; }
        .nb-icon:hover { background: ${C.gray100} !important; }
        .nb-chip:hover { border-color: ${C.gray300} !important; }
        .nb-dd-item:hover { background: ${C.gray100}; }
        .nb-logout:hover { background: #fee2e2 !important; }
      `}</style>

      <nav style={S.nav}>
        {/* Logo */}
        <Link to="/home/dashboard" style={S.logo}>
          <div style={S.logoIcon}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={S.logoText}>PG<span style={{ color: C.gray500, fontWeight: 500 }}>Rentals</span></span>
        </Link>

        {/* Search */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <input className="nb-search" type="text" placeholder="Search PGs, rooms, locations..." style={S.search} />
          <span style={S.searchKbd}>⌘K</span>
        </div>

        {/* Right */}
        <div style={S.right}>
          {/* Bell */}
          <button className="nb-icon" style={S.iconBtn}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a5 5 0 00-5 5c0 5.5-2 6.5-2 6.5h14s-2-1-2-6.5a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.7 13a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span style={S.dot} />
          </button>

          {/* Message */}
          <button className="nb-icon" style={S.iconBtn}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M14 10a2 2 0 01-2 2H5l-3 3V3a2 2 0 012-2h8a2 2 0 012 2v7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={S.divider} />

          {/* User chip + dropdown */}
          <div ref={ref} style={{ position: "relative" }}>
            <div className="nb-chip" style={S.chip} onClick={() => setOpen(o => !o)}>
              <div style={S.avatar}>{initials}</div>
              <div>
                <div style={S.uName}>{user?.name ?? "User"}</div>
                <div style={S.uRole}>{formatRole(user?.role)}</div>
              </div>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke={C.gray400} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            {open && (
              <div style={S.dropdown}>
                <div style={S.ddHeader}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gray900 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>{user?.email}</div>
                </div>
                {[["Profile", "/home/profile"], ["Settings", "/home/settings"]].map(([l, p]) => (
                  <Link key={p} to={p} style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
                    <div className="nb-dd-item" style={S.ddItem}>{l}</div>
                  </Link>
                ))}
                <div style={{ height: 1, background: C.gray100, margin: "4px 0" }} />
                <div className="nb-dd-item" style={{ ...S.ddItem, color: C.red600 }}
                  onClick={() => { logout(); setOpen(false); }}>
                  Log out
                </div>
              </div>
            )}
          </div>

          {/* Logout btn */}
          <button className="nb-logout" style={S.logoutBtn} onClick={logout}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

const S = {
  nav: {
    height: 56, background: C.white,
    borderBottom: `1px solid ${C.gray200}`,
    display: "flex", alignItems: "center",
    padding: "0 20px", gap: 14, flexShrink: 0,
    fontFamily: FONT, zIndex: 10,
  },
  logo:     { display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 },
  logoIcon: { width: 30, height: 30, borderRadius: 8, background: C.blue600, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: FONT, fontSize: 15, fontWeight: 700, color: C.gray900 },
  searchWrap: { flex: 1, maxWidth: 380, position: "relative", margin: "0 auto" },
  searchIcon: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.gray400, display: "flex", alignItems: "center", pointerEvents: "none" },
  search: { width: "100%", height: 36, border: `1.5px solid ${C.gray200}`, borderRadius: 9, padding: "0 38px 0 34px", fontFamily: FONT, fontSize: 13, color: C.gray900, background: C.gray50, transition: "border-color 0.15s" },
  searchKbd: { position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 600, color: C.gray400, background: C.gray100, padding: "1px 6px", borderRadius: 4, border: `1px solid ${C.gray200}` },
  right:   { display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${C.gray200}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.gray600, position: "relative", transition: "background 0.12s" },
  dot:     { position: "absolute", top: 6, right: 6, width: 6, height: 6, background: "#ef4444", borderRadius: "50%", border: `1.5px solid ${C.white}` },
  divider: { width: 1, height: 22, background: C.gray200, margin: "0 2px" },
  chip: { display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 4px 5px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, background: C.white, cursor: "pointer", transition: "border-color 0.12s" },
  avatar: { width: 26, height: 26, borderRadius: 7, background: C.blue600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 },
  uName:  { fontSize: 12, fontWeight: 600, color: C.gray900, lineHeight: 1.3 },
  uRole:  { fontSize: 10, color: C.gray500 },
  dropdown: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 11, padding: 6, minWidth: 190, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
  ddHeader: { padding: "8px 10px 10px", borderBottom: `1px solid ${C.gray100}`, marginBottom: 4 },
  ddItem:   { padding: "7px 10px", borderRadius: 7, fontSize: 13, fontWeight: 500, color: C.gray700, cursor: "pointer", transition: "background 0.1s" },
  logoutBtn: { display: "flex", alignItems: "center", gap: 5, padding: "0 12px", height: 32, borderRadius: 8, border: `1.5px solid #fecaca`, background: "#fff5f5", color: C.red600, fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.12s" },
};

export default Navbar;
