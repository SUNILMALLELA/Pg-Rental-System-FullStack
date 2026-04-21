import Navbar  from "../components/Navbar";
import Sidebar  from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { C, GLOBAL_CSS } from "../theme";

const MainLayout = () => {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        display: "flex", flexDirection: "column",
        height: "100vh", overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: C.gray50,
      }}>
        {/* Navbar — renders ONCE here */}
        <Navbar />

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar — renders ONCE here */}
          <Sidebar />

          {/* Page content scrolls independently */}
          <main style={{
            flex: 1, overflowY: "auto",
            background: C.gray50,
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
