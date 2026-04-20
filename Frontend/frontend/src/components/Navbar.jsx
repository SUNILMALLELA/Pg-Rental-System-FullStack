import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";
  const formatRole = (role) => {
    if (!role) return "User";
    return role
      .replace("ROLE_", "")           
      .charAt(0).toUpperCase()         
      + role.replace("ROLE_", "").slice(1).toLowerCase(); 
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoIcon}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      </div>
      <span style={styles.logoText}>
        PG<span style={{ color: "#1c4ed8" }}>Rentals</span>
      </span>

      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search PGs, rooms, locations..."
          style={styles.searchInput}
          onFocus={(e) => { e.target.style.borderColor = "#1c4ed8"; e.target.style.background = "#fff"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
        />
        <span style={styles.kbdHint}>⌘K</span>
      </div>

      <div style={styles.rightSide}>
        <button style={styles.iconBtn} title="Notifications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={styles.notifDot} />
        </button>

        <button style={styles.iconBtn} title="Messages">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </button>

        <div style={styles.divider} />

        <div style={styles.userChip}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name ?? "User"}</div>
            <div style={styles.userRole}>{formatRole(user?.role)}</div>
          </div>
          <div style={styles.avatar}>{initials}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#ffffff", borderBottom: "1px solid #e8eaed",
    height: "64px", display: "flex", alignItems: "center",
    padding: "0 28px", gap: "20px", position: "sticky",
    top: 0, zIndex: 1000, fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px", background: "#1c4ed8",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "17px", fontWeight: 600, color: "#111827", letterSpacing: "-0.3px",
  },
  searchWrapper: { flex: 1, maxWidth: "440px", margin: "0 auto", position: "relative" },
  searchIcon: {
    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
    color: "#9ca3af", display: "flex", alignItems: "center", pointerEvents: "none",
  },
  searchInput: {
    width: "100%", height: "40px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
    padding: "0 48px 0 40px", fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "13.5px", color: "#111827", background: "#f9fafb", outline: "none",
  },
  kbdHint: {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    fontSize: "11px", color: "#9ca3af", background: "#f3f4f6",
    border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 6px", pointerEvents: "none",
  },
  rightSide: { display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto", flexShrink: 0 },
  iconBtn: {
    width: "38px", height: "38px", borderRadius: "10px",
    border: "1.5px solid #e5e7eb", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#6b7280", position: "relative",
  },
  notifDot: {
    position: "absolute", top: "7px", right: "7px",
    width: "7px", height: "7px", background: "#ef4444",
    borderRadius: "50%", border: "2px solid #fff",
  },
  divider: { width: "1px", height: "28px", background: "#e5e7eb", margin: "0 6px" },
  userChip: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "5px 5px 5px 10px", border: "1.5px solid #e5e7eb",
    borderRadius: "12px", background: "#fff", cursor: "pointer",
  },
  userInfo: { textAlign: "left" },
  userName: { fontSize: "13px", fontWeight: 600, color: "#111827", lineHeight: 1.3 },
  userRole: { fontSize: "11px", color: "#6b7280" },
  avatar: {
    width: "32px", height: "32px", borderRadius: "8px", background: "#1c4ed8",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 600, color: "#fff",
    fontFamily: "'Sora', sans-serif", flexShrink: 0,
  },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "0 16px", height: "38px", borderRadius: "10px",
    border: "1.5px solid #fecaca", background: "#fff5f5",
    color: "#dc2626", fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "13px", fontWeight: 600, cursor: "pointer",
  },
};

export default NavBar;