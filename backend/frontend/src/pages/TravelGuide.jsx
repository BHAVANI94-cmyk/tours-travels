import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Transport data ─────────────────────────────────────────── */
const MODES = [
  {
    id:"train", icon:"🚂", name:"Train", tagline:"Best for long distances",
    color:"blue", bookUrl:"https://www.irctc.co.in",
    costPerKm: 0.5,
    pros:["Very affordable","Overnight sleeper saves hotel cost","Scenic routes","Luggage-friendly"],
    cons:["Book 30-60 days early","Can be delayed","Not every town has station"],
    tips:["Use IRCTC app","Prefer AC 3-Tier for value","Download ticket offline","Arrive 20 min early"],
    routes:["Chennai → Ooty (Nilgiri Toy Train)","Chennai → Madurai Intercity","Chennai → Rameswaram Express"],
  },
  {
    id:"bus", icon:"🚌", name:"Bus", tagline:"Flexible — reaches everywhere",
    color:"green", bookUrl:"https://www.redbus.in",
    costPerKm: 0.8,
    pros:["Reaches hill stations trains can't","TNSTC/KSRTC reliable & cheap","Night buses save hotel night","Frequent departures"],
    cons:["Slower than train","Winding hill routes","AC buses cost more"],
    tips:["Book via Redbus","Choose 'Ultra Deluxe'","Carry motion sickness tablets for hills","Confirm last bus timing"],
    routes:["Chennai → Pondicherry (2 hrs)","Coimbatore → Ooty (3 hrs)","Madurai → Rameswaram (4 hrs)"],
  },
  {
    id:"cab", icon:"🚗", name:"Cab / Self Drive", tagline:"Most flexible — go anywhere",
    color:"amber", bookUrl:"https://www.olacabs.com",
    costPerKm: 14,
    pros:["Door to door","Stop anywhere","Great for families","Reach remote spots"],
    cons:["Fuel costs add up","Parking hard in cities","Hilly roads need experience"],
    tips:["Use Ola/Uber for city cabs","Rent via Zoomcar for self-drive","Download offline maps","Fill fuel before hill climbs"],
    routes:["Coorg Coffee Trail loop","Munnar–Thekkady scenic route","East Coast Road Chennai→Pondy"],
  },
  {
    id:"flight", icon:"✈️", name:"Flight", tagline:"Fastest — save 8+ hours",
    color:"sky", bookUrl:"https://www.makemytrip.com/flights",
    costPerKm: 5,
    pros:["Saves 8-10 hours vs train","Budget airlines cheap if booked early","Best for Kerala destinations","IndiGo/SpiceJet have good deals"],
    cons:["Airport transfer adds time","Luggage restrictions","No scenic views"],
    tips:["Book 6-8 weeks early","Set fare alerts on Google Flights","Use Chennai/Coimbatore/Madurai airports","Compare on Skyscanner"],
    routes:["Chennai → Kochi (1 hr)","Chennai → Trivandrum (1.5 hrs)","Coimbatore → Bangalore (1 hr)"],
  },
  {
    id:"bike", icon:"🏍️", name:"Bike / Scooter", tagline:"Most adventurous option",
    color:"orange", bookUrl:"https://www.royalenfield.com",
    costPerKm: 2.5,
    pros:["Total freedom","Cheapest fuel cost","Access remote roads","Feel the journey fully"],
    cons:["Physically tiring","Weather-dependent","Risky on mountain bends","Limited luggage"],
    tips:["Rent locally near bus stands","Always wear helmet","Start early to avoid traffic","Carry raincoat always"],
    routes:["Ooty–Kodaikanal scenic ride","Coorg plantation loops","Varkala cliff road"],
  },
  {
    id:"auto", icon:"🛺", name:"Auto / Local", tagline:"Best within city",
    color:"pink", bookUrl:"https://www.rapido.bike",
    costPerKm: 12,
    pros:["Cheap for short trips","Rapido/Namma Yatri for fair price","Reaches narrow lanes","Cultural experience"],
    cons:["No AC","Meter disputes in some cities","Not for long distance"],
    tips:["Use Rapido app for fair pricing","Agree fare before boarding","Share autos available in small towns","₹15-20/km is fair"],
    routes:["Temple to temple in Madurai","Market hopping in Coimbatore","Beach hops in Pondicherry"],
  },
];

