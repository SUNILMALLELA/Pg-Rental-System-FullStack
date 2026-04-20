import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <NavBar />
    <div style={{ display: "flex", flex: 1 }}>
      <SideBar />
      <main style={{ flex: 1, padding: 24, background: "#0d1b27", minHeight: "calc(100vh - 56px)" }}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;