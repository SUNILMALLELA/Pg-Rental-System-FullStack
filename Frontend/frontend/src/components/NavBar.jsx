import  {useContext}  from "react";
import  AuthContext  from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ height: "60px", background: "#2c3e50", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px" }}>
      
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        PG Rental App
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

          {/* Avatar */}
          <div style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "orange",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Username */}
          <span>{user.name || user.sub}</span>

          {/* Logout */}
          <button
            onClick={logout}
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
      )}

    </div>
  );
};
export default NavBar;