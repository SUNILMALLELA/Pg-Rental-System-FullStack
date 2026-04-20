// AppRoutes.jsx
import LoginPage    from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard from "../features/dashboard/pages/dashboard";
import AddListing from "../features/addPg/pages/AddListing"
import MainLayout   from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard/>} />
        <Route path="listings/new"  element={<AddListing/>} />
        <Route path="listings"     element={<div style={{color:"white"}}>My Listings</div>} />
        <Route path="browse"       element={<div style={{color:"white"}}>Browse PGs</div>} />
        <Route path="bookings"     element={<div style={{color:"white"}}>My Bookings</div>} />
        <Route path="saved"        element={<div style={{color:"white"}}>Saved PGs</div>} />
        <Route path="requests"     element={<div style={{color:"white"}}>Booking Requests</div>} />
        <Route path="profile"      element={<div style={{color:"white"}}>Profile</div>} />
        <Route path="messages"     element={<div style={{color:"white"}}>Messages</div>} />
        <Route path="reviews"      element={<div style={{color:"white"}}>Reviews</div>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;