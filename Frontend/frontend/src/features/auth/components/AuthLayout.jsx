import Image from "../../../assets/logo3.png";

function AuthLayout({ children }) {
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
      {children}
    </div>
  );
}

export default AuthLayout;