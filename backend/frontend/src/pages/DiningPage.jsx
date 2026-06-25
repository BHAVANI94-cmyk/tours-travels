import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { restaurants, cuisineTypes, restaurantTypes } from "../data/restaurants";
import { places } from "../data/places";

export default function DiningPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [destFilter, setDestFilter] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [restType, setRestType] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sort, setSort] = useState("rating");

  const destinations = ["All", ...new Set(restaurants.map(r => r.placeName))];
  const priceRanges = [{ label:"All",min:0,max:Infinity },{ label:"Under ₹400",min:0,max:400 },{ label:"₹400–₹800",min:400,max:800 },{ label:"Above ₹800",min:800,max:Infinity }];
  const chip = (active) => `px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${active?"bg-amber-500 text-white border-amber-500":"bg-white text-gray-600 border-gray-200 hover:border-amber-400"}`;
  const typeColor = { Cafe:"bg-amber-100 text-amber-700", Restaurant:"bg-blue-100 text-blue-700", "Fine Dining":"bg-purple-100 text-purple-700" };

  const filtered = useMemo(() => {
    let r = [...restaurants];
    if (search.trim()) r = r.filter(x => x.name.toLowerCase().includes(search.toLowerCase())||x.placeName.toLowerCase().includes(search.toLowerCase())||x.cuisine.toLowerCase().includes(search.toLowerCase()));
    if (destFilter !== "All") r = r.filter(x => x.placeName === destFilter);
    if (cuisine !== "All") r = r.filter(x => x.cuisine === cuisine);
    if (restType !== "All") r = r.filter(x => x.type === restType);
    if (priceFilter !== "All") { const range = priceRanges.find(p => p.label === priceFilter); if (range) r = r.filter(x => x.priceFor2 >= range.min && x.priceFor2 <= range.max); }
    if (sort === "rating") r.sort((a,b) => b.rating-a.rating);
    if (sort === "price_asc") r.sort((a,b) => a.priceFor2-b.priceFor2);
    if (sort === "price_desc") r.sort((a,b) => b.priceFor2-a.priceFor2);
    return r;
  }, [search, destFilter, cuisine, restType, priceFilter, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-2">All restaurants</p>
          <h1 className="text-4xl font-black mb-3">Where to eat in South India</h1>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3.5 max-w-xl border border-white/20">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurant, cuisine, destination..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm"/>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 space-y-5">
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Found</p><p className="text-2xl font-black text-gray-800">{filtered.length} <span className="text-sm font-normal text-gray-400">restaurants</span></p></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sort</p>
              <select value={sort} onChange={e => setSort(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
                <option value="rating">Top Rated</option><option value="price_asc">Price: Low→High</option><option value="price_desc">Price: High→Low</option>
              </select>
            </div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Destination</p><div className="flex flex-wrap gap-1.5">{destinations.map(d => <button key={d} onClick={() => setDestFilter(d)} className={chip(destFilter===d)}>{d}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Cuisine</p><div className="space-y-1.5">{cuisineTypes.map(c => <button key={c} onClick={() => setCuisine(c)} className={`w-full text-left ${chip(cuisine===c)}`}>{c}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Type</p><div className="flex flex-wrap gap-1.5">{restaurantTypes.map(t => <button key={t} onClick={() => setRestType(t)} className={chip(restType===t)}>{t}</button>)}</div></div>
            <hr className="border-gray-100"/>
            <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Price for 2</p><div className="space-y-1.5">{priceRanges.map(p => <button key={p.label} onClick={() => setPriceFilter(p.label)} className={`w-full text-left ${chip(priceFilter===p.label)}`}>{p.label}</button>)}</div></div>
            <button onClick={() => { setDestFilter("All"); setCuisine("All"); setRestType("All"); setPriceFilter("All"); setSearch(""); }}
              className="w-full py-2 text-xs font-medium text-red-400 border border-red-200 rounded-xl hover:bg-red-50">Reset All</button>
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24"><p className="text-5xl mb-4">🍽️</p><p className="text-gray-500">No restaurants match your filters.</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(r => {
                const place = places.find(p => p.id === r.placeId);
                return (
                  <div key={r.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/restaurant/${r.id}`)}>
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={e => { e.target.src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"; }}/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                      <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${typeColor[r.type]||"bg-gray-100 text-gray-600"}`}>{r.type}</span>
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">₹{r.priceFor2} for 2</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1"><h3 className="text-sm font-black text-gray-800">{r.name}</h3><span className="text-xs font-bold text-gray-600 ml-1">★ {r.rating}</span></div>
                      <button onClick={e => { e.stopPropagation(); place && navigate(`/place/${place.id}`); }} className="text-xs text-amber-600 hover:underline font-semibold mb-2 block">📍 {r.placeName}</button>
                      <p className="text-xs text-amber-600 font-semibold mb-1">{r.cuisine}</p>
                      <p className="text-xs text-gray-400 mb-1">🍽 {r.specialty}</p>
                      <p className="text-xs text-gray-400 mb-3">🕐 {r.hours}</p>
                      <a href={`tel:${r.contact}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black rounded-xl hover:bg-amber-100">📞 Call to Reserve</a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
