// src/components/Navbar.jsx

const NavBar = () => {
  return (
    <div
      style={{
        height: "60px",
        background: "linear-gradient(90deg, #2c3e50, #34495e)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        PG Rental App
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.1)",
            padding: "6px 12px",
            borderRadius: "8px",
          }}
        >
          <span>👤</span>
          <span>John Doe</span>
        </div>

        <button
          style={{
            background: "#e74c3c",
            border: "none",
            padding: "8px 14px",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;