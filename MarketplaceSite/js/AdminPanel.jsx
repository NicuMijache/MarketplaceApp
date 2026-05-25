// ============================================================
// AdminPanel — listings table + users table with status actions
// ============================================================

function AdminPanel({ listings, users }) {
  const [activeTab, setActiveTab] = React.useState("listings");
  const [rows, setRows]   = React.useState(listings);
  const [uRows, setURows] = React.useState(users);

  const updListing = (id, status) =>
    setRows(prev => prev.map(l => l.id === id ? { ...l, status } : l));

  const updUser = (id, status) =>
    setURows(prev => prev.map(u => u.id === id ? { ...u, status } : u));

  const stats = [
    { label: "Total anunțuri",  val: rows.length,                                         color: "text-gray-900" },
    { label: "Active",          val: rows.filter(l => l.status === "active").length,       color: "text-green-600" },
    { label: "Vândute",         val: rows.filter(l => l.status === "sold").length,         color: "text-red-500" },
    { label: "Total utilizatori", val: uRows.length,                                       color: "text-gray-900" },
    { label: "Activi",          val: uRows.filter(u => u.status === "active").length,      color: "text-green-600" },
    { label: "Blocați",         val: uRows.filter(u => u.status === "blocked").length,     color: "text-red-500" },
  ];

  const StatusPill = ({ status }) => {
    const map = {
      active:  "bg-green-100 text-green-700",
      sold:    "bg-red-100 text-red-600",
      paused:  "bg-yellow-100 text-yellow-700",
      blocked: "bg-red-100 text-red-600",
    };
    const labels = { active:"Activ", sold:"Vândut", paused:"Pauză", blocked:"Blocat" };
    return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-500"}`}>{labels[status] || status}</span>;
  };

  const ActionBtn = ({ label, color, onClick, disabled }) => {
    const colors = {
      green:  "bg-green-100 text-green-700 hover:bg-green-200",
      yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      red:    "bg-red-100 text-red-600 hover:bg-red-200",
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${colors[color]}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panou Administrare</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestionează anunțurile și utilizatorii platformei</p>
        </div>
        <span className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-xl text-sm font-bold">
          <IconsSVG name="shield" size={14} /> Admin
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {[["listings","Anunțuri"],["users","Utilizatori"]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Listings table ── */}
      {activeTab === "listings" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Anunț","Vânzător","Preț","Oraș","Status","Acțiuni"].map((h, i) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${i >= 4 ? "text-center" : "text-left"} ${i === 1 ? "hidden md:table-cell" : ""} ${i === 2 ? "hidden sm:table-cell text-right" : ""} ${i === 3 ? "hidden lg:table-cell" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((l, i) => (
                  <tr key={l.id} className={`${i % 2 !== 0 ? "bg-gray-50/40" : ""} hover:bg-gray-50 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${(CATEGORY_STYLE[l.category] || CATEGORY_STYLE["Altele"]).area}`}>
                          <IconsSVG name="image" size={14} className="text-gray-400 opacity-60" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[150px]">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{l.seller.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-right font-semibold text-gray-900">
                      {l.price.toLocaleString("ro-RO")} RON
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{l.city}</td>
                    <td className="px-4 py-3 text-center"><StatusPill status={l.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <ActionBtn label="Activează" color="green"  onClick={() => updListing(l.id, "active")} disabled={l.status === "active"} />
                        <ActionBtn label="Pauză"     color="yellow" onClick={() => updListing(l.id, "paused")} disabled={l.status === "paused"} />
                        <ActionBtn label="Blochează" color="red"    onClick={() => updListing(l.id, "sold")}   disabled={l.status === "sold"}   />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users table ── */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Utilizator","Email","Anunțuri","Membru din","Status","Acțiuni"].map((h, i) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${i >= 4 ? "text-center" : "text-left"} ${i === 1 ? "hidden md:table-cell" : ""} ${i === 2 ? "hidden sm:table-cell text-center" : ""} ${i === 3 ? "hidden lg:table-cell" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uRows.map((u, i) => (
                  <tr key={u.id} className={`${i % 2 !== 0 ? "bg-gray-50/40" : ""} hover:bg-gray-50 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{u.name}</p>
                          {u.role === "admin" && <p className="text-xs text-purple-600 font-semibold">Admin</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-center font-semibold text-gray-900">{u.listings}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{u.memberSince}</td>
                    <td className="px-4 py-3 text-center"><StatusPill status={u.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <ActionBtn label="Activează" color="green" onClick={() => updUser(u.id, "active")}  disabled={u.status === "active"  || u.role === "admin"} />
                        <ActionBtn label="Blochează" color="red"   onClick={() => updUser(u.id, "blocked")} disabled={u.status === "blocked" || u.role === "admin"} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

window.AdminPanel = AdminPanel;
