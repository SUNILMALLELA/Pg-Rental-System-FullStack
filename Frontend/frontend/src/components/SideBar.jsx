

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  const menuItemStyle = (key) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    background: active === key ? "#3b5998" : "none",
    border: "none",
    color: "#ecf0f1",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: active === key ? "bold" : "normal",
  });

  const handleClick = (key, path) => {
    setActive(key);
    navigate(path);
  };

  return (
    <div
      style={{
        width: "220px",
        background: "#2f3b4c",
        color: "#ecf0f1",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Menu</h3>

      <button
        style={menuItemStyle("dashboard")}
        onClick={() => handleClick("dashboard", "/home")}
      >
        🏠 Dashboard
      </button>

      <button
        style={menuItemStyle("addpg")}
        onClick={() => handleClick("addpg", "/home/add-pg")}
      >
        ➕ Add PG
      </button>

      <button
        style={menuItemStyle("mypgs")}
        onClick={() => handleClick("mypgs", "/home/my-pgs")}
      >
        📋 My PGs
      </button>

      <button
        style={menuItemStyle("bookings")}
        onClick={() => handleClick("bookings", "/home/bookings")}
      >
        📅 Bookings
      </button>

      <button style={menuItemStyle("settings")}>
        ⚙️ Settings
      </button>
    </div>
  );
};

export default SideBar;