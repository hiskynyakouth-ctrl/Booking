import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getOrders } from "../services/orderService";

const statusColor = { Paid:"#22c55e", Pending:"#f59e0b", Overdue:"#ef4444" };
const statusBg    = { Paid:"rgba(34,197,94,0.15)", Pending:"rgba(245,158,11,0.15)", Overdue:"rgba(239,68,68,0.15)" };

const parseDate = (value) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date() : date;
};

const formatDate = (date) => date.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

const toInvoice = (order) => {
  const orderDate = parseDate(order.date);
  const dueDate = new Date(orderDate);
  dueDate.setDate(dueDate.getDate() + 30);
  return {
    id: order.id?.replace(/^ORD-/, "INV-") || `INV-${Date.now()}`,
    customer: order.customer,
    email: order.email || "customer@gmail.com",
    order: order.id,
    status: order.status === "Completed" ? "Paid" : order.status === "Cancelled" ? "Overdue" : "Pending",
    issued: formatDate(orderDate),
    due: formatDate(dueDate),
    amount: `Br ${Number(order.amount || 0).toFixed(2)}`,
  };
};

export default function Invoices() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const orders = getOrders();
    setInvoices(orders.map(toInvoice));
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";

  const filtered = invoices.filter(i => {
    const matchTab = tab === "All" || i.status === tab;
    const matchSearch = !search || i.customer.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const downloadInvoice = (inv) => {
    const content = `Invoice: ${inv.id}\nCustomer: ${inv.customer}\nOrder: ${inv.order}\nAmount: ${inv.amount}\nStatus: ${inv.status}\nIssued: ${inv.issued}\nDue: ${inv.due}`;
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    a.download = `${inv.id}.txt`;
    a.click();
  };

  return (
    <DashboardLayout title="Invoices" subtitle="View and manage your invoices.">
      <div style={{ padding:"1.25rem" }}>
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 1rem", borderBottom:`1px solid ${bdr}`, flexWrap:"wrap", gap:8 }}>
            <span style={{ fontWeight:700, fontSize:"0.9rem" }}>All Invoices</span>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:dark?"#1e2330":"#f3f4f6", borderRadius:10, padding:"0.4rem 0.8rem" }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoices..." style={{ background:"transparent", border:"none", outline:"none", color:txt, fontSize:"0.78rem", width:160 }} />
              </div>
              {["All","Paid","Pending","Overdue"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{ padding:"0.3rem 0.75rem", borderRadius:8, border:"none", fontSize:"0.75rem", background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent", color:tab===t?txt:muted, fontWeight:tab===t?700:400, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:700 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`, background:dark?"#0d1117":"#f9fafb" }}>
                  {["Invoice","Customer","Order","Status","Issued","Due","Amount",""].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"0.55rem 0.75rem", fontWeight:500, color:muted, fontSize:"0.72rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:"center", padding:"3rem", color:muted }}>
                      <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🧾</div>
                      <div style={{ fontWeight:600, marginBottom:"0.25rem" }}>No invoices yet</div>
                      <div style={{ fontSize:"0.72rem" }}>Invoices are generated automatically from orders.</div>
                    </td>
                  </tr>
                ) : filtered.map(inv=>(
                  <tr key={inv.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                    <td style={{ padding:"0.65rem 0.75rem", fontFamily:"monospace", fontSize:"0.75rem", color:muted }}>{inv.id}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ fontWeight:600, fontSize:"0.82rem" }}>{inv.customer}</div>
                      <div style={{ color:muted, fontSize:"0.68rem" }}>{inv.email}</div>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted, fontFamily:"monospace", fontSize:"0.75rem" }}>{inv.order}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[inv.status], background:statusBg[inv.status], padding:"3px 10px", borderRadius:999 }}>{inv.status}</span>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.75rem", whiteSpace:"nowrap" }}>{inv.issued}</td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.75rem", whiteSpace:"nowrap" }}>{inv.due}</td>
                    <td style={{ padding:"0.65rem 0.75rem", fontWeight:700 }}>{inv.amount}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>downloadInvoice(inv)} title="Download" style={{ background:"none", border:"none", color:muted, cursor:"pointer" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        </button>
                        {inv.status==="Pending" && (
                          <button title="Send reminder" style={{ background:"none", border:"none", color:muted, cursor:"pointer" }}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
