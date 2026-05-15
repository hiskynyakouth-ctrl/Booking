import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Store token and fetch user
      localStorage.setItem("token", token);
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem("mock_me", JSON.stringify(data.user));
            // Redirect based on role
            if (data.user.role === "admin") {
              navigate("/dashboard");
            } else {
              navigate("/user-dashboard");
            }
            window.location.reload(); // Force context refresh
          } else {
            navigate("/login");
          }
        })
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"Inter,sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>🔄</div>
        <div style={{ fontSize:"1.1rem", fontWeight:600 }}>Signing you in...</div>
      </div>
    </div>
  );
}
