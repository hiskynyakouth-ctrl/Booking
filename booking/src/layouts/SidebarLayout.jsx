import { Link } from "react-router-dom";

export default function SidebarLayout({ children }) {
  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-64 bg-[#111] p-5 space-y-4">
        <h2 className="text-xl font-bold">Thiyang App</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/booking">Bookings</Link>
        <Link to="/shop">Shop</Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}