const COLOR_MAP = {
  blue:   { bg:"bg-blue-50",   border:"border-blue-200",  badge:"bg-blue-100 text-blue-800",   btn:"bg-blue-600 hover:bg-blue-700",   tab:"bg-blue-600",   ring:"ring-blue-300" },
  green:  { bg:"bg-green-50",  border:"border-green-200", badge:"bg-green-100 text-green-800",  btn:"bg-green-600 hover:bg-green-700", tab:"bg-green-600",  ring:"ring-green-300" },
  amber:  { bg:"bg-amber-50",  border:"border-amber-200", badge:"bg-amber-100 text-amber-800",  btn:"bg-amber-600 hover:bg-amber-700", tab:"bg-amber-600",  ring:"ring-amber-300" },
  sky:    { bg:"bg-sky-50",    border:"border-sky-200",   badge:"bg-sky-100 text-sky-800",      btn:"bg-sky-600 hover:bg-sky-700",     tab:"bg-sky-600",    ring:"ring-sky-300" },
  orange: { bg:"bg-orange-50", border:"border-orange-200",badge:"bg-orange-100 text-orange-800",btn:"bg-orange-600 hover:bg-orange-700",tab:"bg-orange-600",ring:"ring-orange-300" },
  pink:   { bg:"bg-pink-50",   border:"border-pink-200",  badge:"bg-pink-100 text-pink-800",    btn:"bg-pink-600 hover:bg-pink-700",   tab:"bg-pink-600",   ring:"ring-pink-300" },
};

const CITIES = [
  "Chennai","Coimbatore","Madurai","Trichy","Salem","Tirunelveli",
  "Ooty","Kodaikanal","Pondicherry","Rameswaram","Mahabalipuram","Yercaud",
  "Kochi","Munnar","Alleppey","Wayanad","Thrissur","Kozhikode",
  "Bangalore","Coorg","Mysore","Hampi",
];

const DISTANCE_TABLE = [
  ["Pondicherry",   "Chennai",  150,  "bus",    "2.5 hrs",  "₹120–300"],
  ["Mahabalipuram", "Chennai",   60,  "cab",    "1.5 hrs",  "₹800–1200"],
  ["Ooty",          "Chennai",  540,  "train",  "8–10 hrs", "₹250–600"],
  ["Kodaikanal",    "Chennai",  460,  "bus",    "8 hrs",    "₹400–700"],
  ["Madurai",       "Chennai",  460,  "train",  "5 hrs",    "₹200–500"],
  ["Rameswaram",    "Chennai",  570,  "train",  "8 hrs",    "₹220–550"],
  ["Munnar",        "Kochi",    130,  "cab",    "3.5 hrs",  "₹1500–2000"],
  ["Alleppey",      "Kochi",     55,  "cab",    "1.5 hrs",  "₹700–1000"],
  ["Coorg",         "Bangalore",265,  "cab",    "5 hrs",    "₹3000–4000"],
  ["Wayanad",       "Kozhikode", 75,  "bus",    "2 hrs",    "₹150–250"],
];

