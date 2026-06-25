import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const userLinks = [
  { label: "Home",    path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Stays",   path: "/stays" },
  { label: "Dining",  path: "/dining" },
  { label: "Feed",    path: "/feed" },
  { label: "Planner", path: "/planner" },
  { label: "Travel",  path: "/travel" },
  { label: "Offers",  path: "/offers" },
];

const sellerLinks = [
  { label: "Dashboard", path: "/" },
  { label: "Listings",  path: "/seller/listings" },
  { label: "Add Place", path: "/seller/add/place" },
  { label: "Add Hotel", path: "/seller/add/hotel" },
  { label: "Add Reel",  path: "/seller/add/reel" },
  { label: "Offers",    path: "/offers" },
];

const adminLinks = [
  { label: "Home",      path: "/" },
  { label: "Admin Console", path: "/admin" },
  { label: "Explore",   path: "/explore" },
  { label: "Stays",     path: "/stays" },
  { label: "Dining",    path: "/dining" },
  { label: "Offers",    path: "/offers" },
];

export default function Navbar() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [showAuth,      setShowAuth]      = useState(false);
  const [isLogin,       setIsLogin]       = useState(true);
  const [selectedRole,  setSelectedRole]  = useState("user");
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [authError,     setAuthError]     = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const { pathname, search } = useLocation();
  const navigate  = useNavigate();
  const { user, login, register, logout, isLoggedIn, role } = useAuth();
  const profileRef = useRef(null);
  const navLinks   = role === "admin" ? adminLinks : (role === "seller" ? sellerLinks : userLinks);

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("auth") === "seller") {
      setIsLogin(false); setSelectedRole("seller"); setShowAuth(true);
      navigate(pathname, { replace: true });
    }
  }, [search, navigate, pathname]);

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const validateForm = () => {
    const errors = {};

    // Name validation (signup only)
    if (!isLogin) {
      if (!form.name.trim()) {
        errors.name = "Full name is required.";
      } else if (form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
      } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
        errors.name = "Name should only contain letters and spaces.";
      }
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      errors.email = "Please enter a valid email (e.g. name@gmail.com).";
    }

    // Phone validation (signup only — optional but if filled must be valid)
    if (!isLogin && form.phone.trim()) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(form.phone.replace(/\s|\-|\+91/g, ""))) {
        errors.phone = "Enter a valid 10-digit Indian mobile number (starts with 6–9).";
      }
    }

    // Password validation
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      errors.password = "Password must contain at least one letter and one number.";
    }

    return errors;
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (isLogin) {
        await login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
      } else {
        await register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: selectedRole,
        });
      }
      setShowAuth(false);
      setForm({ name: "", email: "", phone: "", password: "" });
      setFieldErrors({});
      navigate(selectedRole === "seller" ? "/seller/listings" : "/profile");
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please try again.");
    }
  };


  const handleLogout = () => { logout(); setProfileOpen(false); navigate("/"); };
  const openAuth = (loginMode, r = "user") => { setIsLogin(loginMode); setSelectedRole(r); setAuthError(""); setShowAuth(true); };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" strokeLinecap="round"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">
              Wander<span className="text-emerald-500">India</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide justify-center">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  pathname === link.path ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-colors">
                  <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full object-cover"/>
                  <span className="text-sm font-semibold text-gray-700">{user?.name?.split(" ")[0]}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    role === "admin" ? "bg-purple-100 text-purple-700" : (role === "seller" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")
                  }`}>{role}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeLinecap="round"/></svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { to: "/profile", icon: "👤", label: "My Profile" },
                        ...(role === "admin" ? [{ to: "/admin", icon: "🛠️", label: "Admin Console" }] : []),
                        ...(role === "seller" ? [{ to: "/seller/listings", icon: "🏨", label: "My Listings" }] : []),
                        ...(role !== "seller" && role !== "admin" ? [{ to: "/saved", icon: "❤️", label: "Saved Places" }] : []),
                        { to: "/planner", icon: "✨", label: "Trip Planner" },
                        { to: "/offers",  icon: "🎁", label: "Offers & Deals" },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <span>{item.icon}</span>{item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1">
                        <span>🚪</span>Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => openAuth(true)} className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">Login</button>
                <button onClick={() => openAuth(false)} className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-sm transition-colors">Sign Up</button>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/> : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 border-t border-gray-100 bg-white space-y-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === link.path ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm font-medium border border-gray-200 rounded-xl">Profile</Link>
                  <button onClick={handleLogout} className="flex-1 py-2 text-sm font-bold bg-red-500 text-white rounded-xl">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { openAuth(true); setMenuOpen(false); }} className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-xl">Login</button>
                  <button onClick={() => { openAuth(false); setMenuOpen(false); }} className="flex-1 py-2 text-sm font-bold bg-emerald-500 text-white rounded-xl">Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── AUTH MODAL ─────────────────────────────────────────────── */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuth(false)}/>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500"/>
            <div className="p-7">
              <button onClick={() => setShowAuth(false)}
                className="absolute top-5 right-5 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{isLogin ? "Welcome back 👋" : "Join WanderTamil 🌿"}</h2>
              <p className="text-gray-400 text-sm mb-5">{isLogin ? "Sign in to your account." : "Create your free account today."}</p>

              {/* Role toggle */}
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-5 gap-1">
                {[["user","🧳 Tourist"],["seller","🏨 Seller / Host"]].map(([r, label]) => (
                  <button key={r} type="button" onClick={() => setSelectedRole(r)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${selectedRole === r ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                    {label}
                  </button>
                ))}
              </div>


              <form onSubmit={handleManualAuth} className="space-y-3">
                {!isLogin && (
                  <div>
                    <input type="text" placeholder="Full Name *" value={form.name}
                      onChange={e => { setForm({ ...form, name: e.target.value }); setFieldErrors(p => ({ ...p, name: "" })); }}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm outline-none transition-all ${fieldErrors.name ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-emerald-300"}`}/>
                    {fieldErrors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{fieldErrors.name}</p>}
                  </div>
                )}

                <div>
                  <input type="text" placeholder="Email Address *" value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setFieldErrors(p => ({ ...p, email: "" })); }}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm outline-none transition-all ${fieldErrors.email ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-emerald-300"}`}/>
                  {fieldErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{fieldErrors.email}</p>}
                </div>

                {!isLogin && (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">+91</span>
                      <input type="tel" placeholder="Phone Number (optional)" value={form.phone}
                        onChange={e => { setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }); setFieldErrors(p => ({ ...p, phone: "" })); }}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border text-sm outline-none transition-all ${fieldErrors.phone ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-emerald-300"}`}/>
                    </div>
                    {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{fieldErrors.phone}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">10-digit Indian number starting with 6, 7, 8 or 9</p>
                  </div>
                )}

                <div>
                  <input type="password" placeholder="Password *" value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setFieldErrors(p => ({ ...p, password: "" })); }}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm outline-none transition-all ${fieldErrors.password ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-emerald-300"}`}/>
                  {fieldErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{fieldErrors.password}</p>}
                  {!isLogin && !fieldErrors.password && <p className="text-[10px] text-gray-400 mt-1">Min 6 characters with at least one letter and one number</p>}
                </div>

                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 font-medium">⚠️ {authError}</div>
                )}

                <button type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => { setIsLogin(!isLogin); setAuthError(""); setFieldErrors({}); setForm({ name: "", email: "", phone: "", password: "" }); }}
                  className="text-sm font-medium text-emerald-600 hover:underline">
                  {isLogin ? "No account? Sign Up" : "Already have an account? Login"}
                </button>
              </div>

              {selectedRole === "user" && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between gap-3">
                  <p className="text-xs text-amber-700">Own a hotel or restaurant?</p>
                  <button onClick={() => setSelectedRole("seller")} className="text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0">
                    Join as Seller →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}