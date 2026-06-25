import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBestHotelOfferForPlace, getPlaceOffer } from "../data/offers";

/* ─── data ──────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    bg: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1800&q=85",
    place: "Rameswaram", state: "Tamil Nadu", tag: "Pilgrimage",
    sub: "Walk the grand corridors of Ramanathaswamy Temple at dawn",
    color: "#f59e0b",
  },
  {
    bg: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1800&q=85",
    place: "Ooty", state: "Tamil Nadu", tag: "Hill Station",
    sub: "Misty tea gardens, Nilgiri Mountain Railway & cool mountain air",
    color: "#10b981",
  },
  {
    bg: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1800&q=85",
    place: "Alleppey", state: "Kerala", tag: "Backwaters",
    sub: "Float through emerald canals on a traditional Kerala houseboat",
    color: "#06b6d4",
  },
  {
    bg: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=85",
    place: "Coorg", state: "Karnataka", tag: "Hill Station",
    sub: "Coffee estates, misty valleys & waterfalls of the Western Ghats",
    color: "#22c55e",
  },
];

const DESTINATIONS = [
  { id:1,  name:"Ooty",        state:"Tamil Nadu", price:3500, rating:4.7, tag:"Hill Station",  img:"/Ooty 🍁.jfif" },
  { id:6,  name:"Alleppey",    state:"Kerala",     price:5500, rating:4.7, tag:"Backwaters",    img:"/Ashtamudi lake, Kerala.jfif" },
  { id:9,  name:"Pondicherry", state:"Tamil Nadu", price:2500, rating:4.5, tag:"Beach",         img:"/Top 10 Places To Visit In Pondicherry Of Tamil Nadu This Winter.jfif" },
  { id:8,  name:"Coorg",       state:"Karnataka",  price:5000, rating:4.8, tag:"Hill Station",  img:"/Coorg.jfif" },
  { id:4,  name:"Munnar",      state:"Kerala",     price:4200, rating:4.6, tag:"Hill Station",  img:"/munnar.jfif" },
  { id:11, name:"Madurai",     state:"Tamil Nadu", price:1200, rating:4.7, tag:"Pilgrimage",    img:"/download.jfif" },
  { id:10, name:"Wayanad",     state:"Kerala",     price:3800, rating:4.6, tag:"Wildlife",      img:"/10 Breathtaking Hill Stations Around Wayanad.jfif" },
  { id:12, name:"Varkala",     state:"Kerala",     price:3000, rating:4.4, tag:"Beach",         img:"/Varkala Cliff.jfif" },
];

const TAG_COLORS = {
  "Hill Station": "bg-emerald-100 text-emerald-700",
  "Backwaters":   "bg-cyan-100 text-cyan-700",
  "Beach":        "bg-blue-100 text-blue-700",
  "Pilgrimage":   "bg-amber-100 text-amber-700",
  "Wildlife":     "bg-green-100 text-green-700",
};

const WHYS = [
  { icon:"🤖", title:"AI Trip Planner",  desc:"Enter budget + days → get a complete day-by-day itinerary, hotel picks & food spots instantly.", link:"/planner",  accent:"from-violet-500 to-indigo-600" },
  { icon:"🎬", title:"Reels Feed",       desc:"Swipe through short travel videos. Like what you see? Book that destination in one tap.",          link:"/feed",     accent:"from-rose-500 to-pink-600" },
  { icon:"🏨", title:"Stay & Eat",       desc:"Every destination comes with curated nearby hotels and restaurants — filtered by budget & style.", link:"/explore",  accent:"from-amber-500 to-orange-500" },
  { icon:"🚂", title:"Travel Guide",     desc:"Train, bus, cab or flight — routes, costs, booking links & insider tips for every journey.",       link:"/travel",   accent:"from-sky-500 to-blue-600" },
];

const EXPERIENCES = [
  { emoji:"🛕", label:"Temple Trails",  filter:"Pilgrimage",  count:"12 pilgrimages" },
  { emoji:"🏔️", label:"Hill Escapes",  filter:"Hill Station", count:"8 hill stations" },
  { emoji:"🌊", label:"Coastal Drives", filter:"Beach",        count:"6 beach towns" },
  { emoji:"🌿", label:"Nature Stays",   filter:"Wildlife",     count:"5 wildlife spots" },
  { emoji:"🚤", label:"Backwaters",     filter:"Backwaters",   count:"Kerala & TN" },
  { emoji:"🏛️", label:"Heritage Sites",filter:"Heritage",     count:"Ancient wonders" },
];

/* ─── component ─────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, user, role } = useAuth();
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");
  const [entered, setEntered] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?search=${encodeURIComponent(search.trim())}`);
    else navigate("/explore");
  };

  const s = SLIDES[slide];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-viewport image slider
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] max-h-[900px] overflow-hidden">

        {SLIDES.map((sl, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}>
            <img src={sl.bg} alt={sl.place} className="w-full h-full object-cover"
              style={{ transform: i === slide ? "scale(1.04)" : "scale(1)", transition: "transform 7s ease" }}/>
          </div>
        ))}

        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)" }}/>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)" }}/>

        <div className="absolute inset-0 flex items-end pb-20 px-6 md:px-14"
          style={{ opacity: entered ? 1 : 0, transform: entered ? "none" : "translateY(24px)", transition: "all 1s ease" }}>
          <div className="w-full max-w-5xl mx-auto">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-white"
                  style={{ backgroundColor: s.color }}>
                  {s.tag}
                </span>
                <span className="text-white/50 text-sm">📍 {s.state}</span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter mb-3"
                style={{ textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}>
                {s.place}
              </h1>

              <p className="text-white/75 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
                {s.sub}
              </p>

              <form onSubmit={onSearch} className="flex gap-3 max-w-xl">
                <div className="flex-1 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-2xl ring-1 ring-white/20">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                  </svg>
                  <input
                    ref={searchRef}
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="flex-1 outline-none text-gray-800 bg-transparent text-sm placeholder-gray-400"
                  />
                </div>
                <button type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black px-7 py-4 rounded-2xl shadow-xl transition-all text-sm whitespace-nowrap">
                  Search →
                </button>
              </form>

              <div className="flex gap-2 mt-5 flex-wrap">
                {["Ooty","Alleppey","Coorg","Pondicherry","Madurai"].map(tag => (
                  <button key={tag}
                    onClick={() => navigate(`/explore?search=${tag}`)}
                    className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm bg-white/5">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROLE BANNER
      ══════════════════════════════════════════════════════════════ */}
      {isLoggedIn && role === "seller" ? (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-black text-sm">Welcome back, {user?.name?.split(" ")[0]}! 👋</p>
              <p className="text-amber-100 text-xs">You're logged in as a Seller. Manage your listings from the dashboard.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => navigate("/seller/listings")}
                className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate("/seller/add/place")}
                className="text-xs font-black bg-white text-amber-700 px-4 py-2 rounded-xl hover:shadow-lg transition-all">
                + Add Listing
              </button>
            </div>
          </div>
        </div>
      ) : isLoggedIn ? (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <p className="text-white text-sm">
              <span className="font-black">Hey {user?.name?.split(" ")[0]}!</span>
              <span className="text-emerald-100 ml-2">Ready to plan your next trip?</span>
            </p>
            <button onClick={() => navigate("/planner")}
              className="text-xs font-black bg-white text-emerald-700 px-5 py-2 rounded-xl hover:shadow-lg transition-all flex-shrink-0">
              ✨ Open AI Planner
            </button>
          </div>
        </div>
      ) : null}

      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ══════════════════════════════════════════════════════════════
            EXPERIENCE TYPES
        ══════════════════════════════════════════════════════════════ */}
        <section className="pt-14 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Browse by type</p>
              <h2 className="text-2xl font-black text-gray-900">What kind of trip?</h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {EXPERIENCES.map(ex => (
              <button key={ex.label}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(ex.filter)}`)}
                className="flex-shrink-0 flex flex-col items-center gap-2 bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md rounded-2xl px-6 py-4 transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">{ex.emoji}</span>
                <p className="text-sm font-bold text-gray-800 whitespace-nowrap">{ex.label}</p>
                <p className="text-[11px] text-gray-400">{ex.count}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FEATURED DESTINATIONS
        ══════════════════════════════════════════════════════════════ */}
        <section className="pb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-3xl font-black text-gray-900">Top Destinations</h2>
            </div>
            <button onClick={() => navigate("/explore")}
              className="text-sm font-bold text-gray-400 hover:text-emerald-600 flex items-center gap-1 transition-colors">
              All places
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DestCard d={DESTINATIONS[0]} big navigate={navigate}/>
            {DESTINATIONS.slice(1, 5).map(d => (
              <DestCard key={d.id} d={d} navigate={navigate}/>
            ))}
            <div className="col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-0">
              {DESTINATIONS.slice(5, 8).map(d => (
                <DestCard key={d.id} d={d} wide navigate={navigate}/>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            WHY WANDERTAMIL
        ══════════════════════════════════════════════════════════════ */}
        <section className="pb-14">
          <div className="text-center mb-10">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Everything you need</p>
            <h2 className="text-3xl font-black text-gray-900">Why WanderIndia?</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">One platform to discover, plan, book, and explore South India like never before.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHYS.map(w => (
              <button key={w.title} onClick={() => navigate(w.link)}
                className="group text-left bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${w.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}/>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${w.accent} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {w.icon}
                </div>
                <h3 className="font-black text-gray-900 text-base mb-2">{w.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{w.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-gray-400 group-hover:text-emerald-600 transition-colors">
                  Explore
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SELLER SECTION
        ══════════════════════════════════════════════════════════════ */}
        <section className="pb-14">
          <div className="rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"/>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=60)", backgroundSize: "cover", backgroundPosition: "center" }}/>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"/>
            <div className="relative px-8 md:px-14 py-14 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                  For Business Owners
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  Grow your<br/><span className="text-amber-400">tourism</span><br/>business.
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-sm">
                  Join thousands of hotels, restaurants, and travel guides already listed on WanderTamil. Reach travellers searching for exactly what you offer.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => navigate(isLoggedIn && role === "seller" ? "/seller/listings" : "/seller/add/place")}
                    className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-black px-7 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 text-sm">
                    {isLoggedIn && role === "seller" ? "Open Dashboard →" : "List for Free →"}
                  </button>
                  <button onClick={() => navigate("/explore")}
                    className="border border-white/20 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-2xl transition-all text-sm">
                    See Live Listings
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon:"📍", t:"Add Places",      d:"List any destination or attraction" },
                  { icon:"🏨", t:"Add Hotels",      d:"Showcase rooms with booking" },
                  { icon:"🍽️", t:"Add Restaurants", d:"Get found by hungry travellers" },
                  { icon:"🎬", t:"Upload Reels",    d:"Short videos that convert" },
                ].map(item => (
                  <div key={item.t}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 transition-colors cursor-pointer group"
                    onClick={() => navigate(isLoggedIn && role === "seller" ? `/seller/add/${item.t.split(" ")[1].toLowerCase()}` : "/seller/add/place")}>
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{item.icon}</span>
                    <p className="text-white text-xs font-black mb-0.5">{item.t}</p>
                    <p className="text-gray-500 text-[11px]">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════════════════════════ */}
        <section className="pb-14">
          <div className="bg-emerald-600 rounded-3xl px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val:"12+",   lab:"Destinations" },
              { val:"3",     lab:"States Covered" },
              { val:"50+",   lab:"Hotels Listed" },
              { val:"1000+", lab:"Happy Travellers" },
            ].map(s => (
              <div key={s.lab}>
                <p className="text-4xl font-black text-white">{s.val}</p>
                <p className="text-emerald-200 text-sm mt-1">{s.lab}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER CTA
        ══════════════════════════════════════════════════════════════ */}
        <section className="pb-16 text-center">
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">Start your journey</p>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
            India is<br/>
            <span className="text-gradient">waiting for you.</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            From misty hill stations to ancient temples, backwater houseboats to cliff-top beaches — your perfect trip is a click away.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate("/explore")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95">
              Explore Destinations
            </button>
            <button onClick={() => navigate("/planner")}
              className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95">
              ✨ Plan with AI
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ─── DestCard ───────────────────────────────────────────────────────── */
function DestCard({ d, big, wide, navigate }) {
  const [imgErr, setImgErr] = useState(false);

  // ── Offer detection ──────────────────────────────────────────────────
  const placeOffer = getPlaceOffer(d.id);
  const hotelOffer = getBestHotelOfferForPlace(d.id);
  const hasOffer   = placeOffer || hotelOffer;

  const h = big ? "h-[420px] md:h-full col-span-2 row-span-2" : wide ? "h-48" : "h-52 md:h-56";

  return (
    <div
      onClick={() => navigate(`/place/${d.id}`)}
      className={`relative ${h} rounded-2xl overflow-hidden cursor-pointer group lift`}
    >
      <img
        src={imgErr ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" : d.img}
        alt={d.name} onError={() => setImgErr(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"/>

      {/* Category tag — top left */}
      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${TAG_COLORS[d.tag] || "bg-gray-100 text-gray-700"}`}>
          {d.tag}
        </span>
      </div>

      {/* ── Offer badges — top right ─────────────────────────────────── */}
      {hasOffer && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {placeOffer && (
            <span className={`${placeOffer.badgeColor} text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg`}>
              {placeOffer.badge}
            </span>
          )}
          {hotelOffer && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
              🏷️ {hotelOffer.discount}% off stay
            </span>
          )}
        </div>
      )}

      {/* Info — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white/60 text-[11px] mb-0.5 flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" strokeLinecap="round"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {d.state}
        </p>
        <div className="flex items-end justify-between">
          <h3 className={`text-white font-black leading-none ${big ? "text-3xl" : "text-lg"}`}>{d.name}</h3>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-emerald-400 text-sm font-black">₹{d.price.toLocaleString()}</p>
            <p className="text-white/50 text-[10px]">★ {d.rating}</p>
          </div>
        </div>
        {big && (
          <button className="mt-3 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-white/10">
            Explore →
          </button>
        )}

        {/* ── Offer strip at bottom of card ────────────────────────── */}
        {hasOffer && (
          <div
            className="mt-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center justify-between gap-2"
            onClick={e => { e.stopPropagation(); navigate("/offers"); }}
          >
            <p className="text-[10px] text-white font-bold truncate">
              {placeOffer
                ? `${placeOffer.badge} — ${placeOffer.name}`
                : `🏨 ${hotelOffer.discount}% off · ${hotelOffer.hotel}`
              }
            </p>
            <span className="text-[10px] text-emerald-300 font-black whitespace-nowrap flex-shrink-0">
              See offer →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}