const TIPS = [
  { icon:"🌧️", title:"Best Season",    tip:"Oct–Feb is ideal for most of South India. Avoid Jun–Aug for hills (monsoon). Northeast monsoon hits Chennai coast Oct–Dec." },
  { icon:"💊", title:"Health Kit",      tip:"Carry ORS, basic medicines, SPF 50+ sunscreen. Bottled water only in rural areas. Mosquito repellent for backwaters." },
  { icon:"💰", title:"Money Tips",      tip:"ATMs common in towns, rare in villages. Carry ₹2000–3000 cash when heading to small places. GPay/PhonePe accepted almost everywhere." },
  { icon:"📱", title:"Must-Have Apps",  tip:"Google Maps (download offline), IRCTC, Rapido, Redbus, Zomato, MakeMyTrip. Download area maps before leaving WiFi." },
  { icon:"👘", title:"Temple Dress",    tip:"Cover shoulders and knees. Men may remove shirts at some TN temples. Carry a dupatta/dhoti. Most temples give wrap-arounds at entrance." },
  { icon:"🌶️", title:"Food Safety",    tip:"South Indian food generally safe. Try filter coffee, dosas, banana leaf meals. Warn if you can't handle spice — Chettinad is very hot!" },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function TravelGuide() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("train");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedMode, setSelectedMode] = useState("train");
  const [result, setResult] = useState(null);
  const [calcError, setCalcError] = useState("");

  const mode = MODES.find(m => m.id === activeMode);
  const C = COLOR_MAP[mode.color];

  const handleCalc = () => {
    if (!from || !to) { setCalcError("Please select both From and To cities."); return; }
    if (from === to) { setCalcError("From and To cities can't be the same."); return; }
    setCalcError("");

    // Find approximate distance from table or estimate
    const row = DISTANCE_TABLE.find(r =>
      (r[0].toLowerCase() === to.toLowerCase() && r[1].toLowerCase() === from.toLowerCase()) ||
      (r[1].toLowerCase() === to.toLowerCase() && r[0].toLowerCase() === from.toLowerCase())
    );

    const m = MODES.find(m => m.id === selectedMode);
    let dist = row ? row[2] : Math.floor(Math.random() * 400 + 100); // fallback estimate
    let estCost = Math.round(dist * m.costPerKm);
    let estTime = row ? row[4] : `${Math.round(dist / 60)} – ${Math.round(dist / 45)} hrs`;

    // Adjust cost for train/bus (per person flat range)
    if (selectedMode === "train") estCost = Math.round(dist * 0.5);
    if (selectedMode === "bus")   estCost = Math.round(dist * 0.8);
    if (selectedMode === "bike")  estCost = Math.round(dist * 2.5);
    if (selectedMode === "auto")  estCost = dist > 30 ? null : Math.round(dist * 12);

    setResult({ from, to, dist, estCost, estTime, mode: m, bookUrl: m.bookUrl });
  };

  const modeColor = (id) => {
    const m = MODES.find(m => m.id === id);
    const C = COLOR_MAP[m.color];
    return selectedMode === id
      ? `${C.tab} text-white shadow-md`
      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-200 text-xs font-black uppercase tracking-widest mb-2">South India Travel Guide</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">Plan your journey.<br/>Know your costs.</h1>
          <p className="text-emerald-100/80 text-sm max-w-lg">Pick your transport, enter your route — get instant cost estimates and direct booking links.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* ══ COST ESTIMATOR ═══════════════════════════════════════════ */}
        <section>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-7 py-5">
              <h2 className="text-white font-black text-xl">🧮 Travel Cost Estimator</h2>
              <p className="text-gray-400 text-sm mt-0.5">Enter your route and transport — we'll estimate cost and time.</p>
            </div>

            <div className="p-7 space-y-6">
              {/* From / To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">From</label>
                  <select value={from} onChange={e => setFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">To</label>
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                    <option value="">Select destination</option>
                    {CITIES.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Transport mode picker */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Transport Mode</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MODES.map(m => (
                    <button key={m.id} onClick={() => setSelectedMode(m.id)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-bold transition-all ${modeColor(m.id)}`}>
                      <span className="text-xl">{m.icon}</span>
                      {m.name.split(" / ")[0].split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {calcError && <p className="text-red-500 text-sm font-medium">{calcError}</p>}

              <button onClick={handleCalc}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm">
                Calculate Cost & Time →
              </button>

              {/* Result */}
              {result && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{result.mode.icon}</span>
                    <div>
                      <p className="font-black text-gray-800 text-lg">{result.from} → {result.to}</p>
                      <p className="text-gray-500 text-xs">via {result.mode.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                      <p className="text-2xl font-black text-emerald-600">
                        {result.estCost ? `₹${result.estCost.toLocaleString()}` : "N/A"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Est. Cost</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                      <p className="text-2xl font-black text-blue-600">{result.estTime}</p>
                      <p className="text-xs text-gray-400 mt-1">Travel Time</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                      <p className="text-2xl font-black text-gray-700">~{result.dist} km</p>
                      <p className="text-xs text-gray-400 mt-1">Distance</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-800">
                    💡 Cost is an estimate. Actual fare may vary based on class, season, and booking time.
                  </div>

                  <div className="flex gap-3">
                    <a href={result.bookUrl} target="_blank" rel="noreferrer"
                      className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-xl text-sm text-center transition-colors">
                      Book on {result.mode.id === "train" ? "IRCTC" : result.mode.id === "bus" ? "Redbus" : result.mode.id === "flight" ? "MakeMyTrip" : result.mode.id === "bike" ? "Local Rentals" : "Ola"} →
                    </a>
                    <button onClick={() => navigate("/planner")}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-xl text-sm transition-colors">
                      ✨ Plan Full Trip
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══ TRANSPORT GUIDE ══════════════════════════════════════════ */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-1">Transport Guide</h2>
          <p className="text-sm text-gray-400 mb-5">Tap any mode to see detailed tips, routes and booking advice.</p>

          {/* Mode tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {MODES.map(m => {
              const C = COLOR_MAP[m.color];
              return (
                <button key={m.id} onClick={() => setActiveMode(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    activeMode === m.id ? `${C.tab} text-white border-transparent shadow-md` : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}>
                  {m.icon} {m.name.split(" / ")[0]}
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <div className={`${C.bg} border-2 ${C.border} rounded-3xl p-6 shadow-sm`}>
            <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{mode.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-gray-800">{mode.name}</h3>
                  <p className="text-sm text-gray-500">{mode.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Typical cost</p>
                <p className="text-sm font-black text-emerald-700">₹{mode.costPerKm}/km approx</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-5">
              <div>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">✓ Pros</p>
                <ul className="space-y-1.5">
                  {mode.pros.map((p,i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-emerald-500 flex-shrink-0">✓</span>{p}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">! Watch out</p>
                <ul className="space-y-1.5">
                  {mode.cons.map((c,i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-red-400 flex-shrink-0">!</span>{c}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">→ Tips</p>
                <ul className="space-y-1.5">
                  {mode.tips.map((t,i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400 flex-shrink-0">→</span>{t}</li>)}
                </ul>
              </div>
            </div>

            <div className="border-t border-black/10 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {mode.routes.map((r,i) => <span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${C.badge}`}>{r}</span>)}
              </div>
              <a href={mode.bookUrl} target="_blank" rel="noreferrer"
                className={`${C.btn} text-white text-xs font-black px-5 py-2.5 rounded-xl transition-colors shadow-sm`}>
                Book Now →
              </a>
            </div>
          </div>
        </section>

        {/* ══ DISTANCE TABLE ═══════════════════════════════════════════ */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-1">Quick Distance Reference</h2>
          <p className="text-sm text-gray-400 mb-5">Popular routes across South India.</p>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-6 bg-gray-50 px-5 py-3 text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
              <span className="col-span-2">Route</span>
              <span>Distance</span>
              <span>Best Mode</span>
              <span>Time</span>
              <span>Cost (approx)</span>
            </div>
            {DISTANCE_TABLE.map(([dest, origin, dist, mode, time, cost], i) => {
              const m = MODES.find(m => m.id === mode);
              return (
                <div key={i} className={`grid grid-cols-6 px-5 py-3.5 text-sm items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="col-span-2">
                    <span className="font-bold text-gray-800">{origin}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-bold text-gray-800">{dest}</span>
                  </div>
                  <span className="text-gray-500">{dist} km</span>
                  <span>{m?.icon} {m?.name.split(" ")[0]}</span>
                  <span className="text-emerald-600 font-bold">{time}</span>
                  <span className="text-gray-600 font-semibold">{cost}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ TRAVELLER TIPS ════════════════════════════════════════════ */}
        <section className="pb-6">
          <h2 className="text-2xl font-black text-gray-800 mb-1">Traveller's Handbook</h2>
          <p className="text-sm text-gray-400 mb-5">What the guidebooks don't tell you.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((t,i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{t.icon}</span>
                <h4 className="font-black text-gray-800 text-sm mb-1">{t.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
