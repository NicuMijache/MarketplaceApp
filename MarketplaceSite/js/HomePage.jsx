// ============================================================
// HomePage — search hero + sidebar filters + listing grid
// ============================================================

const CATEGORY_STYLE = {
  "Electronice":    { area: "bg-blue-50",    badge: "bg-blue-100 text-blue-700" },
  "Auto":           { area: "bg-slate-100",  badge: "bg-slate-100 text-slate-700" },
  "Imobiliare":     { area: "bg-amber-50",   badge: "bg-amber-100 text-amber-700" },
  "Sport":          { area: "bg-orange-50",  badge: "bg-orange-100 text-orange-700" },
  "Modă":           { area: "bg-pink-50",    badge: "bg-pink-100 text-pink-700" },
  "Casă & Grădină": { area: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
  "Servicii":       { area: "bg-purple-50",  badge: "bg-purple-100 text-purple-700" },
  "Altele":         { area: "bg-gray-100",   badge: "bg-gray-100 text-gray-600" },
};

// ── Listing Card ─────────────────────────────────────────────
function ListingCard({ listing, onView, onToggleFavorite, isFavorite, showRemove }) {
  const [hovered, setHovered] = React.useState(false);
  const cfg = CATEGORY_STYLE[listing.category] || CATEGORY_STYLE["Altele"];

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ${hovered ? "shadow-md -translate-y-px" : "shadow-sm"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image placeholder */}
      <div
        className={`${cfg.area} aspect-[4/3] relative flex items-center justify-center border-b border-gray-100 cursor-pointer`}
        onClick={() => onView(listing)}
      >
        <div className="flex flex-col items-center gap-1.5 opacity-25 select-none">
          <IconsSVG name="image" size={36} className="text-gray-500" />
          <span className="text-xs font-mono text-gray-500">{listing.category}</span>
        </div>

        {/* Favorite btn */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(listing.id); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <IconsSVG
            name="heart"
            size={15}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          />
        </button>

        {/* Status overlays */}
        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Vândut</span>
          </div>
        )}
        {listing.status === "paused" && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-md">Pauză</span>
          </div>
        )}
        {listing.featured && listing.status === "active" && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">Promovat</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 cursor-pointer" onClick={() => onView(listing)}>
        <h3 className={`text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug transition-colors ${hovered ? "text-green-700" : ""}`}>
          {listing.title}
        </h3>

        <p className="text-lg font-bold text-green-600 mb-3">
          {listing.price.toLocaleString("ro-RO")} <span className="text-sm font-semibold text-green-500">RON</span>
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
          <span className="flex items-center gap-1">
            <IconsSVG name="map-pin" size={11} />
            {listing.city}
          </span>
          <span>{listing.date}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${cfg.badge}`}>
            {listing.category}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-gray-400">
            <IconsSVG name="eye" size={11} />
            {listing.views}
          </span>
        </div>

        {showRemove && (
          <button
            onClick={e => { e.stopPropagation(); onToggleFavorite(listing.id); }}
            className="mt-3 w-full py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Elimină din favorite
          </button>
        )}
      </div>
    </div>
  );
}

// ── HomePage ──────────────────────────────────────────────────
function HomePage({ listings, navigate, favorites, onToggleFavorite, onViewListing }) {
  const [search, setSearch] = React.useState("");
  const [selCategory, setSelCategory] = React.useState("");
  const [priceMin, setPriceMin] = React.useState("");
  const [priceMax, setPriceMax] = React.useState("");
  const [selCity, setSelCity] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [showFilters, setShowFilters] = React.useState(false);

  const filtered = React.useMemo(() => {
    let r = [...listings];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(l => l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q) || l.city.toLowerCase().includes(q));
    }
    if (selCategory) r = r.filter(l => l.category === selCategory);
    if (priceMin)    r = r.filter(l => l.price >= Number(priceMin));
    if (priceMax)    r = r.filter(l => l.price <= Number(priceMax));
    if (selCity)     r = r.filter(l => l.city === selCity);

    if (sortBy === "newest")     r.sort((a, b) => b.id - a.id);
    if (sortBy === "price-asc")  r.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sortBy === "views")      r.sort((a, b) => b.views - a.views);
    return r;
  }, [listings, search, selCategory, priceMin, priceMax, selCity, sortBy]);

  const hasFilters = selCategory || priceMin || priceMax || selCity;
  const clearFilters = () => { setSelCategory(""); setPriceMin(""); setPriceMax(""); setSelCity(""); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      {/* ── Search hero ── */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <IconsSVG name="search" size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ce cauți astăzi?"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-600">
                <IconsSVG name="x" size={15} />
              </button>
            )}
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 px-4 rounded-xl text-sm font-medium border transition-colors ${showFilters || hasFilters ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-700"}`}
          >
            <IconsSVG name="filter" size={16} />
            {hasFilters ? "Filtrat" : "Filtre"}
          </button>
        </div>
      </div>

      <div className="flex gap-6">

        {/* ── Sidebar filters ── */}
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-60 shrink-0`}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-sm">Filtre</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-green-600 hover:text-green-700 font-semibold">
                  Resetează
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorie</p>
              <div className="space-y-0.5">
                <button
                  onClick={() => setSelCategory("")}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors ${!selCategory ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Toate
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelCategory(cat === selCategory ? "" : cat)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selCategory === cat ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span>{cat}</span>
                    <span className="text-xs text-gray-400">{listings.filter(l => l.category === cat).length}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preț (RON)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Oraș</p>
              <select
                value={selCity}
                onChange={e => setSelCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700"
              >
                <option value="">Toate orașele</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* ── Main listing grid ── */}
        <main className="flex-1 min-w-0">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filtered.length}</span> anunțuri
              {(hasFilters || search) && <span className="ml-1 text-green-600 font-medium">(filtrate)</span>}
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              <option value="newest">Cele mai noi</option>
              <option value="price-asc">Preț crescător</option>
              <option value="price-desc">Preț descrescător</option>
              <option value="views">Cele mai vizualizate</option>
            </select>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <IconsSVG name="search" size={40} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Niciun rezultat</h3>
              <p className="text-sm text-gray-500 mb-4">Încearcă alți termeni sau resetează filtrele.</p>
              <button onClick={() => { clearFilters(); setSearch(""); }} className="text-sm text-green-600 font-semibold hover:text-green-700">
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onView={onViewListing}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.has(listing.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

window.ListingCard = ListingCard;
window.CATEGORY_STYLE = CATEGORY_STYLE;
window.HomePage = HomePage;
