// ─────────────────────────────────────────────────────────────
//  PGRentals — Shared Design Tokens
//  Import this in every component for consistent styling
// ─────────────────────────────────────────────────────────────

export const C = {
  // Brand
  blue600:  "#1b3faa",
  blue500:  "#2554e0",
  blue100:  "#dbeafe",
  blue50:   "#eff6ff",

  // Neutrals
  gray900: "#0f172a",
  gray800: "#1e293b",
  gray700: "#334155",
  gray600: "#475569",
  gray500: "#64748b",
  gray400: "#94a3b8",
  gray300: "#cbd5e1",
  gray200: "#e2e8f0",
  gray100: "#f1f5f9",
  gray50:  "#f8fafc",
  white:   "#ffffff",

  // Semantic
  red600:    "#dc2626",
  red100:    "#fee2e2",
  red50:     "#fff1f2",
  green600:  "#16a34a",
  green100:  "#dcfce7",
  green50:   "#f0fdf4",
  orange500: "#ea580c",
  orange50:  "#fff7ed",
};

export const FONT = "'Inter', system-ui, -apple-system, sans-serif";

// Reusable input base style
export const inputBase = {
  width: "100%",
  height: 40,
  border: `1.5px solid ${C.gray200}`,
  borderRadius: 8,
  background: C.white,
  padding: "0 12px",
  fontSize: 13,
  color: C.gray900,
  fontFamily: FONT,
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

// Global CSS string — inject once in App.jsx or index.css
export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${FONT}; background: ${C.gray50}; color: ${C.gray900}; }
  @keyframes pgSpin { to { transform: rotate(360deg); } }
  @keyframes pgFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  .pg-input:focus {
    border-color: ${C.blue500} !important;
    box-shadow: 0 0 0 3px rgba(37,84,224,0.13) !important;
    background: ${C.white} !important;
  }
  .pg-input::placeholder { color: ${C.gray300}; font-size: 13px; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

  .pg-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    height: 42px; padding: 0 24px; border-radius: 9px; border: none;
    background: linear-gradient(135deg, ${C.blue600}, ${C.blue500});
    color: #fff; font-size: 13.5px; font-weight: 600;
    font-family: ${FONT}; cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
    width: 100%;
  }
  .pg-btn-primary:hover:not(:disabled) { filter: brightness(1.1); }
  .pg-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .pg-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

  .pg-btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    height: 38px; padding: 0 20px; border-radius: 8px;
    border: 1.5px solid ${C.gray200}; background: ${C.white};
    color: ${C.gray600}; font-size: 13px; font-weight: 500;
    font-family: ${FONT}; cursor: pointer;
    transition: background 0.12s;
  }
  .pg-btn-secondary:hover { background: ${C.gray100}; }

  .pg-nav-item:hover { background: ${C.gray100} !important; color: ${C.gray900} !important; }
  .pg-card { animation: pgFadeIn 0.25s ease; }
`;
