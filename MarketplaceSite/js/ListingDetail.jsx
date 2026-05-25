// ============================================================
// ListingDetail — full detail page: gallery, info, contact form
// ============================================================

function ListingDetail({ listing, navigate, favorites, onToggleFavorite }) {
  const [activeThumb, setActiveThumb] = React.useState(0);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const isFav = favorites.has(listing.id);
  const cfg = CATEGORY_STYLE[listing.category] || CATEGORY_STYLE["Altele"];
  const THUMB_COUNT = 4;

  const statusBadge = {
    active: null,
    sold:   <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Vândut</span>,
    paused: <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Pauză</span>,
  }[listing.status];

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = "Câmp obligatoriu";
    if (!form.email.includes("@")) e.email = "Email invalid";
    if (!form.message.trim()) e.message = "Câmp obligatoriu";
    return e;
  };

  const handleSend = ev => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };

  const field = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      {/* Back */}
      <button
        onClick={() => navigate("home")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 group transition-colors"
      >
        <IconsSVG name="arrow-left" size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Înapoi la anunțuri
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: gallery + description ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Gallery */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main image */}
            <div className={`${cfg.area} aspect-[16/9] flex items-center justify-center border-b border-gray-100`}>
              <div className="flex flex-col items-center gap-3 opacity-20 select-none">
                <IconsSVG name="image" size={64} className="text-gray-500" />
                <span className="text-sm font-mono text-gray-500">fotografie {activeThumb + 1} / {THUMB_COUNT}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="p-3 flex gap-2">
              {Array.from({ length: THUMB_COUNT }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`w-16 h-16 shrink-0 rounded-lg border-2 transition-all ${cfg.area} flex items-center justify-center ${activeThumb === i ? "border-green-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <IconsSVG name="image" size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Descriere</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>

            {/* Meta grid */}
            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Categorie", val: listing.category },
                { label: "Oraș",      val: listing.city },
                { label: "Postare",   val: listing.date },
                { label: "Vizualizări", val: listing.views },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="font-semibold text-gray-900">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: price + seller + contact ── */}
        <div className="space-y-4">

          {/* Price card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h1 className="text-sm font-semibold text-gray-900 leading-snug flex-1">{listing.title}</h1>
              {statusBadge}
            </div>

            <p className="text-3xl font-bold text-green-600 mt-2 mb-1">
              {listing.price.toLocaleString("ro-RO")}
              <span className="text-lg font-semibold text-green-500 ml-1">RON</span>
            </p>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
              <IconsSVG name="map-pin" size={13} />
              {listing.city}
            </div>

            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md mt-1 ${cfg.badge}`}>
              {listing.category}
            </span>

            <button
              onClick={() => onToggleFavorite(listing.id)}
              className={`w-full flex items-center justify-center gap-2 mt-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                isFav
                  ? "border-red-200 text-red-500 bg-red-50 hover:bg-red-100"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <IconsSVG name="heart" size={15} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-red-500" : ""} />
              {isFav ? "Eliminat din favorite" : "Adaugă la favorite"}
            </button>
          </div>

          {/* Seller card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Vânzător</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {listing.seller.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{listing.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="font-semibold text-gray-700">{listing.seller.rating}</span>
                  <span>· {listing.seller.totalListings} anunțuri</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Membru din {listing.seller.memberSince}</p>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contactează vânzătorul</p>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <IconsSVG name="check" size={22} className="text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Mesaj trimis!</p>
                <p className="text-xs text-gray-500 mb-4">Vânzătorul va răspunde în curând.</p>
                <button onClick={() => setSent(false)} className="text-xs text-green-600 font-semibold hover:text-green-700">
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-3">
                {[
                  { key: "name",    type: "text",  ph: "Numele tău",   icon: "user" },
                  { key: "email",   type: "email", ph: "Email",         icon: "at-sign" },
                  { key: "phone",   type: "tel",   ph: "Telefon (opț.)", icon: "phone" },
                ].map(({ key, type, ph, icon }) => (
                  <div key={key}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <IconsSVG name={icon} size={14} className="text-gray-400" />
                      </div>
                      <input
                        type={type}
                        placeholder={ph}
                        value={form[key]}
                        onChange={e => field(key, e.target.value)}
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors[key] ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                    </div>
                    {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                  </div>
                ))}

                <div>
                  <textarea
                    placeholder="Mesajul tău..."
                    rows={4}
                    value={form.message}
                    onChange={e => field("message", e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-0.5">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Trimite mesajul
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ListingDetail = ListingDetail;
