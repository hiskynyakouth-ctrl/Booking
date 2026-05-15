import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// requireAdmin=true    → only admins allowed, customers → /unauthorized
// customerOnly=true    → only customers allowed, admins → /dashboard
// default              → any logged-in user
export default function ProtectedRoute({ children, requireAdmin = false, customerOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0c0f", display:"flex", alignItems:"center", justifyContent:"center", color:"#22c55e", fontSize:"1rem" }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  // Admin trying to access customer-only pages → send to admin dashboard
  if (customerOnly && user.role === "admin")
    return <Navigate to="/dashboard" replace />;

  // Non-admin trying to access admin-only pages → unauthorized
  if (requireAdmin && user.role !== "admin")
    return <Navigate to="/unauthorized" replace />;

  return children;
}
