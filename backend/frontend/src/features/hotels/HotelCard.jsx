import { useState } from "react";
import BookingModal from "../../components/ui/BookingModal";

export default function HotelCard({ hotel }) {
  const [showBooking, setShowBooking] = useState(false);
  const [imgError, setImgError] = useState(false);

  const stars = Array.from({ length: hotel.stars }, (_, i) => i);

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img src={imgError ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" : hotel.image}
            alt={hotel.name} onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>

          {/* Style badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${
            hotel.style === "Luxury" ? "bg-amber-400 text-amber-900" :
            hotel.style === "Heritage" ? "bg-purple-500 text-white" :
            hotel.style === "Resort" ? "bg-emerald-500 text-white" :
            hotel.style === "Boutique" ? "bg-pink-500 text-white" :
            "bg-gray-200 text-gray-700"
          }`}>{hotel.style}</span>

          {/* Available badge */}
          <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
            hotel.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {hotel.available ? "Available" : "Full"}
          </span>

          {/* Price */}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-xs opacity-70">per night</p>
            <p className="text-lg font-bold">₹{hotel.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Stars */}
          <div className="flex gap-0.5 mb-2">
            {stars.map((_, i) => (
              <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
          </div>

          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800 leading-tight">{hotel.name}</h3>
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
              <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span className="text-xs font-bold text-emerald-700">{hotel.rating}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" strokeLinecap="round"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {hotel.distance}
          </p>

          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-gray-400 px-1">+{hotel.amenities.length - 4} more</span>
            )}
          </div>

          {/* Book button */}
          <button
            onClick={() => setShowBooking(true)}
            disabled={!hotel.available}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
              hotel.available
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {hotel.available ? "Book Now" : "Fully Booked"}
          </button>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          item={hotel}
          type="hotel"
          onClose={() => setShowBooking(false)}
          onConfirm={(data) => { console.log("Booking:", data); setShowBooking(false); }}
        />
      )}
    </>
  );
}
