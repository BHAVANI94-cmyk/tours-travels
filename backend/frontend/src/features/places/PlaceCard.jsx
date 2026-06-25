// src/features/places/PlaceCard.jsx
import { useNavigate } from "react-router-dom";
import { getPlaceOffer, getBestHotelOfferForPlace } from "../../data/offers";

const categoryColor = {
  Heritage:   "bg-purple-100 text-purple-700",
  Nature:     "bg-emerald-100 text-emerald-700",
  Spiritual:  "bg-orange-100 text-orange-700",
  Beach:      "bg-sky-100 text-sky-700",
  Hill:       "bg-teal-100 text-teal-700",
  Wildlife:   "bg-lime-100 text-lime-700",
  Backwaters: "bg-cyan-100 text-cyan-700",
};

export default function PlaceCard({ place }) {
  const navigate = useNavigate();

  const placeOffer = getPlaceOffer(place.id);
  const hotelOffer = getBestHotelOfferForPlace(place.id);
  const hasOffer   = placeOffer || hotelOffer;

  return (
    <div
      onClick={() => navigate(`/place/${place.id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>

        {/* Category badge — top left */}
        <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${categoryColor[place.category] || "bg-gray-100 text-gray-700"}`}>
          {place.category}
        </span>

        {/* Offer badges — top right */}
        {hasOffer && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            {placeOffer && (
              <span className={`${placeOffer.badgeColor} text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg leading-none`}>
                {placeOffer.badge}
              </span>
            )}
            {hotelOffer && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg leading-none">
                🏨 {hotelOffer.discount}% off stay
              </span>
            )}
          </div>
        )}

        {/* Entry cost — bottom left */}
        <div className="absolute bottom-3 left-3">
          {place.entryCost > 0
            ? <span className="text-xs bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">₹{place.entryCost} entry</span>
            : <span className="text-xs bg-emerald-500/90 text-white px-2 py-0.5 rounded-full font-black">Free Entry 🎉</span>
          }
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-black text-gray-800 leading-tight">{place.name}</h3>
          <span className="text-xs font-bold text-gray-500 ml-2 flex-shrink-0">★ {place.rating}</span>
        </div>
        <p className="text-xs text-gray-400 mb-2">📍 {place.location}</p>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{place.description}</p>
        {place.bestTime && <p className="text-[10px] text-gray-400 mb-3">🗓 Best: {place.bestTime}</p>}

        {/* Offer teaser — only if any offer exists */}
        {hasOffer && (
          <div
            className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-3 flex items-center justify-between gap-2"
            onClick={e => { e.stopPropagation(); navigate("/offers"); }}
          >
            <div className="min-w-0">
              {placeOffer && (
                <p className="text-[10px] font-black text-emerald-600 truncate">{placeOffer.badge} — {placeOffer.name}</p>
              )}
              {hotelOffer && (
                <p className="text-[10px] font-black text-rose-500 truncate">🏨 {hotelOffer.hotel} {hotelOffer.discount}% off</p>
              )}
            </div>
            <span className="flex-shrink-0 text-[10px] font-black text-rose-500 border border-rose-200 px-2 py-0.5 rounded-lg hover:bg-rose-100 whitespace-nowrap">
              View →
            </span>
          </div>
        )}

        <button
          onClick={e => { e.stopPropagation(); navigate(`/place/${place.id}`); }}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs transition-all active:scale-95"
        >
          Explore {place.name} →
        </button>
      </div>
    </div>
  );
}
