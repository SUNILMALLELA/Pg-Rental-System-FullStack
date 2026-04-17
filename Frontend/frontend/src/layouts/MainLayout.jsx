
import React from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
         <div
          style={{
            padding: "20px",
            width: "100%",
            background: "#f5f6fa",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;