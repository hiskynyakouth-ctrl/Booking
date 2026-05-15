import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getUsers as fetchUsers,
  createUser,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  persistUsers,
} from "../services/userService";

const ROLES = ["Admin","Editor","Moderator","Viewer","Customer"];
const DEPTS = ["Engineering","Marketing","Support","Sales","Design","Finance","HR","Operations"];
const TABS  = ["All","Active","Inactive","Suspended"];


const roleColor = { Admin:"#22c55e", Editor:"#6b7280", Moderator:"#f59e0b", Viewer:"#6b7280", Customer:"#3b82f6" };
const roleBg    = { Admin:"rgba(34,197,94,0.15)", Editor:"rgba(107,114,128,0.12)", Moderator:"rgba(245,158,11,0.15)", Viewer:"rgba(107,114,128,0.12)", Customer:"rgba(59,130,246,0.12)" };
const statusColor = { Active:"#22c55e", Inactive:"#6b7280", Suspended:"#ef4444" };
const statusBg    = { Active:"rgba(34,197,94,0.15)", Inactive:"rgba(107,114,128,0.12)", Suspended:"rgba(239,68,68,0.15)" };

const PER_PAGE = 10;

export default function Users() {
  const { theme } = useTheme();
  const { user: me } = useAuth();
  const dark = theme === "dark";

  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [editUser, setEditUser] = useState(null);   // user being edited
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name:"", email:"", teamRole:"Viewer", dept:"Engineering", status:"Active" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers((data || []).filter(Boolean));
    };
    loadUsers();
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";
  const inp  = { width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:8, padding:"0.55rem 0.75rem", color:txt, fontSize:"0.82rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const save = (updated) => {
    setUsers(updated);
    persistUsers(updated);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = users.filter(u => {
    const matchTab    = tab === "All" || u.status === tab;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(s => s.length === paginated.length ? [] : paginated.map(u => u.id));

  const deleteUser = async (id) => {
    try {
      await deleteUserApi(id);
    } catch {
      // offline fallback
    }
    const updated = users.filter(u => u.id !== id);
    save(updated);
    setSelected(s => s.filter(x => x !== id));
    showToast("User deleted");
  };

  const bulkDelete = async () => {
    await Promise.all(selected.map(id => deleteUserApi(id).catch(() => null)));
    const updated = users.filter(u => !selected.includes(u.id));
    save(updated);
    setSelected([]);
    showToast(`${selected.length} users deleted`);
  };

  const updateUser = async (id, changes) => {
    try {
      const updatedUser = await updateUserApi(id, changes);
      save(users.map(u => u.id === id ? updatedUser : u));
    } catch {
      save(users.map(u => u.id === id ? { ...u, ...changes } : u));
    }
    showToast("User updated");
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email) return;
    const payload = {
      name: newUser.name,
      email: newUser.email,
      role: "customer",
      teamRole: newUser.teamRole,
      department: newUser.dept,
      status: newUser.status,
    };

    let created;
    try {
      created = await createUser(payload);
    } catch {
      const initials = newUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      const colors   = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
      created = {
        ...payload,
        id: Date.now().toString(),
        initials,
        color: colors[Math.floor(Math.random() * colors.length)],
        last: "Just now",
      };
      save([created, ...users]);
      setShowAdd(false);
      setNewUser({ name:"", email:"", teamRole:"Viewer", dept:"Engineering", status:"Active" });
      showToast("User added");
      return;
    }

    save([created, ...users]);
    setShowAdd(false);
    setNewUser({ name:"", email:"", teamRole:"Viewer", dept:"Engineering", status:"Active" });
    showToast("User added");
  };

  const exportCSV = () => {
    const rows = [["Name","Email","Role","Department","Status","Last Active"], ...filtered.map(u => [u.name, u.email, u.teamRole, u.dept, u.status, u.last])];
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.map(r => r.join(",")).join("\n")); a.download = "users.csv"; a.click();
  };

  const sel = { background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:8, padding:"0.35rem 0.6rem", color:txt, fontSize:"0.78rem", outline:"none", cursor:"pointer" };

  const addActions = (
    <button onClick={() => setShowAdd(true)} style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.45rem 1rem",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
      Add User
    </button>
  );

  return (
    <DashboardLayout title="Users" subtitle="Manage team members, roles, and permissions." actions={addActions}>
      <div style={{ padding:"1.25rem", position:"relative" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position:"fixed",bottom:"1.5rem",right:"1.5rem",background:"#22c55e",color:"#000",fontWeight:700,fontSize:"0.82rem",padding:"0.6rem 1.25rem",borderRadius:10,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
            ✓ {toast}
          </div>
        )}

        {/* Add User Modal */}
        {showAdd && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}
            onClick={() => setShowAdd(false)}>
            <div style={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:440,margin:"0 1rem" }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
                <h3 style={{ fontWeight:700,fontSize:"1rem",color:txt }}>Add New User</h3>
                <button onClick={()=>setShowAdd(false)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1.2rem" }}>✕</button>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.85rem" }}>
                {[["Full name","text",newUser.name,v=>setNewUser(n=>({...n,name:v}))],["Email","email",newUser.email,v=>setNewUser(n=>({...n,email:v}))]].map(([label,type,val,setter])=>(
                  <div key={label}>
                    <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>{label}</label>
                    <input type={type} value={val} onChange={e=>setter(e.target.value)} style={inp} placeholder={label} />
                  </div>
                ))}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
                  <div>
                    <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Role</label>
                    <select value={newUser.teamRole} onChange={e=>setNewUser(n=>({...n,teamRole:e.target.value}))} style={sel}>
                      {ROLES.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Department</label>
                    <select value={newUser.dept} onChange={e=>setNewUser(n=>({...n,dept:e.target.value}))} style={sel}>
                      {DEPTS.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex",gap:"0.75rem",marginTop:4 }}>
                  <button onClick={()=>setShowAdd(false)} style={{ flex:1,background:sub,border:`1px solid ${bdr}`,color:muted,padding:"0.6rem",borderRadius:8,cursor:"pointer",fontSize:"0.85rem" }}>Cancel</button>
                  <button onClick={addUser} style={{ flex:1,background:"#22c55e",border:"none",color:"#000",fontWeight:700,padding:"0.6rem",borderRadius:8,cursor:"pointer",fontSize:"0.85rem" }}>Add User</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}
            onClick={() => setEditUser(null)}>
            <div style={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:440,margin:"0 1rem" }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
                <h3 style={{ fontWeight:700,fontSize:"1rem",color:txt }}>Edit User</h3>
                <button onClick={()=>setEditUser(null)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1.2rem" }}>✕</button>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.85rem" }}>
                <div>
                  <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Full name</label>
                  <input value={editUser.name} onChange={e=>setEditUser(u=>({...u,name:e.target.value}))} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Email</label>
                  <input value={editUser.email} onChange={e=>setEditUser(u=>({...u,email:e.target.value}))} style={inp} />
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
                  <div>
                    <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Role</label>
                    <select value={editUser.teamRole} onChange={e=>setEditUser(u=>({...u,teamRole:e.target.value}))} style={sel}>
                      {ROLES.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Department</label>
                    <select value={editUser.dept} onChange={e=>setEditUser(u=>({...u,dept:e.target.value}))} style={sel}>
                      {DEPTS.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Status</label>
                  <select value={editUser.status} onChange={e=>setEditUser(u=>({...u,status:e.target.value}))} style={sel}>
                    {["Active","Inactive","Suspended"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display:"flex",gap:"0.75rem",marginTop:4 }}>
                  <button onClick={()=>setEditUser(null)} style={{ flex:1,background:sub,border:`1px solid ${bdr}`,color:muted,padding:"0.6rem",borderRadius:8,cursor:"pointer",fontSize:"0.85rem" }}>Cancel</button>
                  <button onClick={()=>{ updateUser(editUser.id, editUser); setEditUser(null); }} style={{ flex:1,background:"#22c55e",border:"none",color:"#000",fontWeight:700,padding:"0.6rem",borderRadius:8,cursor:"pointer",fontSize:"0.85rem" }}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex",gap:4,marginBottom:"1rem",flexWrap:"wrap" }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>{setTab(t);setPage(1);setSelected([]);}} style={{ padding:"0.35rem 0.9rem",borderRadius:8,border:"none",fontSize:"0.78rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        {/* Search + actions */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"1rem",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:card,border:`1px solid ${bdr}`,borderRadius:10,padding:"0.45rem 0.9rem",flex:1,maxWidth:280 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search users..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
          </div>
          <div style={{ marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap" }}>
            {selected.length > 0 && (
              <button onClick={bulkDelete} style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"0.78rem",padding:"0.45rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
                Delete {selected.length} selected
              </button>
            )}
            <button onClick={exportCSV} style={{ display:"flex",alignItems:"center",gap:6,background:card,border:`1px solid ${bdr}`,color:muted,fontSize:"0.78rem",padding:"0.45rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.78rem",minWidth:600 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`,background:dark?"#0d1117":"#f9fafb" }}>
                  <th style={{ padding:"0.6rem 0.75rem",width:36 }}>
                    <input type="checkbox" checked={selected.length===paginated.length&&paginated.length>0} onChange={toggleAll} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                  </th>
                  {["Name","Role","Department","Status","Last Active","Actions"].map(h=>(
                    <th key={h} style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:500,color:muted,fontSize:"0.72rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length===0 ? (
                  <tr><td colSpan={7} style={{ textAlign:"center",padding:"3rem",color:muted }}>No users found</td></tr>
                ) : paginated.map(u=>(
                  <tr key={u.id} style={{ borderBottom:`1px solid ${bdr}`,background:selected.includes(u.id)?(dark?"rgba(34,197,94,0.05)":"rgba(34,197,94,0.03)"):"transparent" }}>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggleSelect(u.id)} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ width:32,height:32,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:700,color:"#000",flexShrink:0 }}>{u.initials}</div>
                        <div>
                          <div style={{ fontWeight:600,fontSize:"0.82rem" }}>{u.name}</div>
                          <div style={{ color:muted,fontSize:"0.68rem" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      {/* Inline role change */}
                      <select value={u.teamRole} onChange={e=>updateUser(u.id,{teamRole:e.target.value})}
                        style={{ background:roleBg[u.teamRole]||"transparent",border:`1px solid ${roleColor[u.teamRole]||"#555"}`,borderRadius:999,padding:"3px 8px",color:roleColor[u.teamRole]||txt,fontSize:"0.7rem",fontWeight:600,cursor:"pointer",outline:"none" }}>
                        {ROLES.map(r=><option key={r} style={{ background:dark?"#111318":"#fff",color:txt }}>{r}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem",color:muted,fontSize:"0.78rem" }}>{u.dept}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      {/* Inline status change */}
                      <select value={u.status} onChange={e=>updateUser(u.id,{status:e.target.value})}
                        style={{ background:statusBg[u.status]||"transparent",border:`1px solid ${statusColor[u.status]||"#555"}`,borderRadius:999,padding:"3px 8px",color:statusColor[u.status]||txt,fontSize:"0.7rem",fontWeight:600,cursor:"pointer",outline:"none" }}>
                        {["Active","Inactive","Suspended"].map(s=><option key={s} style={{ background:dark?"#111318":"#fff",color:txt }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem",color:muted,fontSize:"0.75rem" }}>{u.last}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex",gap:6 }}>
                        <button onClick={()=>setEditUser({...u})} title="Edit" style={{ background:"#1e2330",border:"none",color:"#aaa",width:28,height:28,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={()=>deleteUser(u.id)} title="Delete" style={{ background:"rgba(239,68,68,0.1)",border:"none",color:"#ef4444",width:28,height:28,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",borderTop:`1px solid ${bdr}`,fontSize:"0.75rem",color:muted,flexWrap:"wrap",gap:8 }}>
            <span>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} results</span>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background:card,border:`1px solid ${bdr}`,color:page===1?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===1?"not-allowed":"pointer",fontSize:"0.78rem" }}>Previous</button>
              {Array.from({length:totalPages},(_,i)=>i+1).slice(Math.max(0,page-2),Math.min(totalPages,page+1)).map(p=>(
                <button key={p} onClick={()=>setPage(p)} style={{ width:30,height:30,borderRadius:8,border:page===p?"none":`1px solid ${bdr}`,cursor:"pointer",fontSize:"0.78rem",background:page===p?"#22c55e":card,color:page===p?"#000":txt,fontWeight:page===p?700:400 }}>{p}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ background:card,border:`1px solid ${bdr}`,color:page===totalPages?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===totalPages?"not-allowed":"pointer",fontSize:"0.78rem" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

<style>{`
  @media (max-width: 768px) {
    table { font-size: 0.7rem; }
    th, td { padding: 0.4rem 0.5rem; }
    .nav-links { display: none; }
    .nav-right-full { display: none; }
    .nav-right-min { display: flex; }
  }
`}</style>
