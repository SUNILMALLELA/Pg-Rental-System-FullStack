import { NavLink } from "react-router-dom";

// SideBar.jsx — update the NAV array
const NAV = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",      path: "/home/dashboard",        icon: "grid" },
      { label: "Browse PGs",     path: "/home/browse",           icon: "search", badge: { text: "New", type: "green" } },
      { label: "My Bookings",    path: "/home/bookings",         icon: "home",   badge: { text: "3",   type: "blue"  } },
      { label: "Saved PGs",      path: "/home/saved",            icon: "heart" },
    ],
  },
  {
    section: "Owner",
    items: [
      { label: "Add Listing",      path: "/home/listings/new", icon: "plus" },
      { label: "My Listings",      path: "/home/listings",     icon: "building", badge: { text: "2 pending", type: "warn" } },
      { label: "Booking Requests", path: "/home/requests",     icon: "calendar", badge: { text: "5", type: "blue" } },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile",  path: "/home/profile",  icon: "user"   },
      { label: "Messages", path: "/home/messages", icon: "chat",  badge: { text: "2", type: "blue" } },
      { label: "Reviews",  path: "/home/reviews",  icon: "shield" },
    ],
  },
];

const BOTTOM = [
  { label: "Help & Support", path: "/help",     icon: "support"  },
  { label: "Settings",       path: "/settings", icon: "settings" },
];

const Icon = ({ name }) => {
  const icons = {
    grid:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    home:     <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></>,
    heart:    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    building: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    chat:     <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
    shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    support:  <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const Badge = ({ badge }) => {
  const colors = {
    blue:  { background: "#1c4ed8", color: "#fff" },
    green: { background: "#d1fae5", color: "#065f46" },
    warn:  { background: "#fef3c7", color: "#92400e" },
  };
  return (
    <span style={{ ...styles.badge, ...colors[badge.type] }}>
      {badge.text}
    </span>
  );
};

const SideBar = () => (
  <aside style={styles.sidebar}>
    <div style={styles.scrollArea}>
      {NAV.map((group) => (
        <div key={group.section}>
          <div style={styles.section}>{group.section}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.item,
                ...(isActive ? styles.itemActive : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ ...styles.icon, color: isActive ? "#1c4ed8" : "#6b7280" }}>
                    <Icon name={item.icon} />
                  </span>
                  {item.label}
                  {item.badge && <Badge badge={item.badge} />}
                </>
              )}
            </NavLink>
          ))}
          <div style={styles.divider} />
        </div>
      ))}
    </div>

    <div style={styles.bottom}>
      {BOTTOM.map((item) => (
        <NavLink key={item.path} to={item.path} style={styles.bottomItem}>
          <span style={styles.bottomIcon}><Icon name={item.icon} /></span>
          {item.label}
        </NavLink>
      ))}
    </div>
  </aside>
);

const styles = {
  sidebar: {
    width: "228px", minWidth: "228px", background: "#ffffff",
    borderRight: "1px solid #e8eaed", display: "flex",
    flexDirection: "column", height: "calc(100vh - 64px)",
    position: "sticky", top: "64px", fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  scrollArea: { flex: 1, overflowY: "auto", padding: "8px 0 4px" },
  section: {
    padding: "10px 22px 4px", fontSize: "10.5px", fontWeight: 600,
    color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase",
  },
  item: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 14px", margin: "1px 8px", borderRadius: "9px",
    fontSize: "13px", fontWeight: 500, color: "#374151",
    textDecoration: "none", transition: "background 0.15s",
  },
  itemActive: { background: "#eff4ff", color: "#1c4ed8" },
  icon: { display: "flex", alignItems: "center", flexShrink: 0 },
  badge: {
    marginLeft: "auto", fontSize: "10px", fontWeight: 600,
    padding: "1px 7px", borderRadius: "99px", lineHeight: "16px",
    whiteSpace: "nowrap",
  },
  divider: { height: "1px", background: "#f3f4f6", margin: "6px 12px" },
  bottom: { padding: "8px 8px 14px", borderTop: "1px solid #f3f4f6" },
  bottomItem: {
    display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px",
    borderRadius: "9px", fontSize: "13px", fontWeight: 500,
    color: "#6b7280", textDecoration: "none",
  },
  bottomIcon: { display: "flex", color: "#9ca3af" },
};

export default SideBar;