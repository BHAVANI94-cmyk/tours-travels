import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { placesAPI, hotelsAPI, restaurantsAPI, reelsAPI } from "../../services/api";

const TABS = ["All", "Places", "Hotels", "Restaurants", "Reels"];

export default function SellerDashboard() {
  const { user, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    if (!isLoggedIn || role !== "seller") { navigate("/"); return; }
    
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [places, hotels, restaurants, reels] = await Promise.all([
          placesAPI.getMy().catch(() => []),
          hotelsAPI.getMy().catch(() => []),
          restaurantsAPI.getMy().catch(() => []),
          reelsAPI.getMy().catch(() => [])
        ]);

        const mappedPlaces = (places || []).map((p) => ({
          id: p._id,
          title: p.name,
          type: "Place",
          location: p.location,
          category: p.category,
          price: p.price,
          description: p.description,
          imageUrl: p.image,
          addedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Recent"
        }));

        const mappedHotels = (hotels || []).map((h) => ({
          id: h._id,
          title: h.name,
          type: "Hotel",
          location: h.placeName || h.location || "Multiple Locations",
          category: h.style,
          price: h.price,
          description: h.description,
          imageUrl: h.image,
          addedAt: h.createdAt ? new Date(h.createdAt).toLocaleDateString("en-IN") : "Recent"
        }));

        const mappedRestaurants = (restaurants || []).map((r) => ({
          id: r._id,
          title: r.name,
          type: "Restaurant",
          location: r.placeName || r.location || "Multiple Locations",
          category: r.cuisine,
          price: r.priceFor2,
          description: r.description,
          imageUrl: r.image,
          addedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "Recent"
        }));

        const mappedReels = (reels || []).map((rl) => ({
          id: rl._id,
          title: rl.description || rl.location || "Short Reel",
          type: "Reel",
          location: rl.location,
          category: "Reel",
          price: rl.price,
          description: rl.description,
          imageUrl: rl.url,
          addedAt: rl.createdAt ? new Date(rl.createdAt).toLocaleDateString("en-IN") : "Recent"
        }));

        setListings([...mappedPlaces, ...mappedHotels, ...mappedRestaurants, ...mappedReels]);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isLoggedIn, role, navigate, user]);

  const filtered = tab === "All" ? listings : listings.filter((l) => l.type === tab.slice(0, -1));

  const deleteListing = async (id, type) => {
    if (!window.confirm(`Are you sure you want to remove this ${type.toLowerCase()}?`)) return;
    try {
      if (type === "Place") {
        await placesAPI.delete(id);
      } else if (type === "Hotel") {
        await hotelsAPI.delete(id);
      } else if (type === "Restaurant") {
        await restaurantsAPI.delete(id);
      } else if (type === "Reel") {
        await reelsAPI.delete(id);
      }
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Error deleting listing: " + err.message);
    }
  };

  const typeColor = { Place: "bg-emerald-100 text-emerald-700", Hotel: "bg-blue-100 text-blue-700", Restaurant: "bg-amber-100 text-amber-700", Reel: "bg-purple-100 text-purple-700" };
  const addLinks = [
    { to: "/seller/add/place", icon: "📍", label: "Add Place" },
    { to: "/seller/add/hotel", icon: "🏨", label: "Add Hotel" },
    { to: "/seller/add/restaurant", icon: "🍽️", label: "Add Restaurant" },
    { to: "/seller/add/reel", icon: "🎬", label: "Add Reel" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-xl border-2 border-white/30"/>
            <div>
              <p className="text-xs text-amber-200 font-bold uppercase tracking-widest">Seller Dashboard</p>
              <h1 className="text-xl font-extrabold">{user?.name}'s Listings</h1>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total", value: listings.length },
              { label: "Places", value: listings.filter(l => l.type === "Place").length },
              { label: "Hotels", value: listings.filter(l => l.type === "Hotel").length },
              { label: "Reels", value: listings.filter(l => l.type === "Reel").length },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-amber-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick add buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {addLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm">
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                tab === t ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"
              }`}>{t}</button>
          ))}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No listings yet</h3>
            <p className="text-sm text-gray-400 mb-6">Add your first place, hotel, restaurant, or reel to get started.</p>
            <Link to="/seller/add/place" className="inline-block bg-amber-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors">
              Add your first listing
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {listing.imageUrl && (
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img src={listing.imageUrl} alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"; }}/>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{listing.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${typeColor[listing.type]}`}>{listing.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{listing.location} · {listing.category}</p>
                  {listing.price && <p className="text-sm font-bold text-emerald-600 mb-3">₹{parseInt(listing.price).toLocaleString()}</p>}
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">Added {listing.addedAt}</span>
                    <button onClick={() => deleteListing(listing.id, listing.type)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
