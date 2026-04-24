import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── skeleton helper ───────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 14, radius = 8, delay = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "#f3f4f6",
      animation: `ubpulse 1.4s ease-in-out ${delay}s infinite`,
    }} />
  );
}

// ── UserBarChart ──────────────────────────────────────────────────────────────
const UserBarChart = ({ stats = {}, loading = false }) => {
  const chartData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Bookings",
        data: [stats.approved || 0, stats.rejected || 0, stats.pending || 0],
        backgroundColor: [
          "rgba(16,185,129,0.15)",
          "rgba(239,68,68,0.15)",
          "rgba(245,158,11,0.15)",
        ],
        borderColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#9ca3af", font: { size: 13, family: "'DM Sans', sans-serif" } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#f3f4f6" },
        ticks: { color: "#9ca3af", font: { size: 12 }, stepSize: 1 },
      },
    },
  };

  return (
    <div style={S.card}>
      <style>{`@keyframes ubpulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

      {/* card header */}
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Booking Status Overview</div>
          <div style={S.cardSubtitle}>Distribution across all statuses</div>
        </div>
        {/* live legend dots */}
        {!loading && (
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Approved", color: "#10B981" },
              { label: "Rejected", color: "#EF4444" },
              { label: "Pending",  color: "#F59E0B" },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* chart area */}
      <div style={{ height: 220 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: "100%", padding: "0 20px 20px" }}>
            {[140, 80, 110].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 8, background: "#f3f4f6", animation: `ubpulse 1.4s ease-in-out ${i * 0.1}s infinite` }} />
            ))}
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      {/* summary row */}
      {!loading && (
        <div style={S.summaryRow}>
          {[
            { label: "Approved", value: stats.approved || 0, bg: "#D1FAE5", color: "#065F46" },
            { label: "Rejected", value: stats.rejected || 0, bg: "#FEE2E2", color: "#991B1B" },
            { label: "Pending",  value: stats.pending  || 0, bg: "#FEF3C7", color: "#92400E" },
          ].map(({ label, value, bg, color }) => (
            <div key={label} style={{ ...S.summaryChip, background: bg, color }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{value}</span>
              <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "20px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
  },
  summaryRow: {
    display: "flex",
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #f3f4f6",
  },
  summaryChip: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "10px 12px",
    borderRadius: 10,
  },
};

export default UserBarChart;
