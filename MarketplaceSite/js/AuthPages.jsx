// ============================================================
// AuthPages — Login + Register tabs
// ============================================================

function AuthPages({ navigate, onLogin }) {
  const [tab, setTab] = React.useState("login");
  const [login, setLogin] = React.useState({ email: "", password: "" });
  const [reg, setReg]     = React.useState({ name: "", email: "", password: "", confirm: "" });
  const [loginErr, setLoginErr]   = React.useState({});
  const [regErr, setRegErr]       = React.useState({});
  const [loginLoading, setLoginLoading]   = React.useState(false);
  const [regLoading, setRegLoading]       = React.useState(false);

  const setL = (k, v) => { setLogin(f => ({...f, [k]: v})); setLoginErr(e => ({...e, [k]: ""})); };
  const setR = (k, v) => { setReg(f => ({...f, [k]: v})); setRegErr(e => ({...e, [k]: ""})); };

  const handleLogin = ev => {
    ev.preventDefault();
    const e = {};
    if (!login.email.trim())    e.email    = "Câmp obligatoriu";
    if (!login.password)        e.password = "Câmp obligatoriu";
    if (Object.keys(e).length) { setLoginErr(e); return; }
    setLoginLoading(true);
    setTimeout(() => {
      onLogin(login.email.toLowerCase().includes("admin") ? ADMIN_USER : DEFAULT_USER);
      setLoginLoading(false);
      navigate("home");
    }, 700);
  };

  const handleRegister = ev => {
    ev.preventDefault();
    const e = {};
    if (!reg.name.trim())                    e.name    = "Câmp obligatoriu";
    if (!reg.email.includes("@"))            e.email   = "Email invalid";
    if (reg.password.length < 6)             e.password = "Minim 6 caractere";
    if (reg.password !== reg.confirm)        e.confirm = "Parolele nu coincid";
    if (Object.keys(e).length) { setRegErr(e); return; }
    setRegLoading(true);
    setTimeout(() => {
      onLogin({ ...DEFAULT_USER, name: reg.name, email: reg.email });
      setRegLoading(false);
      navigate("home");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <IconsSVG name="home" size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">Cumpără și vinde simplu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Tabs */}
          <div className="flex">
            {[["login","Autentificare"],["register","Înregistrare"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === id
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Login form ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <AuthField
                label="Email" type="email" icon="at-sign"
                value={login.email} onChange={v => setL("email", v)}
                placeholder="email@exemplu.com" error={loginErr.email}
              />
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Parolă</label>
                  <button type="button" className="text-xs text-green-600 hover:text-green-700 font-semibold">Ai uitat?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <IconsSVG name="lock" size={15} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={login.password}
                    onChange={e => setL("password", e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${loginErr.password ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  />
                </div>
                {loginErr.password && <p className="text-xs text-red-500 mt-1">{loginErr.password}</p>}
              </div>

              {/* Demo hint */}
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1 border border-gray-100">
                <p><span className="font-semibold">Demo user:</span> orice email + parolă</p>
                <p><span className="font-semibold">Demo admin:</span> email cu "admin" + parolă</p>
              </div>

              <SubmitBtn loading={loginLoading} label="Autentifică-te" loadingLabel="Se autentifică..." />

              <p className="text-center text-xs text-gray-500">
                Nu ai cont?{" "}
                <button type="button" onClick={() => setTab("register")} className="text-green-600 font-semibold hover:text-green-700">
                  Înregistrează-te
                </button>
              </p>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <AuthField
                label="Nume complet" type="text" icon="user"
                value={reg.name} onChange={v => setR("name", v)}
                placeholder="Ion Popescu" error={regErr.name}
              />
              <AuthField
                label="Email" type="email" icon="at-sign"
                value={reg.email} onChange={v => setR("email", v)}
                placeholder="email@exemplu.com" error={regErr.email}
              />
              <AuthField
                label="Parolă" type="password" icon="lock"
                value={reg.password} onChange={v => setR("password", v)}
                placeholder="Minim 6 caractere" error={regErr.password}
              />
              <AuthField
                label="Confirmă parola" type="password" icon="lock"
                value={reg.confirm} onChange={v => setR("confirm", v)}
                placeholder="Repetă parola" error={regErr.confirm}
              />

              <SubmitBtn loading={regLoading} label="Creează cont" loadingLabel="Se înregistrează..." />

              <p className="text-center text-xs text-gray-500">
                Ai deja cont?{" "}
                <button type="button" onClick={() => setTab("login")} className="text-green-600 font-semibold hover:text-green-700">
                  Autentifică-te
                </button>
              </p>
              <p className="text-center text-xs text-gray-400">
                Prin înregistrare ești de acord cu{" "}
                <span className="text-green-600 cursor-pointer">Termenii de utilizare</span>
              </p>
            </form>
          )}
        </div>

        <button
          onClick={() => navigate("home")}
          className="w-full mt-5 text-sm text-gray-500 hover:text-gray-700 text-center transition-colors"
        >
          ← Înapoi la anunțuri
        </button>
      </div>
    </div>
  );
}

// ── Small reusable sub-components ──
function AuthField({ label, type, icon, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <IconsSVG name={icon} size={15} className="text-gray-400" />
        </div>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SubmitBtn({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
    >
      {loading
        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{loadingLabel}</>
        : label
      }
    </button>
  );
}

window.AuthPages = AuthPages;
