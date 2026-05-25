// ============================================================
// App — root state, routing, Tweaks panel
// ============================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "isLoggedIn": false,
  "isAdmin": false
}/*EDITMODE-END*/;

function App() {
  const [page, setPage]                 = React.useState("home");
  const [selectedListing, setSel]       = React.useState(null);
  const [currentUser, setCurrentUser]   = React.useState(null);
  const [favorites, setFavorites]       = React.useState(new Set([1, 6]));
  const [listings, setListings]         = React.useState(MOCK_LISTINGS);
  const [tweaksOpen, setTweaksOpen]     = React.useState(false);
  const [tweaks, setTweaksState]        = React.useState(TWEAK_DEFAULTS);

  // Sync tweaks → user
  React.useEffect(() => {
    if (tweaks.isLoggedIn) {
      setCurrentUser(tweaks.isAdmin ? ADMIN_USER : DEFAULT_USER);
    } else {
      setCurrentUser(null);
    }
  }, [tweaks.isLoggedIn, tweaks.isAdmin]);

  // Tweaks host protocol
  React.useEffect(() => {
    const handler = e => {
      if (e.data?.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const setTweak = (key, val) => {
    setTweaksState(prev => ({ ...prev, [key]: val }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  };

  // Navigation
  const navigate = (newPage, listing = null) => {
    setPage(newPage);
    if (listing) setSel(listing);
    window.scrollTo({ top: 0 });
  };

  const viewListing = listing => { setSel(listing); setPage("listing"); window.scrollTo({ top: 0 }); };
  const toggleFav   = id => setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const handleLogin  = user => setCurrentUser(user);
  const handleLogout = ()   => { setCurrentUser(null); setPage("home"); };
  const addListing   = l    => setListings(prev => [l, ...prev]);

  // ── Page router ──
  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage listings={listings} navigate={navigate} favorites={favorites} onToggleFavorite={toggleFav} onViewListing={viewListing} />;
      case "listing":
        return selectedListing
          ? <ListingDetail listing={selectedListing} navigate={navigate} favorites={favorites} onToggleFavorite={toggleFav} currentUser={currentUser} />
          : null;
      case "create":
        return currentUser
          ? <CreateListing navigate={navigate} currentUser={currentUser} onAddListing={addListing} />
          : <AuthPages navigate={navigate} onLogin={handleLogin} />;
      case "auth":
        return <AuthPages navigate={navigate} onLogin={handleLogin} />;
      case "profile":
        return currentUser
          ? <ProfilePage currentUser={currentUser} navigate={navigate} listings={listings} favorites={favorites} />
          : <AuthPages navigate={navigate} onLogin={handleLogin} />;
      case "favorites":
        return <FavoritesPage listings={listings} favorites={favorites} navigate={navigate} onToggleFavorite={toggleFav} onViewListing={viewListing} />;
      case "admin":
        return currentUser?.role === "admin"
          ? <AdminPanel listings={listings} users={MOCK_USERS} navigate={navigate} />
          : (
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
              <IconsSVG name="shield" size={40} className="text-gray-300 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 text-lg mb-1">Acces restricționat</h2>
              <p className="text-sm text-gray-500">Această pagină este disponibilă doar pentru administratori.</p>
            </div>
          );
      default:
        return <HomePage listings={listings} navigate={navigate} favorites={favorites} onToggleFavorite={toggleFav} onViewListing={viewListing} />;
    }
  };

  // ── Toggle helper ──
  const Toggle = ({ value, onChange, color = "green" }) => {
    const bg = value ? (color === "purple" ? "bg-purple-500" : "bg-green-500") : "bg-gray-300";
    return (
      <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-colors relative ${bg}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={page} navigate={navigate} currentUser={currentUser} onLogout={handleLogout} />

      <main>{renderPage()}</main>

      {/* ── Minimal footer ── */}
      {page !== "auth" && (
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                <IconsSVG name="home" size={10} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-gray-600">Marketplace</span>
              <span>· © 2026</span>
            </div>
            <div className="flex gap-4">
              {["Termeni","Confidențialitate","Ajutor","Contact"].map(l => (
                <span key={l} className="cursor-pointer hover:text-gray-600 transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </footer>
      )}

      {/* ── Tweaks panel ── */}
      {tweaksOpen && (
        <div className="fixed bottom-4 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <span className="text-sm font-bold text-white tracking-wide">Tweaks</span>
            <button
              onClick={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IconsSVG name="x" size={16} />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* User state */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Stare utilizator</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Autentificat</span>
                  <Toggle value={tweaks.isLoggedIn} onChange={v => setTweak("isLoggedIn", v)} />
                </div>
                {tweaks.isLoggedIn && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Mod Admin</span>
                    <Toggle value={tweaks.isAdmin} onChange={v => setTweak("isAdmin", v)} color="purple" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick nav */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Navigare rapidă</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Anunțuri",  p: "home" },
                  { label: "Detaliu",   p: "listing" },
                  { label: "Publică",   p: "create" },
                  { label: "Login",     p: "auth" },
                  { label: "Profil",    p: "profile" },
                  { label: "Favorite",  p: "favorites" },
                  { label: "Admin",     p: "admin" },
                ].map(({ label, p }) => (
                  <button
                    key={p}
                    onClick={() => p === "listing" ? viewListing(listings[0]) : navigate(p)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      page === p
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current state indicator */}
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1 border border-gray-100">
              <p><span className="font-semibold">Pagina:</span> {page}</p>
              <p><span className="font-semibold">Utilizator:</span> {currentUser ? currentUser.name : "Neautentificat"}</p>
              <p><span className="font-semibold">Favorite:</span> {favorites.size} anunțuri</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
