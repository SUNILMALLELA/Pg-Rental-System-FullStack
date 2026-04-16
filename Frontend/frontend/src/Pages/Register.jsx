import React, { useState } from "react";
import { registerUser } from "../services/Register";
import Image from '../assets/logo3.png'
import { useNavigate } from "react-router-dom";
function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "USER",
  });

  const navigate = useNavigate();


  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage(response.data);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
    const errorMsg =
    typeof error.response?.data === "string"
      ? error.response.data
      : error.response?.data?.message || "Error In API";

  setMessage(errorMsg);
}
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: "80px",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
           marginLeft: "-70px",
           marginBottom:"60px"
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Register Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 40px 10px 10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundColor: "#fff",
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "16px",
              cursor: "pointer"
            }}
          >
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#2f5d62", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

     <p style={{ marginTop: "15px", color: "red",textAlign:"center" }}>
     {typeof message === "string" ? message : JSON.stringify(message)}
      </p>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px",
  height: "40px",
  boxSizing: "border-box"
};
const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#2f5d62",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Register;