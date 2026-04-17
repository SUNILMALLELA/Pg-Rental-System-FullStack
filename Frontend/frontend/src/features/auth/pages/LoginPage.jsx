import React, { useState } from "react";
import { loginUser } from "../authService";
import Image from "../../../assets/logo3.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setMessage(response.data.message);
      if(response.data.token){
      localStorage.setItem("token", response.data.token);
      }
      setFormData({
        email: "",
        password: "",
      });
        navigate("/home")
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Error In API";
          localStorage.removeItem('token')
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
          Login Registration
        </h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" style={buttonStyle}> 
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "10px",
            textAlign: "center",
            color: "#333",
            fontSize: "14px",
          }}
        >
          
          <span
            style={{
              color: "#2f5d62",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight:"-240px"
            }}
          >
            Forgot Password?
          </span>
        </p>

        <p
          style={{
            marginTop: "15px",
            color: "red",
            textAlign: "center",
          }}
        >
          {typeof message === "string"
            ? message
            : JSON.stringify(message)}
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

export default Login;