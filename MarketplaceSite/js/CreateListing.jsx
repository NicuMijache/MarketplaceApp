// ============================================================
// CreateListing — multi-section form with image dropzone
// ============================================================

function CreateListing({ navigate, currentUser, onAddListing }) {
  const [form, setForm] = React.useState({ title: "", category: "", price: "", city: "", description: "" });
  const [errors, setErrors] = React.useState({});
  const [imageCount, setImageCount] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim() || form.title.length < 5)       e.title       = "Minim 5 caractere";
    if (!form.category)                                      e.category    = "Selectează o categorie";
    if (!form.price || isNaN(form.price) || +form.price<=0) e.price       = "Preț invalid";
    if (!form.city)                                          e.city        = "Selectează un oraș";
    if (!form.description.trim() || form.description.length < 20) e.description = "Minim 20 caractere";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      onAddListing({
        id: Date.now(),
        ...form,
        price: Number(form.price),
        seller: { id: currentUser.id, name: currentUser.name, rating: 5.0, totalListings: 1, memberSince: "2026" },
        status: "active",
        date: new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }),
        views: 0,
        featured: false,
      });
      setSubmitting(false);
      setSuccess(true);
    }, 900);
  };

  const addImage = () => { if (imageCount < 6) setImageCount(n => n + 1); };
  const removeImage = idx => { if (imageCount > 0) setImageCount(n => n - 1); };

  // ── Success screen ──
  if (success) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconsSVG name="check" size={30} className="text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Anunț publicat!</h2>
      <p className="text-sm text-gray-500 mb-7">Anunțul tău este acum vizibil pentru toți utilizatorii.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate("home")} className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
          Vezi anunțuri
        </button>
        <button
          onClick={() => { setSuccess(false); setForm({ title:"", category:"", price:"", city:"", description:"" }); setImageCount(0); }}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Publică alt anunț
        </button>
      </div>
    </div>
  );

  // ── Form ──
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 group transition-colors">
          <IconsSVG name="arrow-left" size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Înapoi
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Publică anunț</h1>
        <p className="text-sm text-gray-500 mt-1">Completează detaliile anunțului tău.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Section 1: Info de bază ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <SectionHeader n={1} label="Informații de bază" />

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titlu anunț <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="ex. iPhone 14 Pro, stare perfectă"
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? <p className="text-xs text-red-500">{errors.title}</p> : <span />}
              <span className="text-xs text-gray-400">{form.title.length}/100</span>
            </div>
          </div>

          {/* Category + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categorie <span className="text-red-400">*</span></label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${errors.category ? "border-red-300" : "border-gray-200"}`}
              >
                <option value="">Selectează...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Oraș <span className="text-red-400">*</span></label>
              <select
                value={form.city}
                onChange={e => set("city", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${errors.city ? "border-red-300" : "border-gray-200"}`}
              >
                <option value="">Selectează...</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preț <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type="number"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 pr-16 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.price ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">RON</span>
            </div>
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* ── Section 2: Descriere ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <SectionHeader n={2} label="Descriere" />
          <textarea
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Descrie produsul: stare, caracteristici, motiv vânzare..."
            rows={6}
            maxLength={2000}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200"}`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
            <span className="text-xs text-gray-400">{form.description.length}/2000</span>
          </div>
        </div>

        {/* ── Section 3: Fotografii ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <SectionHeader n={3} label="Fotografii" />

          {/* Dropzone */}
          <div
            onClick={addImage}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addImage(); }}
            onDragOver={e => e.preventDefault()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors select-none ${dragging ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"}`}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <IconsSVG name="upload" size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Trage fotografiile aici sau <span className="text-green-600">selectează</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 6 fotografii · 10 MB/fișier</p>
          </div>

          {/* Previews */}
          {imageCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <IconsSVG name="image" size={22} className="text-gray-400" />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-center text-xs py-0.5 rounded-b-xl font-medium">
                      Principală
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removeImage(i); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm"
                  >
                    <IconsSVG name="x" size={10} />
                  </button>
                </div>
              ))}
              {imageCount < 6 && (
                <button type="button" onClick={addImage} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-green-400 transition-colors">
                  <IconsSVG name="plus" size={22} className="text-gray-400" />
                </button>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">{imageCount}/6 fotografii adăugate</p>
        </div>

        {/* ── Buttons ── */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => navigate("home")} className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Anulează
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Se publică...</>
              : <><IconsSVG name="check" size={15} />Publică anunțul</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionHeader({ n, label }) {
  return (
    <h2 className="flex items-center gap-2.5 font-semibold text-gray-900 mb-5">
      <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
      {label}
    </h2>
  );
}

window.CreateListing = CreateListing;
