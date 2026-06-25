import { useState } from "react";

export default function RestaurantCard({ restaurant }) {
  const [imgError, setImgError] = useState(false);

  const typeColor = {
    "Cafe": "bg-amber-100 text-amber-700",
    "Restaurant": "bg-blue-100 text-blue-700",
    "Fine Dining": "bg-purple-100 text-purple-700",
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" : restaurant.image}
          alt={restaurant.name} onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${typeColor[restaurant.type] || "bg-gray-100 text-gray-600"}`}>
          {restaurant.type}
        </span>
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          ₹{restaurant.priceFor2} for 2
        </span>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-sm font-bold text-gray-800">{restaurant.name}</h4>
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
            <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span className="text-xs font-bold text-gray-600">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-xs text-emerald-600 font-medium mb-1">{restaurant.cuisine}</p>
        <p className="text-xs text-gray-400 mb-2 line-clamp-1">🍽 {restaurant.specialty}</p>

        <div className="text-xs text-gray-400 space-y-0.5">
          <p>🕐 {restaurant.hours}</p>
          <p>📍 {restaurant.distance}</p>
        </div>

        <a href={`tel:${restaurant.contact}`}
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 2.81h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Call to Reserve
        </a>
      </div>
    </div>
  );
}
