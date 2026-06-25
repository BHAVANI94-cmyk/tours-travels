import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { places } from "../data/places";
import { hotels, hotelStyles, hotelBudgets, hotelAmenities } from "../data/hotels";
import { restaurants, cuisineTypes, restaurantTypes } from "../data/restaurants";
import { getHotelOffer } from "../data/offers";
import BookingModal from "../components/ui/BookingModal";

export default function NearbyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = places.find(p => p.id === parseInt(id));
  const [tab, setTab] = useState("hotels");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelStyle, setHotelStyle] = useState("All");
  const [hotelBudget, setHotelBudget] = useState("All Budgets");
  const [selAmenities, setSelAmenities] = useState([]);
  const [availOnly, setAvailOnly] = useState(false);
  const [hotelSort, setHotelSort] = useState("recommended");
  const [cuisine, setCuisine] = useState("All");
  const [restType, setRestType] = useState("All");

  const nearbyHotels = useMemo(() => {
    let r = hotels.filter(h => h.placeId === place?.id);
    if (hotelStyle !== "All") r = r.filter(h => h.style === hotelStyle);
    if (hotelBudget !== "All Budgets") { const range = hotelBudgets.find(b => b.label === hotelBudget); if (range) r = r.filter(h => h.price >= range.min && h.price <= range.max); }
    if (selAmenities.length > 0) r = r.filter(h => selAmenities.every(a => h.amenities.includes(a)));
    if (availOnly) r = r.filter(h => h.available);
    if (hotelSort === "price_asc") r.sort((a,b) => a.price-b.price);
    else if (hotelSort === "price_desc") r.sort((a,b) => b.price-a.price);
    else if (hotelSort === "rating") r.sort((a,b) => b.rating-a.rating);
    return r;
  }, [place, hotelStyle, hotelBudget, selAmenities, availOnly, hotelSort]);

  const nearbyRests = useMemo(() => {
    let r = restaurants.filter(r => r.placeId === place?.id);
    if (cuisine !== "All") r = r.filter(x => x.cuisine === cuisine);
    if (restType !== "All") r = r.filter(x => x.type === restType);
    return r;
  }, [place, cuisine, restType]);

  if (!place) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Place not found.</p></div>;

  const chip = (active) => `px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${active ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(`/place/${place.id}`)} className="flex items-center gap-2 text-emerald-200 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" strokeLinecap="round"/></svg>Back to {place.name}
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black">Stays & Dining near</h1>
              <h2 className="text-4xl font-black text-emerald-300">{place.name}</h2>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 text-center"><p className="text-xl font-black">{nearbyHotels.length}</p><p className="text-xs text-emerald-200">Hotels</p></div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 text-center"><p className="text-xl font-black">{nearbyRests.length}</p><p className="text-xs text-emerald-200">Restaurants</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {[["hotels","🏨 Hotels & Stays"],["restaurants","🍽️ Restaurants"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${tab===key ? "bg-emerald-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {tab === "hotels" && (
            <>
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 space-y-5">
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Found</p><p className="text-2xl font-black text-gray-800">{nearbyHotels.length} <span className="text-sm font-normal text-gray-400">hotels</span></p></div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sort</p>
                    <select value={hotelSort} onChange={e => setHotelSort(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
                      <option value="recommended">Recommended</option><option value="rating">Top Rated</option><option value="price_asc">Price: Low→High</option><option value="price_desc">Price: High→Low</option>
                    </select>
                  </div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Style</p><div className="flex flex-wrap gap-1.5">{hotelStyles.map(s => <button key={s} onClick={() => setHotelStyle(s)} className={chip(hotelStyle===s)}>{s}</button>)}</div></div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Budget/Night</p><div className="space-y-1.5">{hotelBudgets.map(b => <button key={b.label} onClick={() => setHotelBudget(b.label)} className={`w-full text-left ${chip(hotelBudget===b.label)}`}>{b.label}</button>)}</div></div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Amenities</p><div className="flex flex-wrap gap-1.5">{hotelAmenities.map(a => <button key={a} onClick={() => setSelAmenities(prev => prev.includes(a)?prev.filter(x=>x!==a):[...prev,a])} className={chip(selAmenities.includes(a))}>{a}</button>)}</div></div>
                  <hr className="border-gray-100"/>
                  <label className="flex items-center justify-between cursor-pointer"><span className="text-xs font-semibold text-gray-600">Available Only</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${availOnly?"bg-emerald-500":"bg-gray-200"}`} onClick={() => setAvailOnly(!availOnly)}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${availOnly?"translate-x-5":"translate-x-0.5"}`}/>
                    </div>
                  </label>
                  <button onClick={() => { setHotelStyle("All"); setHotelBudget("All Budgets"); setSelAmenities([]); setAvailOnly(false); setHotelSort("recommended"); }} className="w-full py-2 text-xs font-medium text-red-400 border border-red-200 rounded-xl hover:bg-red-50">Reset</button>
                </div>
              </aside>
              <div className="flex-1">
                {nearbyHotels.length === 0 ? (
                  <div className="text-center py-20"><p className="text-4xl mb-3">🏨</p><p className="text-gray-500 text-sm">No hotels match your filters.</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {nearbyHotels.map(h => <HotelCard key={h.id} hotel={h} onBook={() => setSelectedHotel(h)} placeEntryCost={place.entryCost||0} navigate={navigate}/>)}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "restaurants" && (
            <>
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 space-y-5">
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Found</p><p className="text-2xl font-black text-gray-800">{nearbyRests.length} <span className="text-sm font-normal text-gray-400">restaurants</span></p></div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Cuisine</p><div className="space-y-1.5">{cuisineTypes.map(c => <button key={c} onClick={() => setCuisine(c)} className={`w-full text-left ${chip(cuisine===c)}`}>{c}</button>)}</div></div>
                  <hr className="border-gray-100"/>
                  <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Type</p><div className="flex flex-wrap gap-1.5">{restaurantTypes.map(t => <button key={t} onClick={() => setRestType(t)} className={chip(restType===t)}>{t}</button>)}</div></div>
                  <button onClick={() => { setCuisine("All"); setRestType("All"); }} className="w-full py-2 text-xs font-medium text-red-400 border border-red-200 rounded-xl hover:bg-red-50">Reset</button>
                </div>
              </aside>
              <div className="flex-1">
                {nearbyRests.length === 0 ? (
                  <div className="text-center py-20"><p className="text-4xl mb-3">🍽️</p><p className="text-gray-500 text-sm">No restaurants found.</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {nearbyRests.map(r => <RestCard key={r.id} restaurant={r} navigate={navigate}/>)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate(`/place/${place.id}`)} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50">← Back to {place.name}</button>
          <button onClick={() => navigate("/stays")} className="px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-100 border border-emerald-200">🏨 All Stays</button>
          <button onClick={() => navigate("/dining")} className="px-6 py-3 bg-amber-50 text-amber-700 font-bold rounded-xl text-sm hover:bg-amber-100 border border-amber-200">🍽️ All Restaurants</button>
          <button onClick={() => navigate("/explore")} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800">Browse All Destinations</button>
        </div>

        {/* Sticky bottom - Book This Place */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Book just the destination</p>
            <p className="text-sm font-black text-gray-800">{place.name}
              {place.entryCost > 0
                ? <span className="text-emerald-600 ml-2">₹{place.entryCost} entry</span>
                : <span className="text-emerald-600 ml-2">Free Entry 🎉</span>
              }
            </p>
          </div>
          <button onClick={() => setSelectedHotel({ ...place, price: (place.entryCost||0)+(place.guidePrice||0), isPlace: true, placeName: place.location })}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl text-sm active:scale-95 transition-all shadow-lg whitespace-nowrap">
            📅 Book This Place
          </button>
        </div>
        <div className="h-20"/>
      </div>

      {selectedHotel && (
        <BookingModal
          item={selectedHotel}
          type={selectedHotel.isPlace ? "place" : "hotel"}
          placePrice={selectedHotel.isPlace ? 0 : (place.entryCost||0)}
          onClose={() => setSelectedHotel(null)}
          onConfirm={() => setSelectedHotel(null)}/>
      )}
    </div>
  );
}

// ─── Hotel Card ──────────────────────────────────────────────────────────────
function HotelCard({ hotel: h, onBook, placeEntryCost, navigate }) {
  const [imgErr, setImgErr] = useState(false);
  const offer = getHotelOffer(h.id);
  const styleColor = { Luxury:"bg-amber-100 text-amber-800", Heritage:"bg-purple-100 text-purple-800", Resort:"bg-emerald-100 text-emerald-800", Boutique:"bg-pink-100 text-pink-800", Budget:"bg-gray-100 text-gray-700" };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/hotel/${h.id}`)}>
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img src={imgErr?"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80":h.image} alt={h.name} onError={() => setImgErr(true)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
        <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${styleColor[h.style]||"bg-gray-100 text-gray-700"}`}>{h.style}</span>
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${h.available?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{h.available?"Available":"Full"}</span>
        <div className="absolute bottom-3 left-3 text-white"><p className="text-xs opacity-70">per night</p><p className="text-xl font-black">₹{h.price.toLocaleString()}</p></div>
        {/* ── Offer badge ── */}
        {offer && (
          <div className="absolute bottom-3 right-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
            🏷️ {offer.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-black text-gray-800 mb-1">{h.name}</h3>
        <p className="text-xs text-gray-400 mb-2">📍 {h.distance} · ★ {h.rating}</p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{h.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">{h.amenities.slice(0,3).map(a => <span key={a} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>)}</div>

        {/* ── Offer strip ── */}
        {offer ? (
          <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide mb-0.5">{offer.badge}</p>
                <p className="text-xs text-gray-500">
                  <span className="line-through text-gray-400">₹{offer.originalPrice.toLocaleString()}</span>
                  {" "}→{" "}
                  <span className="font-black text-rose-600">₹{offer.offerPrice.toLocaleString()}</span>
                  <span className="text-gray-400">/night</span>
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); navigate("/offers"); }}
                className="text-[10px] font-black text-rose-500 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors"
              >
                See Offer →
              </button>
            </div>
          </div>
        ) : (
          /* Cost breakdown - hotel + place */
          <div className="bg-emerald-50 rounded-xl px-3 py-2 mb-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-500"><span>Hotel/night</span><span className="font-bold">₹{h.price.toLocaleString()}</span></div>
            {placeEntryCost > 0
              ? <div className="flex justify-between text-gray-500"><span>Place entry</span><span className="font-bold">₹{placeEntryCost}</span></div>
              : <div className="flex justify-between text-gray-500"><span>Place entry</span><span className="font-bold text-emerald-600">Free 🎉</span></div>
            }
            <div className="border-t border-emerald-200 pt-1 flex justify-between font-black text-emerald-700"><span>Total (1 night)</span><span>₹{(h.price+placeEntryCost).toLocaleString()}</span></div>
          </div>
        )}

        <button onClick={e => { e.stopPropagation(); h.available && onBook(); }} disabled={!h.available}
          className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${h.available?"bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95":"bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
          {h.available?"Book This Stay":"Fully Booked"}
        </button>
      </div>
    </div>
  );
}

// ─── Restaurant Card ─────────────────────────────────────────────────────────
function RestCard({ restaurant: r, navigate }) {
  const [imgErr, setImgErr] = useState(false);
  const typeColor = { Cafe:"bg-amber-100 text-amber-700", Restaurant:"bg-blue-100 text-blue-700", "Fine Dining":"bg-purple-100 text-purple-700" };
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/restaurant/${r.id}`)}>
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img src={imgErr?"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400":r.image} alt={r.name} onError={() => setImgErr(true)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
        <span className={`absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded-full ${typeColor[r.type]||"bg-gray-100"}`}>{r.type}</span>
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">₹{r.priceFor2} for 2</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1"><h4 className="text-sm font-black text-gray-800">{r.name}</h4><span className="text-xs font-bold text-gray-600 ml-1">★ {r.rating}</span></div>
        <p className="text-xs text-emerald-600 font-semibold mb-1">{r.cuisine}</p>
        <p className="text-xs text-gray-400 mb-1">🍽 {r.specialty}</p>
        <p className="text-xs text-gray-400 mb-3">🕐 {r.hours} · 📍 {r.distance}</p>
        <a href={`tel:${r.contact}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black rounded-xl hover:bg-blue-100">📞 Call to Reserve</a>
      </div>
    </div>
  );
}
