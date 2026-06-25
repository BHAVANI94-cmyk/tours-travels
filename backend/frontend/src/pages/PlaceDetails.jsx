import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { placesAPI } from "../services/api";
import BookingModal from "../components/ui/BookingModal";
import { getPlaceOffer, getBestHotelOfferForPlace, daysLeft } from "../data/offers";

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    placesAPI.getOne(id)
      .then(data => {
        setPlace(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch place details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  if (!place) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl mb-4">🗺️</p>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Place not found</h2>
        <button onClick={() => navigate("/explore")} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600">Back to Explore</button>
      </div>
    </div>
  );

  const allPhotos = place.photos?.length ? [place.image, ...place.photos] : [place.image];

  // ── Offer data for this place ──────────────────────────────────────────────
  const placeOffer   = getPlaceOffer(place.id);               // tour/entry deal
  const hotelOffer   = getBestHotelOfferForPlace(place.id);   // best hotel deal here
  const hasAnyOffer  = placeOffer || hotelOffer;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Photo Gallery ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="h-72 md:h-[480px] relative overflow-hidden bg-gray-200">
          <img
            src={imgErr ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" : allPhotos[activePhoto]}
            alt={place.name} onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-all duration-500"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"/>
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-black/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" strokeLinecap="round"/></svg>Back
          </button>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">{activePhoto+1}/{allPhotos.length}</div>

          {/* Offer pill on hero image */}
          {hasAnyOffer && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
              {placeOffer && (
                <span className={`${placeOffer.badgeColor} text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}>
                  {placeOffer.badge}
                </span>
              )}
              {hotelOffer && (
                <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  🏨 {hotelOffer.discount}% off stays
                </span>
              )}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">{place.category}</span>
                <span className="text-white/70 text-sm">📍 {place.location}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{place.name}</h1>
            </div>
          </div>
        </div>

        {allPhotos.length > 1 && (
          <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {allPhotos.map((photo, i) => (
              <button key={i} onClick={() => { setActivePhoto(i); setImgErr(false); }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activePhoto ? "border-emerald-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <img src={photo} alt="" className="w-full h-full object-cover" onError={e => { e.target.src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100"; }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Offer Banner strip (below hero, above content) ──────────────────── */}
      {hasAnyOffer && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-2">

            {/* Place / Tour offer */}
            {placeOffer && (
              <div className={`${placeOffer.badgeColor} rounded-2xl p-4 text-white flex items-center justify-between gap-4 shadow-md`}>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-0.5">{placeOffer.badge}</p>
                  <p className="font-black text-base leading-tight truncate">{placeOffer.name}</p>
                  <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{placeOffer.description}</p>
                  <p className="text-xs font-bold mt-1 opacity-90">
                    {placeOffer.offerPrice === 0
                      ? "FREE Entry"
                      : `₹${placeOffer.offerPrice} · save ₹${placeOffer.originalPrice - placeOffer.offerPrice}`
                    }
                    {" "}· {daysLeft(placeOffer.validUntil)} days left
                  </p>
                </div>
                <button
                  onClick={() => navigate("/offers")}
                  className="flex-shrink-0 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all whitespace-nowrap active:scale-95"
                >
                  View Offer →
                </button>
              </div>
            )}

            {/* Hotel offer */}
            {hotelOffer && (
              <div className="bg-rose-500 rounded-2xl p-4 text-white flex items-center justify-between gap-4 shadow-md">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-0.5">{hotelOffer.badge}</p>
                  <p className="font-black text-base leading-tight truncate">{hotelOffer.hotel}</p>
                  <p className="text-xs opacity-80 mt-0.5">
                    <span className="line-through">₹{hotelOffer.originalPrice.toLocaleString()}</span>
                    {" → "}
                    <span className="font-black">₹{hotelOffer.offerPrice.toLocaleString()}/night</span>
                  </p>
                  <p className="text-xs font-bold mt-1 opacity-90">
                    Save ₹{(hotelOffer.originalPrice - hotelOffer.offerPrice).toLocaleString()} · {daysLeft(hotelOffer.validUntil)} days left
                  </p>
                </div>
                <button
                  onClick={() => navigate("/offers")}
                  className="flex-shrink-0 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all whitespace-nowrap active:scale-95"
                >
                  Book Offer →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          {/* ── Left col ─────────────────────────────────────────────────────── */}
          <div className="md:col-span-2 space-y-7">

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                <span className="font-black text-emerald-700">{place.rating}</span>
                <span className="text-gray-400 text-xs">({place.reviews?.toLocaleString()} reviews)</span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">🗓 Best: {place.bestTime}</span>
              {place.tags?.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{tag}</span>)}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-3">About {place.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{place.description}</p>
            </div>

            {/* Highlights */}
            {place.highlights && (
              <div>
                <h2 className="text-lg font-black text-gray-800 mb-3">✨ Top Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {place.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 text-xs font-black">{i+1}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Do's and Don'ts */}
            {place.dos && place.donts && (
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                  <h3 className="font-black text-emerald-700 mb-3">✅ Do's</h3>
                  <ul className="space-y-2">{place.dos.map((d,i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-emerald-500 flex-shrink-0 mt-0.5">•</span>{d}</li>)}</ul>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <h3 className="font-black text-red-600 mb-3">❌ Don'ts</h3>
                  <ul className="space-y-2">{place.donts.map((d,i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-red-400 flex-shrink-0 mt-0.5">•</span>{d}</li>)}</ul>
                </div>
              </div>
            )}
          </div>

          {/* ── Right col — booking card ──────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden sticky top-4">

              {/* Cost header */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-5 text-white">
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Cost per person</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-100">Place entry</span>
                    {place.entryCost > 0
                      ? <span className="font-black text-lg">₹{place.entryCost}</span>
                      : <span className="bg-white/20 text-white text-xs font-black px-2.5 py-1 rounded-full">FREE 🎉</span>
                    }
                  </div>
                  {place.guidePrice > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-100">Guide (optional)</span>
                      <span className="font-bold text-base">₹{place.guidePrice}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-2 flex justify-between items-center">
                    <span className="text-sm font-black">Explore cost</span>
                    <span className="font-black text-2xl">{(place.entryCost||0)+(place.guidePrice||0) > 0 ? `₹${(place.entryCost||0)+(place.guidePrice||0)}` : "FREE"}</span>
                  </div>
                </div>
              </div>

              {/* Active offer mini-card inside booking panel */}
              {(placeOffer || hotelOffer) && (
                <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-rose-100">
                  {placeOffer && (
                    <div className={`${placeOffer.badgeColor} px-4 py-3 flex items-center justify-between gap-2`}>
                      <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-wide">{placeOffer.badge}</p>
                        <p className="text-white text-xs font-bold opacity-90">
                          {placeOffer.offerPrice === 0 ? "FREE Entry" : `₹${placeOffer.offerPrice} · save ₹${placeOffer.originalPrice - placeOffer.offerPrice}`}
                        </p>
                      </div>
                      <span className="text-white/70 text-[10px] font-bold whitespace-nowrap">{daysLeft(placeOffer.validUntil)}d left</span>
                    </div>
                  )}
                  {hotelOffer && (
                    <div className="bg-rose-500 px-4 py-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-wide">🏨 {hotelOffer.hotel}</p>
                        <p className="text-white text-xs font-bold opacity-90">
                          {hotelOffer.discount}% off · ₹{hotelOffer.offerPrice.toLocaleString()}/night
                        </p>
                      </div>
                      <span className="text-white/70 text-[10px] font-bold whitespace-nowrap">{daysLeft(hotelOffer.validUntil)}d left</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="p-5 space-y-3">
                <button onClick={() => setShowBooking(true)}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black rounded-2xl transition-all shadow-lg text-sm flex items-center justify-center gap-2">
                  📅 Book This Place
                </button>
                <button onClick={() => navigate(`/nearby/${place.id}`)}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-black rounded-2xl transition-all shadow-lg text-sm flex items-center justify-center gap-2">
                  🏨 Nearby Hotels & Restaurants
                </button>
                {hasAnyOffer && (
                  <button onClick={() => navigate("/offers")}
                    className="w-full py-3 border-2 border-rose-400 text-rose-500 font-black rounded-2xl text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                    🏷️ See All Offers for {place.name}
                  </button>
                )}
                <button onClick={() => navigate(`/planner?to=${encodeURIComponent(place.name)}`)}
                  className="w-full py-3 border border-purple-200 text-purple-600 font-bold rounded-2xl text-sm hover:bg-purple-50 transition-colors">
                  ✨ Plan full trip with AI
                </button>
                <button onClick={() => navigate("/travel")}
                  className="w-full py-3 border border-gray-200 text-gray-500 font-medium rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                  🚂 How to get here
                </button>
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-700 text-sm mb-3">Quick Facts</h3>
              <div className="space-y-2 text-xs text-gray-600">
                {[
                  ["Location", place.location],
                  ["Category", place.category],
                  ["Best Time", place.bestTime],
                  ["Entry Fee", place.entryCost > 0 ? `₹${place.entryCost}` : "Free"],
                  ["Guide", `₹${place.guidePrice}/person`],
                  ["Rating", `★ ${place.rating} (${place.reviews?.toLocaleString()})`],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          item={{
            name: place.name,
            price: (place.entryCost || 0) + (place.guidePrice || 0),
            placeName: place.location,
            image: allPhotos[0],
            isPlace: true,
          }}
          type="place"
          placePrice={0}
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}/>
      )}
    </div>
  );
}
