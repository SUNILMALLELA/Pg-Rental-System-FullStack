import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage    from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard    from "../features/dashboard/pages/Dashboard";
import AddListing   from "../features/addPg/pages/AddListing";
import GetListing   from "../features/getPg/pages/GetListing";
import EditPg       from "../features/getPg/pages/EditPg";
import MyBookings   from "../features/myBookings/pages/MyBookings";
import MainLayout   from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";

// Placeholder for unbuilt pages
const Placeholder = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)", flexDirection: "column", gap: 12, color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
    <svg width="40" height="40" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 8h6M5 5h4M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
    <span style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>{title}</span>
    <span style={{ fontSize: 13 }}>Coming soon</span>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — no layout wrapper */}
      <Route path="/"      element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected app with persistent Navbar + Sidebar */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index                 element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<Dashboard />} />
        <Route path="listings/new"   element={<AddListing />} />
        <Route path="listings"       element={<GetListing />} />
        <Route path="edit/:id"       element={<EditPg />} />
        <Route path="bookings"       element={<MyBookings />} />
        <Route path="browse"         element={<Placeholder title="Browse PGs" />} />
        <Route path="saved"          element={<Placeholder title="Saved PGs" />} />
        <Route path="requests"       element={<Placeholder title="Booking Requests" />} />
        <Route path="messages"       element={<Placeholder title="Messages" />} />
        <Route path="reviews"        element={<Placeholder title="Reviews" />} />
        <Route path="profile"        element={<Placeholder title="Profile" />} />
        <Route path="settings"       element={<Placeholder title="Settings" />} />
        <Route path="help"           element={<Placeholder title="Help & Support" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
