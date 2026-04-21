import { useNavigate, useLocation } from "react-router-dom";
import { C, FONT } from "../theme";

const SECTIONS = [
  {
    label: "Main",
    items: [
      { key: "dashboard",  label: "Dashboard",        path: "/home/dashboard"    },
      { key: "browse",     label: "Browse PGs",       path: "/home/browse",      badge: "New",  bc: "#166534", bb: "#dcfce7" },
      { key: "bookings",   label: "My Bookings",      path: "/home/bookings",    badge: "3",    bc: C.blue600, bb: C.blue50  },
      { key: "saved",      label: "Saved PGs",        path: "/home/saved"        },
    ],
  },
  {
    label: "Owner",
    items: [
      { key: "addlisting", label: "Add Listing",      path: "/home/listings/new"                          },
      { key: "mylisting",  label: "My Listings",      path: "/home/listings",    badge: "5",    bc: "#92400e", bb: "#fef3c7" },
      { key: "requests",   label: "Booking Requests", path: "/home/requests",    badge: "2",    bc: C.red600,  bb: C.red100  },
    ],
  },
];

const BOTTOM_ITEMS = [
  { key: "profile",  label: "Profile",        path: "/home/profile"  },
  { key: "messages", label: "Messages",       path: "/home/messages", badge: "2", bc: C.blue600, bb: C.blue50 },
  { key: "reviews",  label: "Reviews",        path: "/home/reviews"  },
  { key: "help",     label: "Help & Support", path: "/home/help"     },
  { key: "settings", label: "Settings",       path: "/home/settings" },
];

/* SVG icon map */
const ICONS = {
  dashboard:   <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>,
  browse:      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bookings:    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 3V1M11 3V1M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  saved:       <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 13s-6-3.5-6-7.5a4 4 0 017-2.6A4 4 0 0114 5.5c0 4-6 7.5-6 7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  addlisting:  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  mylisting:   <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-5 6 5v6h-4v-3H6v3H2V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  requests:    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M11 14v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M13 5v4M15 7h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  profile:     <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  messages:    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14 10a2 2 0 01-2 2H5l-3 3V3a2 2 0 012-2h8a2 2 0 012 2v7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  reviews:     <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3 3.5.5-2.5 2.4.6 3.5L8 10l-3.1 1.4.6-3.5L3 5.5 6.5 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  help:        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6a2 2 0 114 0c0 1.3-2 2-2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="12" r=".6" fill="currentColor"/></svg>,
  settings:    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
};

function NavItem({ item, active }) {
  const navigate = useNavigate();
  return (
    <button
      style={{
        ...S.item,
        ...(active ? S.itemActive : {}),
      }}
      className={active ? "" : "pg-nav-item"}
      onClick={() => navigate(item.path)}
    >
      {active && <span style={S.bar} />}
      <span style={{ ...S.iconBox, ...(active ? S.iconBoxActive : {}) }}>
        {ICONS[item.key]}
      </span>
      <span style={S.label}>{item.label}</span>
      {item.badge && (
        <span style={{ ...S.badge, background: item.bb || C.blue50, color: item.bc || C.blue600 }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside style={S.sidebar}>
      {SECTIONS.map(({ label, items }) => (
        <div key={label}>
          <p style={S.sectionLabel}>{label}</p>
          {items.map(item => <NavItem key={item.key} item={item} active={isActive(item.path)} />)}
        </div>
      ))}

      <div style={S.sep} />

      <div>
        <p style={S.sectionLabel}>Account</p>
        {BOTTOM_ITEMS.map(item => <NavItem key={item.key} item={item} active={isActive(item.path)} />)}
      </div>
    </aside>
  );
};

const S = {
  sidebar: {
    width: 210, background: C.white,
    borderRight: `1px solid ${C.gray200}`,
    display: "flex", flexDirection: "column",
    padding: "10px 8px", flexShrink: 0,
    overflowY: "auto", fontFamily: FONT,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: C.gray400,
    padding: "0 10px", margin: "10px 0 3px",
  },
  item: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "7px 10px", borderRadius: 8,
    color: C.gray600, fontSize: 12.5, fontWeight: 500,
    cursor: "pointer", border: "none", background: "none",
    width: "100%", textAlign: "left", position: "relative",
    fontFamily: FONT, transition: "background 0.12s",
  },
  itemActive: { background: C.blue50, color: C.blue600 },
  bar:  { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, borderRadius: "0 3px 3px 0", background: C.blue600 },
  iconBox: { width: 26, height: 26, borderRadius: 7, background: C.gray100, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray600, flexShrink: 0 },
  iconBoxActive: { background: C.blue100, color: C.blue600 },
  label: { flex: 1 },
  badge: { fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20 },
  sep:   { height: 1, background: C.gray100, margin: "6px 0" },
};

export default Sidebar;
