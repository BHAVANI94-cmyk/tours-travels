import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { hotels, hotelDetails } from "../data/hotels";
import { places } from "../data/places";
import BookingModal from "../components/ui/BookingModal";
import { getHotelOffer, daysLeft } from "../data/offers";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find(h => h.id === parseInt(id));
  const details = hotelDetails?.[parseInt(id)];
  const place = places.find(p => p.id === hotel?.placeId);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  if (!hotel) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><p className="text-5xl mb-4">🏨</p><h2 className="text-xl font-bold text-gray-700 mb-4">Hotel not found</h2>
        <button onClick={() => navigate("/stays")} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold">Browse All Stays</button></div>
    </div>
  );

  const allPhotos = details?.photos?.length ? [hotel.image, ...details.photos] : [hotel.image];
  const stars = Array.from({ length: hotel.stars });
  const styleColor = { Luxury:"bg-amber-100 text-amber-800", Heritage:"bg-purple-100 text-purple-800", Resort:"bg-emerald-100 text-emerald-800", Boutique:"bg-pink-100 text-pink-800", Budget:"bg-gray-100 text-gray-700", "Mid-range":"bg-blue-100 text-blue-800" };

  // ── Offer for this specific hotel ──────────────────────────────────────────
  const offer = getHotelOffer(hotel.id);
  const days  = offer ? daysLeft(offer.validUntil) : 0;

  // Which price to show in the booking card
  const displayPrice    = offer ? offer.offerPrice    : hotel.price;
  const originalPrice   = offer ? offer.originalPrice : hotel.price;
  const savings         = offer ? originalPrice - displayPrice : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Photo Gallery ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="h-72 md:h-[480px] relative overflow-hidden bg-gray-200">
          <img
            src={imgErr ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80" : allPhotos[activePhoto]}
            alt={hotel.name} onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-all duration-500"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"/>

          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-black/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" strokeLinecap="round"/></svg>Back
          </button>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">{activePhoto+1}/{allPhotos.length}</div>

          {/* Offer pill on hero */}
          {offer && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl backdrop-blur-sm flex items-center gap-1.5">
                🏷️ {offer.badge} — {offer.discount}% OFF · {days} days left
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full ${styleColor[hotel.style]}`}>{hotel.style}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${hotel.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{hotel.available ? "✓ Available" : "✗ Fully Booked"}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white">{hotel.name}</h1>
              <p className="text-white/70 text-sm mt-1">📍 {hotel.distance} · {hotel.placeName}</p>
            </div>
          </div>
        </div>

        {allPhotos.length > 1 && (
          <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {allPhotos.map((photo, i) => (
              <button key={i} onClick={() => { setActivePhoto(i); setImgErr(false); }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i===activePhoto ? "border-emerald-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <img src={photo} alt="" className="w-full h-full object-cover" onError={e => { e.target.src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"; }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Offer Banner (below gallery, full-width) ─────────────────────────── */}
      {offer && (
        <div className="bg-rose-500 text-white">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏷️</div>
              <div>
                <p className="font-black text-sm">{offer.badge} — Save ₹{savings.toLocaleString()} per night</p>
                <p className="text-rose-100 text-xs">{offer.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-rose-200 text-xs line-through">₹{originalPrice.toLocaleString()}/night</p>
                <p className="font-black text-xl">₹{displayPrice.toLocaleString()}<span className="text-rose-200 text-xs font-normal">/night</span></p>
              </div>
              <span className={`text-xs font-black px-3 py-1.5 rounded-full ${days <= 7 ? "bg-white text-rose-500" : "bg-white/20 text-white"}`}>
                {days === 0 ? "Expires today!" : `${days} days left`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Includes chips (if offer exists) ────────────────────────────────── */}
      {offer && (
        <div className="bg-rose-50 border-b border-rose-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-black text-rose-600 uppercase tracking-wide mr-1">Included:</span>
            {offer.includes.map((inc, i) => (
              <span key={i} className="text-[11px] bg-white border border-rose-200 text-rose-700 px-3 py-1 rounded-full font-semibold">✓ {inc}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left */}
          <div className="md:col-span-2 space-y-7">
            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-0.5">{stars.map((_,i) => <span key={i} className="text-amber-400">★</span>)}</div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <span className="text-amber-400">★</span>
                <span className="font-black text-emerald-700">{hotel.rating}</span>
                <span className="text-gray-400 text-xs">({hotel.reviews} reviews)</span>
              </div>
              {place && <Link to={`/place/${place.id}`} className="text-sm text-emerald-600 hover:underline font-semibold">📍 View {place.name} →</Link>}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-3">About this stay</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-3">✓ Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <span className="text-emerald-500 font-black text-sm">✓</span>
                    <span className="text-sm text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Features */}
            {details?.features && (
              <div>
                <h2 className="text-lg font-black text-gray-800 mb-3">🏨 Room Features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {details.features.map(f => (
                    <div key={f} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <span className="text-blue-400 text-xs">→</span>
                      <span className="text-xs text-blue-700 font-semibold">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {details?.policies && (
              <div>
                <h2 className="text-lg font-black text-gray-800 mb-3">📋 Hotel Policies</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
                  {details.policies.map((p,i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                      <span className="text-gray-600">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-3">📞 Contact</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 2.81h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round"/></svg>
                  </div>
                  <div><p className="text-xs text-gray-400">Phone</p><a href={`tel:${details?.contact}`} className="text-sm font-bold text-gray-800 hover:text-emerald-600">{details?.contact||"+91 00000 00000"}</a></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" strokeLinecap="round"/><circle cx="12" cy="9" r="2.5"/></svg>
                  </div>
                  <div><p className="text-xs text-gray-400">Location</p><p className="text-sm font-bold text-gray-800">{hotel.distance} · {hotel.placeName}</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Booking Card ──────────────────────────────────────────── */}
          <div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden sticky top-4">

              {/* Price header — show offer price if available */}
              <div className={`px-6 py-5 text-white ${offer ? "bg-gradient-to-br from-rose-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}>
                {offer ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">{offer.badge}</span>
                      <span className="text-rose-200 text-[10px] font-bold">{days} days left</span>
                    </div>
                    <p className="text-rose-200 text-xs line-through">₹{originalPrice.toLocaleString()} /night</p>
                    <p className="text-4xl font-black">₹{displayPrice.toLocaleString()}</p>
                    <p className="text-rose-100 text-xs mt-1">You save ₹{savings.toLocaleString()} per night 🎉</p>
                  </>
                ) : (
                  <>
                    <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Price per night</p>
                    <p className="text-4xl font-black">₹{hotel.price.toLocaleString()}</p>
                    {place?.entryCost > 0
                      ? <p className="text-emerald-200 text-xs mt-1">+₹{place.entryCost} place entry fee</p>
                      : <p className="text-emerald-200 text-xs mt-1">Place entry: FREE 🎉</p>
                    }
                  </>
                )}
              </div>

              <div className="p-5 space-y-3">
                <button
                  onClick={() => hotel.available && setShowBooking(true)}
                  disabled={!hotel.available}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-md ${hotel.available ? (offer ? "bg-rose-500 hover:bg-rose-600 text-white active:scale-95" : "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95") : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  {hotel.available ? (offer ? `🏷️ Book at ₹${displayPrice.toLocaleString()}` : "📅 Book This Stay") : "Fully Booked"}
                </button>

                <a href={`tel:${details?.contact}`} className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 2.81h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round"/></svg>
                  Call Hotel
                </a>

                {place && <Link to={`/nearby/${place.id}`} className="flex items-center justify-center gap-2 w-full py-3 border border-emerald-200 text-emerald-600 font-bold rounded-2xl text-sm hover:bg-emerald-50">🍽️ Nearby Restaurants</Link>}

                {offer && (
                  <button onClick={() => navigate("/offers")} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-rose-300 text-rose-500 font-black rounded-2xl text-sm hover:bg-rose-50">
                    🏷️ All Offers for {hotel.placeName}
                  </button>
                )}

                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span>Free cancellation available</div>
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span>Instant confirmation</div>
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span>No hidden charges</div>
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
              <h3 className="font-black text-gray-700 text-sm mb-3">Quick Facts</h3>
              <div className="space-y-2 text-xs text-gray-600">
                {[
                  ["Style", hotel.style],
                  ["Stars", "★".repeat(hotel.stars)],
                  ["Distance", hotel.distance],
                  ["Place entry", place?.entryCost > 0 ? `₹${place.entryCost}` : "Free"],
                  ["Rating", `★ ${hotel.rating}`],
                  ...(offer ? [["Offer price", `₹${displayPrice.toLocaleString()}/night`], ["You save", `₹${savings.toLocaleString()}`]] : []),
                ].map(([k,v]) => (
                  <div key={k} className={`flex justify-between ${k === "You save" ? "text-rose-500 font-black" : ""}`}>
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
          item={{ ...hotel, price: displayPrice }}
          type="hotel"
          placePrice={place?.entryCost || 0}
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}/>
      )}
    </div>
  );
}
