import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getStatusCount } from "../dashboard";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import UserBarChart      from "./UserBarChart";
import UserBookingsTable from "./UserBookingsTable";

ChartJS.register(ArcElement, Tooltip, Legend);

// ── icons ─────────────────────────────────────────────────────────────────────
const CalIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const XCircleIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, loading, delay = 0 }) {
  return (
    <div className="ud-fade" style={{ ...S.statCard, animationDelay: `${delay}s` }}>
      <div style={{ ...S.statIcon, background: accent + "18", color: accent }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={S.statLabel}>{label}</div>
        {loading
          ? <div style={{ height: 26, width: "55%", borderRadius: 6, background: "#f3f4f6", animation: "udpulse 1.4s ease-in-out infinite" }} />
          : <div style={{ ...S.statValue, color: accent }}>{value ?? 0}</div>
        }
      </div>
    </div>
  );
}

// ── donut chart ───────────────────────────────────────────────────────────────
function BookingDonut({ stats, loading }) {
  const total = (stats.approved || 0) + (stats.rejected || 0) + (stats.pending || 0);

  const chartData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [{
      data: [stats.approved || 0, stats.rejected || 0, stats.pending || 0],
      backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#d1d5db",
        cornerRadius: 8,
        padding: 10,
      },
    },
  };

  return (
    <div className="ud-fade" style={{ ...S.chartCard, animationDelay: "0.3s" }}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Status Breakdown</div>
          <div style={S.cardSubtitle}>Visual ratio of request outcomes</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* donut */}
        <div style={{ width: 140, height: 140, position: "relative", flexShrink: 0 }}>
          {loading
            ? <div style={{ width: 140, height: 140, borderRadius: "50%", background: "#f3f4f6", animation: "udpulse 1.4s ease-in-out infinite" }} />
            : <>
                <Doughnut data={chartData} options={options} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{total}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Total</div>
                </div>
              </>
          }
        </div>
        {/* legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {[
            { label: "Approved", count: stats.approved || 0, color: "#10B981", bg: "#D1FAE5", textColor: "#065F46" },
            { label: "Rejected", count: stats.rejected || 0, color: "#EF4444", bg: "#FEE2E2", textColor: "#991B1B" },
            { label: "Pending",  count: stats.pending  || 0, color: "#F59E0B", bg: "#FEF3C7", textColor: "#92400E" },
          ].map(({ label, count, color, bg, textColor }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: bg, color: textColor }}>
                {loading ? "—" : count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────────
function UserDashboard() {
  const [stats,   setStats]   = useState({ totalBookings: 0, approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tick,    setTick]    = useState(0);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getStatusCount();
      setStats(res.data);
      setTick(t => t + 1);
    } catch {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: <CalIcon />,     label: "Total Bookings",   value: stats.totalBookings, accent: "#3730a3" },
    { icon: <CheckIcon />,   label: "Approved Visits",  value: stats.approved,      accent: "#10B981" },
    { icon: <ClockIcon />,   label: "Pending Requests", value: stats.pending,       accent: "#F59E0B" },
    { icon: <XCircleIcon />, label: "Rejected",         value: stats.rejected,      accent: "#EF4444" },
  ];

  return (
    <div style={S.page}>
      <style>{`
        @keyframes udpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes udfade  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .ud-fade { animation: udfade 0.4s ease forwards; opacity: 0; }
      `}</style>

      {/* ── header ── */}
      <div className="ud-fade" style={S.header}>
        <div>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 3px", fontWeight: 500 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 style={S.title}>My Dashboard</h1>
          <p style={S.subtitle}>Here's a summary of all your PG booking activity</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchStats} style={S.btnOutline}>
            <RefreshIcon /> Refresh
          </button>
          <button onClick={() => navigate("/home/browse")} style={S.btnPrimary}>
            Browse PGs
          </button>
        </div>
      </div>

      {/* ── error banner ── */}
      {error && (
        <div style={S.errorBanner}>
          <span>{error}</span>
          <button onClick={fetchStats} style={{ ...S.btnOutline, padding: "4px 12px", fontSize: 13 }}>Retry</button>
        </div>
      )}

      {/* ── stat cards ── */}
      <div style={S.statsGrid}>
        {statCards.map(({ icon, label, value, accent }, i) => (
          <StatCard key={label} icon={icon} label={label} value={value}
            accent={accent} loading={loading} delay={i * 0.07} />
        ))}
      </div>

      {/* ── charts row: UserBarChart (left 2/3) + Donut (right 1/3) ── */}
      <div style={S.chartsRow}>
        <div className="ud-fade" style={{ flex: 2, animationDelay: "0.2s" }}>
          <UserBarChart stats={stats} loading={loading} />
        </div>
        <div style={{ flex: 1 }}>
          <BookingDonut stats={stats} loading={loading} />
        </div>
      </div>

      {/* ── bookings table ── */}
      {/* key={tick} re-mounts the table (re-fetches data) whenever Refresh is clicked */}
      <div className="ud-fade" style={{ animationDelay: "0.4s" }}>
        <UserBookingsTable key={tick} />
      </div>
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  page:        { padding: "28px 32px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f9fafb", minHeight: "100vh" },
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title:       { fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px", lineHeight: 1.2 },
  subtitle:    { fontSize: 14, color: "#6b7280", margin: 0 },
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  statCard:    { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, opacity: 0 },
  statIcon:    { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statLabel:   { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 },
  statValue:   { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  chartsRow:   { display: "flex", gap: 16, marginBottom: 20, alignItems: "stretch" },
  chartCard:   { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px", opacity: 0 },
  cardHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  cardTitle:   { fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 3 },
  cardSubtitle:{ fontSize: 13, color: "#9ca3af" },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 8, padding: "12px 16px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  btnPrimary:  { background: "#3730a3", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  btnOutline:  { background: "#fff", color: "#374151", border: "1px solid #e5e7eb", padding: "9px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
};

export default UserDashboard;
