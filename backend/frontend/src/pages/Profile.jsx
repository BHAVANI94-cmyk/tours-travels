import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookingsAPI } from "../services/api";

export default function Profile() {
  const { user, logout, isLoggedIn, role, loading } = useAuth();
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Wait for AuthContext to finish loading before redirecting
    if (loading) return;
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    setSavedPlaces(JSON.parse(localStorage.getItem("savedReels") || "[]"));
    setLikedReels(JSON.parse(localStorage.getItem("likedReels") || "[]"));
    
    // Fetch bookings from database
    bookingsAPI.getMy()
      .then(data => setBookings(data))
      .catch(err => console.error("Failed to fetch bookings:", err));
  }, [isLoggedIn, loading, navigate]);

  // Show loading spinner while auth is being restored
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !user) return null;

  const statCards =
    role === "seller"
      ? [
          { label: "Listings", value: JSON.parse(localStorage.getItem(`seller_listings_${user.email}`) || "[]").length, icon: "🏨" },
          { label: "Total Views", value: "1.2K", icon: "👁️" },
          { label: "Bookings", value: "18", icon: "📅" },
          { label: "Rating", value: "4.7★", icon: "⭐" },
        ]
      : [
          { label: "Trips Planned", value: bookings.length || "0", icon: "🗺️" },
          { label: "Saved Places", value: savedPlaces.length, icon: "❤️" },
          { label: "Reels Liked", value: likedReels.length, icon: "🎬" },
          { label: "Reviews", value: "0", icon: "⭐" },
        ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Avatar + info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-emerald-100"
            />
            <span
              className={`absolute -bottom-2 -right-2 text-[10px] font-extrabold px-2 py-1 rounded-full border-2 border-white ${
                role === "seller" ? "bg-amber-400 text-amber-900" : "bg-emerald-500 text-white"
              }`}
            >
              {role === "seller" ? "SELLER" : "TOURIST"}
            </span>
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
            {user.joinedAt && (
              <p className="text-xs text-gray-400 mt-0.5">Joined {user.joinedAt}</p>
            )}
          </div>
          <div className="flex gap-2 pb-2">
            {role === "seller" && (
              <Link
                to="/seller/listings"
                className="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Manage Listings
              </Link>
            )}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-extrabold text-gray-800 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* USER: Saved places */}
        {role === "user" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-800">❤️ Saved Places</h2>
              <Link to="/saved" className="text-xs text-emerald-600 font-semibold hover:underline">
                View all
              </Link>
            </div>
            {savedPlaces.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🗺️</p>
                <p className="text-gray-400 text-sm mb-3">No saved places yet.</p>
                <Link
                  to="/explore"
                  className="inline-block bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-emerald-600"
                >
                  Explore Destinations →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedPlaces.slice(0, 6).map((item, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden h-28 bg-gray-100 group">
                    <img
                      src={item.videoUrl}
                      alt={item.location}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-2 left-2 text-white text-xs font-bold">
                      {item.location}
                    </p>
                    <p className="absolute bottom-2 right-2 text-emerald-300 text-xs font-bold">
                      ₹{item.price?.toLocaleString?.() || item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USER: My Bookings */}
        {role === "user" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-800">📅 My Bookings</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {bookings.length} Booking{bookings.length !== 1 ? "s" : ""}
              </span>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🏨</p>
                <p className="text-gray-400 text-sm mb-3">No bookings found in database.</p>
                <Link
                  to="/stays"
                  className="inline-block bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-emerald-600"
                >
                  Book a Stay Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {booking.itemType === "hotel" ? "🏨" : "🗺️"}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{booking.itemName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          👤 {booking.userName} · 📞 {booking.userPhone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          📅 {booking.checkIn} to {booking.checkOut} · {booking.nights} Night{booking.nights !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-between sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {booking.status}
                      </span>
                      <p className="text-emerald-600 font-extrabold text-sm sm:mt-2">
                        ₹{booking.total?.toLocaleString() || booking.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USER: Quick links */}
        {role === "user" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { to: "/planner", icon: "✨", label: "Plan a Trip", desc: "AI-powered itinerary", color: "hover:border-purple-300" },
              { to: "/explore", icon: "🗺️", label: "Explore", desc: "Find new places", color: "hover:border-emerald-300" },
              { to: "/feed", icon: "🎬", label: "Reels Feed", desc: "Watch & book", color: "hover:border-pink-300" },
              { to: "/travel", icon: "🚂", label: "Travel Guide", desc: "Transport & tips", color: "hover:border-blue-300" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${link.color} transition-all group text-center hover:shadow-md`}
              >
                <span className="text-2xl mb-2 block">{link.icon}</span>
                <p className="text-sm font-bold text-gray-700 group-hover:text-emerald-600">
                  {link.label}
                </p>
                <p className="text-xs text-gray-400">{link.desc}</p>
              </Link>
            ))}
          </div>
        )}

        {/* SELLER: Quick add links */}
        {role === "seller" && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <h2 className="text-base font-extrabold text-gray-800 mb-4">🏨 Quick Add</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { to: "/seller/add/place", icon: "📍", label: "Add Place", color: "hover:border-emerald-400" },
                  { to: "/seller/add/hotel", icon: "🏨", label: "Add Hotel", color: "hover:border-blue-400" },
                  { to: "/seller/add/restaurant", icon: "🍽️", label: "Add Restaurant", color: "hover:border-amber-400" },
                  { to: "/seller/add/reel", icon: "🎬", label: "Add Reel", color: "hover:border-purple-400" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${link.color} transition-all text-center hover:shadow-md group`}
                  >
                    <span className="text-2xl mb-2 block">{link.icon}</span>
                    <p className="text-xs font-bold text-gray-700 group-hover:text-amber-600">
                      {link.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Seller recent listings preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-gray-800">📋 My Listings</h2>
                <Link to="/seller/listings" className="text-xs text-amber-600 font-semibold hover:underline">
                  Manage all →
                </Link>
              </div>
              {(() => {
                const listings = JSON.parse(localStorage.getItem(`seller_listings_${user.email}`) || "[]");
                return listings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">No listings yet.</p>
                    <Link to="/seller/add/place" className="inline-block bg-amber-500 text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-amber-600">
                      Add your first listing →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.slice(0, 3).map((l) => (
                      <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        {l.imageUrl && (
                          <img src={l.imageUrl} alt={l.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.target.style.display = "none"; }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-700 truncate">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.type} · {l.location}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                          l.type === "Place" ? "bg-emerald-100 text-emerald-700" :
                          l.type === "Hotel" ? "bg-blue-100 text-blue-700" :
                          l.type === "Restaurant" ? "bg-amber-100 text-amber-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>{l.type}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </>
        )}

        <div className="h-10" />
      </div>
    </div>
  );
}
