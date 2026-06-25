import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelStyles, hotelBudgets, hotelAmenities } from "../data/hotels";
import { places } from "../data/places";
import { getHotelOffer } from "../data/offers";
import BookingModal from "../components/ui/BookingModal";
import { hotelsAPI } from "../services/api";

export default function StaysPage() {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [destFilter, setDestFilter] = useState("All");
  const [style, setStyle] = useState("All");
  const [budget, setBudget] = useState("All Budgets");
  const [selAmenities, setSelAmenities] = useState([]);
  const [availOnly, setAvailOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [search, setSearch] = useState("");
  const [hotelsList, setHotelsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelsAPI
      .getAll()
      .then((data) => {
        setHotelsList(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hotels:", err);
        setLoading(false);
      });
  }, []);

  const destinations = ["All", ...new Set(hotelsList.map(h => h.placeName))];
  const chip = (active) => `px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${active?"bg-emerald-500 text-white border-emerald-500":"bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`;

  const filtered = useMemo(() => {
    let r = [...hotelsList];
    if (search.trim()) r = r.filter(h => h.name.toLowerCase().includes(search.toLowerCase())||h.placeName.toLowerCase().includes(search.toLowerCase()));
    if (destFilter !== "All") r = r.filter(h => h.placeName === destFilter);
    if (style !== "All") r = r.filter(h => h.style === style);
    if (budget !== "All Budgets") { const range = hotelBudgets.find(b => b.label === budget); if (range) r = r.filter(h => h.price >= range.min && h.price <= range.max); }
    if (selAmenities.length > 0) r = r.filter(h => selAmenities.every(a => h.amenities.includes(a)));
    if (availOnly) r = r.filter(h => h.available);
    if (sort === "price_asc") r.sort((a,b) => a.price-b.price);
    else if (sort === "price_desc") r.sort((a,b) => b.price-a.price);
    else if (sort === "rating") r.sort((a,b) => b.rating-a.rating);
    return r;
  }, [search, destFilter, style, budget, selAmenities, availOnly, sort, hotelsList]);

  const styleColor = { Luxury:"bg-amber-100 text-amber-800", Heritage:"bg-purple-100 text-purple-800", Resort:"bg-emerald-100 text-emerald-800", Boutique:"bg-pink-100 text-pink-800", Budget:"bg-gray-100 text-gray-700" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Browse by destination</p>
          <h1 className="text-4xl font-black mb-3">Find your perfect stay</h1>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3.5 max-w-xl border border-white/20">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotel or destination..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm"/>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 space-y-5">
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Found</p><p className="text-2xl font-black text-gray-800">{filtered.length} <span className="text-sm font-normal text-gray-400">stays</span></p></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sort</p>
              <select value={sort} onChange={e => setSort(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
                <option value="recommended">Recommended</option><option value="rating">Top Rated</option><option value="price_asc">Price: Low→High</option><option value="price_desc">Price: High→Low</option>
              </select>
            </div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Destination</p><div className="flex flex-wrap gap-1.5">{destinations.map(d => <button key={d} onClick={() => setDestFilter(d)} className={chip(destFilter===d)}>{d}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Style</p><div className="flex flex-wrap gap-1.5">{hotelStyles.map(s => <button key={s} onClick={() => setStyle(s)} className={chip(style===s)}>{s}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Budget/Night</p><div className="space-y-1.5">{hotelBudgets.map(b => <button key={b.label} onClick={() => setBudget(b.label)} className={`w-full text-left ${chip(budget===b.label)}`}>{b.label}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Amenities</p><div className="flex flex-wrap gap-1.5">{hotelAmenities.map(a => <button key={a} onClick={() => setSelAmenities(prev => prev.includes(a)?prev.filter(x=>x!==a):[...prev,a])} className={chip(selAmenities.includes(a))}>{a}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <label className="flex items-center justify-between cursor-pointer"><span className="text-xs font-semibold text-gray-600">Available Only</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${availOnly?"bg-emerald-500":"bg-gray-200"}`} onClick={() => setAvailOnly(!availOnly)}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${availOnly?"translate-x-5":"translate-x-0.5"}`}/>
              </div>
            </label>
            <button onClick={() => { setDestFilter("All"); setStyle("All"); setBudget("All Budgets"); setSelAmenities([]); setAvailOnly(false); setSort("recommended"); setSearch(""); }}
              className="w-full py-2 text-xs font-medium text-red-400 border border-red-200 rounded-xl hover:bg-red-50">Reset All</button>
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24"><p className="text-5xl mb-4">🏨</p><p className="text-gray-500">No stays match your filters.</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(h => {
                const place = places.find(p => p.id === h.placeId);
                const offer = getHotelOffer(h.id);
                return (
                  <div key={h.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/hotel/${h.id}`)}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={e => { e.target.src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"; }}/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                      <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${styleColor[h.style]||"bg-gray-100 text-gray-700"}`}>{h.style}</span>
                      <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${h.available?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{h.available?"Available":"Full"}</span>
                      <div className="absolute bottom-3 left-3 text-white"><p className="text-xs opacity-70">per night</p><p className="text-lg font-black">₹{h.price.toLocaleString()}</p></div>
                      {/* ── Offer badge ── */}
                      {offer && (
                        <div className="absolute bottom-3 right-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                          🏷️ {offer.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-black text-gray-800 mb-0.5">{h.name}</h3>
                      <button onClick={e => { e.stopPropagation(); place && navigate(`/place/${place.id}`); }} className="text-xs text-emerald-600 hover:underline font-semibold mb-2 block">📍 {h.placeName}</button>
                      <div className="flex items-center gap-1 mb-2">{Array.from({length:h.stars}).map((_,i) => <span key={i} className="text-amber-400 text-xs">★</span>)}<span className="text-xs text-gray-400 ml-1">★ {h.rating}</span></div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{h.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">{h.amenities.slice(0,3).map(a => <span key={a} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>)}</div>

                      {/* ── Offer strip ── */}
                      {offer && (
                        <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide">{offer.badge}</p>
                            <p className="text-xs text-gray-500">
                              <span className="line-through text-gray-400">₹{offer.originalPrice.toLocaleString()}</span>
                              {" "}→{" "}
                              <span className="font-black text-rose-600">₹{offer.offerPrice.toLocaleString()}</span>
                              <span className="text-gray-400">/night</span>
                            </p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); navigate("/offers"); }}
                            className="text-[10px] font-black text-rose-500 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap"
                          >
                            See Offer →
                          </button>
                        </div>
                      )}

                      {place?.entryCost > 0 && !offer && <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5 mb-3 text-xs text-amber-700">💡 +₹{place.entryCost} place entry included in total</div>}
                      <button onClick={e => { e.stopPropagation(); h.available && setSelectedHotel(h); }} disabled={!h.available}
                        className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${h.available?"bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95":"bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                        {h.available?"Book Now":"Fully Booked"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedHotel && (
        <BookingModal item={selectedHotel} type="hotel"
          placePrice={places.find(p => p.id === selectedHotel.placeId)?.entryCost||0}
          onClose={() => setSelectedHotel(null)} onConfirm={() => setSelectedHotel(null)}/>
      )}
    </div>
  );
}
