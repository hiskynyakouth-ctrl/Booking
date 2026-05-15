import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Shared
import Navbar          from "./components/shared/Navbar";
import ProtectedRoute  from "./components/shared/ProtectedRoute";

// Public pages
import Explore         from "./pages/Explore";
import Booking         from "./pages/Booking";
import Shop            from "./pages/Shop";
import Cart            from "./pages/Cart";
import NotFound        from "./pages/NotFound";
import Unauthorized    from "./pages/Unauthorized";
import BusinessProfile from "./pages/BusinessProfile";
import Messages        from "./pages/Messages";
import About           from "./pages/About";

// Auth
import Login           from "./auth/Login";
import AdminLogin      from "./auth/AdminLogin";
import Signup          from "./auth/Signup";
import ForgotPassword  from "./auth/ForgotPassword";
import ResetPassword   from "./auth/ResetPassword";
import GoogleCallback  from "./auth/GoogleCallback";

// User-only pages
import UserDashboard   from "./dashboard/UserDashboard";
import UserProfile     from "./user/UserProfile";
import UserSettings    from "./user/UserSettings";
import MyBookings      from "./user/MyBookings";
import Checkout        from "./user/Checkout";
import MyPayments      from "./user/MyPayments";
import MyNotifications from "./user/MyNotifications";

// Admin-only pages
import Dashboard       from "./dashboard/Dashboard";
import Analytics       from "./dashboard/Analytics";
import Bookings        from "./dashboard/Bookings";
import Calendar        from "./dashboard/Calendar";
import Customers       from "./dashboard/Customers";
import Orders          from "./dashboard/Orders";
import Products        from "./dashboard/Products";
import Settings        from "./dashboard/Settings";
import Invoices        from "./dashboard/Invoices";
import Mail            from "./dashboard/Mail";
import Chat            from "./dashboard/Chat";
import Ecommerce       from "./dashboard/Ecommerce";
import Charts          from "./dashboard/Charts";
import CRM             from "./dashboard/CRM";
import SaaS            from "./dashboard/SaaS";
import Users           from "./dashboard/Users";
import Notifications   from "./dashboard/Notifications";
import Availability    from "./dashboard/Availability";
import Payments        from "./dashboard/Payments";

// Pages that have their own full-page layout — no shared Navbar
const NO_NAVBAR = [
  "/dashboard", "/bookings", "/calendar", "/mail", "/chat",
  "/invoices", "/availability", "/settings", "/analytics",
  "/orders", "/products", "/customers", "/ecommerce", "/charts",
  "/users", "/notifications", "/crm", "/saas", "/login", "/signup",
  "/admin/login", "/forgot-password", "/reset-password",
  "/activity", "/schedule", "/user-dashboard", "/unauthorized", "/my-bookings", "/profile", "/my-settings", "/my-payments", "/checkout", "/my-notifications",
];

function Layout() {
  const location = useLocation();
  const showNav = !NO_NAVBAR.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        {/* ── Public ── */}
        <Route path="/"                  element={<Explore />}         />
        <Route path="/booking"           element={<Booking />}         />
        <Route path="/shop"              element={<Shop />}            />
        <Route path="/cart"              element={<Cart />}            />
        <Route path="/about"            element={<About />}           />
        <Route path="/login"             element={<Login />}           />
        <Route path="/admin/login"       element={<AdminLogin />}      />
        <Route path="/signup"            element={<Signup />}          />
        <Route path="/forgot-password"   element={<ForgotPassword />}  />
        <Route path="/reset-password"    element={<ResetPassword />}   />
        <Route path="/auth/callback"     element={<GoogleCallback />}  />
        <Route path="/unauthorized"      element={<Unauthorized />}    />

        {/* ── User routes (customers only — admins redirected to /dashboard) ── */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute customerOnly><UserDashboard /></ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute customerOnly><UserProfile /></ProtectedRoute>
        }/>
        <Route path="/my-settings" element={
          <ProtectedRoute customerOnly><UserSettings /></ProtectedRoute>
        }/>
        <Route path="/my-bookings" element={
          <ProtectedRoute customerOnly><MyBookings /></ProtectedRoute>
        }/>
        <Route path="/checkout" element={
          <ProtectedRoute customerOnly><Checkout /></ProtectedRoute>
        }/>
        <Route path="/my-payments" element={
          <ProtectedRoute customerOnly><MyPayments /></ProtectedRoute>
        }/>
        <Route path="/messages" element={
          <ProtectedRoute customerOnly><Messages /></ProtectedRoute>
        }/>
        <Route path="/my-notifications" element={
          <ProtectedRoute customerOnly><MyNotifications /></ProtectedRoute>
        }/>

        {/* ── Admin-only routes ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>
        }/>
        <Route path="/analytics" element={
          <ProtectedRoute requireAdmin><Analytics /></ProtectedRoute>
        }/>
        <Route path="/bookings" element={
          <ProtectedRoute requireAdmin><Bookings /></ProtectedRoute>
        }/>
        <Route path="/calendar" element={
          <ProtectedRoute requireAdmin><Calendar /></ProtectedRoute>
        }/>
        <Route path="/customers" element={
          <ProtectedRoute requireAdmin><Customers /></ProtectedRoute>
        }/>
        <Route path="/orders" element={
          <ProtectedRoute requireAdmin><Orders /></ProtectedRoute>
        }/>
        <Route path="/products" element={
          <ProtectedRoute requireAdmin><Products /></ProtectedRoute>
        }/>
        <Route path="/settings" element={
          <ProtectedRoute requireAdmin><Settings /></ProtectedRoute>
        }/>
        <Route path="/invoices" element={
          <ProtectedRoute requireAdmin><Invoices /></ProtectedRoute>
        }/>
        <Route path="/mail" element={
          <ProtectedRoute requireAdmin><Mail /></ProtectedRoute>
        }/>
        <Route path="/chat" element={
          <ProtectedRoute requireAdmin><Chat /></ProtectedRoute>
        }/>
        <Route path="/ecommerce" element={
          <ProtectedRoute requireAdmin><Ecommerce /></ProtectedRoute>
        }/>
        <Route path="/charts" element={
          <ProtectedRoute requireAdmin><Charts /></ProtectedRoute>
        }/>
        <Route path="/crm" element={
          <ProtectedRoute requireAdmin><CRM /></ProtectedRoute>
        }/>
        <Route path="/saas" element={
          <ProtectedRoute requireAdmin><SaaS /></ProtectedRoute>
        }/>
        <Route path="/users" element={
          <ProtectedRoute requireAdmin><Users /></ProtectedRoute>
        }/>
        <Route path="/notifications" element={
          <ProtectedRoute requireAdmin><Notifications /></ProtectedRoute>
        }/>
        <Route path="/availability" element={
          <ProtectedRoute requireAdmin><Availability /></ProtectedRoute>
        }/>
        <Route path="/payments" element={
          <ProtectedRoute requireAdmin><Payments /></ProtectedRoute>
        }/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
