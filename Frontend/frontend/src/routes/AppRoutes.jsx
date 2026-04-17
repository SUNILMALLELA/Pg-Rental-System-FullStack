import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute"
import { Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RegisterPage />} />
      <Route path="/home" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;