// ============================================================
// ProfilePage — avatar header + 3 tabs: listings / messages / settings
// ============================================================

function ProfilePage({ currentUser, navigate, listings, favorites }) {
  const [activeTab, setActiveTab] = React.useState("listings");
  const [editing, setEditing] = React.useState(false);
  const [settings, setSettings] = React.useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    city: "București",
  });

  // Simulated "my" listings — every 3rd from the master list
  const myListings = React.useMemo(
    () => listings.filter((_, i) => i % 3 === 0),
    [listings]
  );

  const mockMessages = [
    { id: 1, from: "Ion P.",   listing: "iPhone 14 Pro",     preview: "Mai este disponibil produsul?",      time: "2h",  unread: true },
    { id: 2, from: "Maria D.", listing: "iPhone 14 Pro",     preview: "Ce preț final faceți?",             time: "5h",  unread: true },
    { id: 3, from: "Andrei I.", listing: "VW Golf 7",        preview: "Putem programa o vizionare mâine?", time: "1 zi", unread: false },
  ];

  const tabs = [
    { id: "listings",  label: "Anunțurile mele", count: myListings.length },
    { id: "messages",  label: "Mesaje",           count: mockMessages.filter(m => m.unread).length },
    { id: "settings",  label: "Setări",           count: null },
  ];

  const StatusPill = ({ status }) => {
    const map = {
      active: "bg-green-100 text-green-700",
      sold:   "bg-red-100 text-red-600",
      paused: "bg-yellow-100 text-yellow-700",
    };
    const labels = { active: "Activ", sold: "Vândut", paused: "Pauză" };
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Profile header card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shrink-0 shadow-sm">
            {currentUser?.name?.[0] || "U"}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{currentUser?.name}</h1>
              {currentUser?.role === "admin" && (
                <span className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <IconsSVG name="shield" size={10} /> Admin
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{currentUser?.email}</p>
            <p className="text-xs text-gray-400 mt-2">Membru din {currentUser?.memberSince}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => navigate("create")} className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <IconsSVG name="plus" size={12} /> Anunț nou
              </button>
              <button onClick={() => setActiveTab("settings")} className="flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <IconsSVG name="settings" size={12} /> Setări
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 sm:flex-col sm:items-end">
            {[
              { label: "Anunțuri",  val: myListings.length },
              { label: "Favorite",  val: favorites.size },
              { label: "Vizualizări", val: myListings.reduce((s, l) => s + l.views, 0) },
            ].map(s => (
              <div key={s.label} className="text-center bg-gray-50 rounded-xl px-4 py-2.5 min-w-[72px]">
                <p className="text-xl font-bold text-gray-900">{s.val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: My listings ── */}
      {activeTab === "listings" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-900">{myListings.length} anunțuri publicate</p>
            <button onClick={() => navigate("create")} className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
              <IconsSVG name="plus" size={14} /> Adaugă
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-gray-200">
              <IconsSVG name="package" size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-800 mb-1">Niciun anunț publicat</p>
              <p className="text-sm text-gray-500 mb-5">Publică primul tău anunț chiar acum.</p>
              <button onClick={() => navigate("create")} className="bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors">
                Publică anunț
              </button>
            </div>
          ) : myListings.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              {/* Thumb */}
              <div className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center ${(CATEGORY_STYLE[l.category] || CATEGORY_STYLE["Altele"]).area}`}>
                <IconsSVG name="image" size={20} className="text-gray-400 opacity-50" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                  <StatusPill status={l.status} />
                </div>
                <p className="text-base font-bold text-green-600 mt-0.5">{l.price.toLocaleString("ro-RO")} RON</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-0.5"><IconsSVG name="map-pin" size={10} />{l.city}</span>
                  <span className="flex items-center gap-0.5"><IconsSVG name="eye" size={10} />{l.views}</span>
                  <span>{l.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <IconsSVG name="edit" size={15} />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <IconsSVG name="trash" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Messages ── */}
      {activeTab === "messages" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">{mockMessages.length} mesaje</p>
          {mockMessages.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm shrink-0">
                {m.from[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-gray-900">{m.from}</p>
                  <span className="text-xs text-gray-400">{m.time}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Re: {m.listing}</p>
                <p className="text-sm text-gray-700 truncate">{m.preview}</p>
              </div>
              {m.unread && <div className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 mt-1.5"></div>}
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Settings ── */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Informații cont</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              <IconsSVG name="edit" size={13} />
              {editing ? "Anulează" : "Editează"}
            </button>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: "Nume complet", key: "name",  type: "text" },
              { label: "Email",        key: "email", type: "email" },
              { label: "Telefon",      key: "phone", type: "tel",  ph: "07xx xxx xxx" },
              { label: "Oraș",         key: "city",  type: "text" },
            ].map(({ label, key, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                {editing ? (
                  <input
                    type={type}
                    value={settings[key]}
                    onChange={e => setSettings(s => ({...s, [key]: e.target.value}))}
                    placeholder={ph || ""}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-900">
                    {settings[key] || <span className="text-gray-400 italic">Necompletat</span>}
                  </p>
                )}
              </div>
            ))}

            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors text-sm mt-2"
              >
                Salvează modificările
              </button>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Securitate</p>
            <button className="text-sm text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Schimbă parola
            </button>
          </div>

          <div className="px-6 py-4 border-t border-red-50/60">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Zona periculoasă</p>
            <button className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
              Șterge contul
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

window.ProfilePage = ProfilePage;
