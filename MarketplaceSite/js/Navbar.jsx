// ============================================================
// Navbar — sticky top navigation
// ============================================================

const { useState: useNavState } = React;

function Navbar({ currentPage, navigate, currentUser, onLogout }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const navLinks = [
    { label: "Anunțuri", page: "home" },
    ...(currentUser ? [{ label: "Favorite", page: "favorites" }] : []),
    ...(currentUser && currentUser.role === "admin" ? [{ label: "Admin", page: "admin" }] : []),
  ];

  const closeAll = () => { setMobileOpen(false); setProfileOpen(false); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <button
            onClick={() => { navigate("home"); closeAll(); }}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <IconsSVG name="home" size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Marketplace</span>
          </button>

          {/* ── Search bar (desktop) ── */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IconsSVG name="search" size={15} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Caută anunțuri..."
                onKeyDown={(e) => e.key === "Enter" && navigate("home")}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === link.page
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </button>
            ))}

            {currentUser ? (
              <div className="flex items-center gap-2 ml-1">
                {/* Add listing CTA */}
                <button
                  onClick={() => navigate("create")}
                  className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <IconsSVG name="plus" size={14} />
                  Adaugă
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {currentUser.name[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{currentUser.name.split(" ")[0]}</span>
                    <IconsSVG name="chevron-down" size={13} className="text-gray-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>
                      </div>
                      {[
                        { label: "Profilul meu", icon: "user", page: "profile" },
                        { label: "Anunțurile mele", icon: "file-text", page: "profile" },
                        { label: "Favorite", icon: "heart", page: "favorites" },
                        { label: "Adaugă anunț", icon: "plus", page: "create" },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={() => { navigate(item.page); setProfileOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <IconsSVG name={item.icon} size={14} className="text-gray-400" />
                          {item.label}
                        </button>
                      ))}
                      {currentUser.role === "admin" && (
                        <button
                          onClick={() => { navigate("admin"); setProfileOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <IconsSVG name="shield" size={14} className="text-purple-400" />
                          Admin Panel
                        </button>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => { onLogout(); setProfileOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <IconsSVG name="log-out" size={14} className="text-red-400" />
                          Deconectare
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <button
                  onClick={() => navigate("auth")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Autentificare
                </button>
                <button
                  onClick={() => navigate("auth")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Înregistrare
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconsSVG name={mobileOpen ? "x" : "menu"} size={20} />
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {/* Mobile search */}
            <div className="pb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <IconsSVG name="search" size={15} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Caută anunțuri..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { navigate(link.page); closeAll(); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg ${
                  currentPage === link.page ? "text-green-600 bg-green-50" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </button>
            ))}

            {currentUser ? (
              <>
                <button onClick={() => { navigate("profile"); closeAll(); }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profilul meu
                </button>
                <button onClick={() => { navigate("create"); closeAll(); }} className="w-full flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg px-3 py-2.5 mt-1">
                  <IconsSVG name="plus" size={14} />
                  Adaugă anunț
                </button>
                <button onClick={() => { onLogout(); closeAll(); }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg">
                  Deconectare
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <button onClick={() => { navigate("auth"); closeAll(); }} className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Autentificare
                </button>
                <button onClick={() => { navigate("auth"); closeAll(); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
                  Înregistrare
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
