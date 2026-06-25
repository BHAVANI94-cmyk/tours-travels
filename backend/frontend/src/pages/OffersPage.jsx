import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingModal from "../components/ui/BookingModal";
import { places } from "../data/places";
import { OFFERS, PLACE_OFFERS, daysLeft } from "../data/offers";

const TAGS = ["All","Hill Station","Beach","Backwaters","Wildlife","Pilgrimage"];

export default function OffersPage() {
  const navigate = useNavigate();
  const [offerType, setOfferType] = useState("stays");
  const [activeTag, setActiveTag] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = offerType === "stays"
    ? (activeTag === "All" ? OFFERS : OFFERS.filter(o => o.tag === activeTag))
    : (activeTag === "All" ? PLACE_OFFERS : PLACE_OFFERS.filter(o => o.tag === activeTag));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%, white 0%, transparent 50%)"}}/>
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4">🎉 Limited Time Deals</span>
          <h1 className="text-5xl font-black mb-3">Exclusive Offers</h1>
          <p className="text-pink-100 text-sm max-w-md mx-auto mb-6">Hand-picked deals on the best hotels and destinations across South India.</p>
          <div className="flex justify-center gap-8">
            {[{val:`${OFFERS.length}+`,lab:"Active Deals"},{val:"Up to 30%",lab:"Max Savings"},{val:"8 Cities",lab:"Covered"}].map(s => (
              <div key={s.lab}><p className="text-2xl font-black">{s.val}</p><p className="text-pink-200 text-xs">{s.lab}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Type switcher */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => { setOfferType("stays"); setActiveTag("All"); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${offerType==="stays"?"bg-rose-500 text-white shadow-lg":"bg-white text-gray-600 border border-gray-200 hover:border-rose-400"}`}>
            🏨 Hotel Offers
          </button>
          <button onClick={() => { setOfferType("places"); setActiveTag("All"); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${offerType==="places"?"bg-emerald-500 text-white shadow-lg":"bg-white text-gray-600 border border-gray-200 hover:border-emerald-400"}`}>
            🗺️ Place & Tour Offers
          </button>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TAGS.map(t => (
            <button key={t} onClick={() => setActiveTag(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTag===t?"bg-rose-500 text-white shadow-md":"bg-white text-gray-600 border border-gray-200 hover:border-rose-400"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(o => {
            const days = daysLeft(o.validUntil);   // ← uses safe helper, never NaN
            const savings = o.originalPrice - o.offerPrice;
            return (
              <div key={o.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={o.image} alt={o.hotel || o.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"; }}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <span className={`absolute top-3 left-3 ${o.badgeColor} text-white text-xs font-black px-3 py-1.5 rounded-full`}>{o.badge}</span>
                  {o.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-white rounded-2xl px-3 py-1.5 text-center shadow-lg">
                      <p className="text-rose-600 font-black text-lg leading-none">{o.discount}%</p>
                      <p className="text-gray-400 text-[10px] font-bold">OFF</p>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${days <= 7 ? "bg-red-500 text-white" : "bg-black/40 backdrop-blur-sm text-white"}`}>
                      {days === 0 ? "Expires today!" : `${days} days left`}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-black text-gray-900 text-base">{o.hotel || o.name}</h3>
                  <button onClick={() => navigate(`/place/${o.placeId}`)} className="text-xs text-emerald-600 hover:underline font-semibold mb-2 block">
                    📍 {o.placeName}
                  </button>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{o.description}</p>

                  {/* Includes */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {o.includes.map((inc, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold">✓ {inc}</span>
                    ))}
                  </div>

                  {/* Price block — NO coupon code */}
                  <div className="flex items-center justify-between mb-5 bg-emerald-50 rounded-2xl px-4 py-3">
                    {o.isPlace ? (
                      <div className="w-full flex justify-between items-center">
                        <div>
                          {o.offerPrice === 0
                            ? <p className="text-2xl font-black text-emerald-600">FREE Entry 🎉</p>
                            : <p className="text-2xl font-black text-emerald-600">₹{o.offerPrice}</p>
                          }
                          {o.originalPrice > 0 && o.offerPrice < o.originalPrice &&
                            <p className="text-xs text-gray-400 line-through">₹{o.originalPrice}</p>
                          }
                        </div>
                        {savings > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-gray-400">You save</p>
                            <p className="text-lg font-black text-rose-500">₹{savings}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-gray-400 line-through">₹{o.originalPrice.toLocaleString()}/night</p>
                          <p className="text-xl font-black text-rose-600">₹{o.offerPrice.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/night</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">You save</p>
                          <p className="text-lg font-black text-emerald-600">₹{savings.toLocaleString()}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(o)}
                      className={`flex-1 py-3 font-black rounded-2xl text-sm transition-all active:scale-95 ${o.isPlace ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"}`}>
                      {o.isPlace ? "Book Tour" : "Book Now"}
                    </button>
                    <button onClick={() => o.isPlace ? navigate(`/place/${o.placeId}`) : navigate(`/nearby/${o.placeId}`)}
                      className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-black mb-2">Can't find what you're looking for?</h2>
          <p className="text-white/80 text-sm mb-6">Browse all destinations and find the perfect stay for your budget.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate("/stays")} className="bg-white text-rose-600 font-black px-6 py-3 rounded-2xl text-sm hover:shadow-lg">Browse All Stays</button>
            <button onClick={() => navigate("/planner")} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-2xl text-sm border border-white/20">✨ Plan with AI</button>
          </div>
        </div>
      </div>

      {selected && (
        <BookingModal
          item={selected.isPlace
            ? { name: selected.name, price: selected.offerPrice, image: selected.image, placeName: selected.placeName, isPlace: true }
            : { name: selected.hotel, price: selected.offerPrice, image: selected.image, placeName: selected.placeName }
          }
          type={selected.isPlace ? "place" : "hotel"}
          placePrice={0}
          onClose={() => setSelected(null)}
          onConfirm={() => setSelected(null)}/>
      )}
    </div>
  );
}
