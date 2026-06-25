import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI, hotelsAPI, restaurantsAPI, placesAPI, reelsAPI } from "../services/api";

const SECTIONS = ["Analytics", "Users & Sellers", "All Listings", "Platform Bookings"];

export default function AdminDashboard() {
  const { user, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);

  // Filter states
  const [userSearch, setUserSearch] = useState("");
  const [listingFilter, setListingFilter] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsData, usersData, bookingsData, hotelsList, restaurantsList, toursList, reelsList] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getBookings(),
        hotelsAPI.getAll().catch(() => []),
        restaurantsAPI.getAll().catch(() => []),
        placesAPI.getAll().catch(() => []),
        reelsAPI.getAll().catch(() => [])
      ]);

      setAnalytics(analyticsData);
      setUsers(usersData);
      setBookings(bookingsData);

      // Combine listings for global management
      const combinedListings = [
        ...toursList.map(t => ({ id: t._id || t.id, title: t.name, type: "Place", location: t.location, price: t.price, image: t.image, createdBy: t.createdBy })),
        ...hotelsList.map(h => ({ id: h._id || h.id, title: h.name, type: "Hotel", location: h.placeName || h.location, price: h.price, image: h.image, createdBy: h.createdBy })),
        ...restaurantsList.map(r => ({ id: r._id || r.id, title: r.name, type: "Restaurant", location: r.placeName || r.location, price: r.priceFor2, image: r.image, createdBy: r.createdBy })),
        ...reelsList.map(rl => ({ id: rl._id, title: rl.description || "Reel by Seller", type: "Reel", location: rl.location || "N/A", price: rl.price || 0, image: rl.url, createdBy: rl.createdBy }))
      ];
      setListings(combinedListings);

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [isLoggedIn, role, navigate]);

  // Actions
  const handleApproveSeller = async (userId) => {
    try {
      await adminAPI.approveSeller(userId);
      alert("Seller approved successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to approve seller: " + err.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminAPI.changeUserRole(userId, newRole);
      alert(`User role updated to ${newRole}`);
      fetchData();
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their listings might be orphaned.")) return;
    try {
      await adminAPI.deleteUser(userId);
      alert("User deleted successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await adminAPI.cancelBooking(bookingId);
      alert("Booking cancelled successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking history?")) return;
    try {
      await adminAPI.deleteBooking(bookingId);
      alert("Booking deleted successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to delete booking: " + err.message);
    }
  };

  const handleDeleteListing = async (id, type) => {
    if (!window.confirm(`Are you sure you want to remove this ${type.toLowerCase()} from the platform?`)) return;
    try {
      if (type === "Place") await placesAPI.delete(id);
      else if (type === "Hotel") await hotelsAPI.delete(id);
      else if (type === "Restaurant") await restaurantsAPI.delete(id);
      else if (type === "Reel") await reelsAPI.delete(id);
      alert(`${type} removed successfully!`);
      fetchData();
    } catch (err) {
      alert(`Failed to remove ${type.toLowerCase()}: ` + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p className="text-gray-500 font-bold text-sm">Loading Administration Console...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = listingFilter === "All" 
    ? listings 
    : listings.filter(l => l.type === listingFilter);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 text-white py-12 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">
              Admin Area
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">Wander India Control Panel</h1>
            <p className="text-gray-300 text-sm mt-1">Manage users, approve sellers, track global bookings, and analyze platform performance.</p>
          </div>
          <button onClick={fetchData} className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm font-semibold text-rose-600 flex items-center gap-3">
            ⚠️ {error}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-6 mb-8">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex-shrink-0 ${
                activeSection === sec
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* ANALYTICS SECTION */}
        {/* ========================================================================= */}
        {activeSection === "Analytics" && analytics && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
                <div>
                  <h3 className="text-3xl font-black text-gray-800">{analytics.metrics.totalUsers}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Sellers: {analytics.metrics.totalSellers}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Bookings</span>
                <div>
                  <h3 className="text-3xl font-black text-gray-800">{analytics.metrics.totalBookings}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Pending + Confirmed</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Sales</span>
                <div>
                  <h3 className="text-3xl font-black text-emerald-600">₹{analytics.metrics.totalRevenue.toLocaleString()}</h3>
                  <p className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Confirmed Only</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Listings</span>
                <div>
                  <h3 className="text-3xl font-black text-gray-800">{analytics.metrics.listings.total}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Hotels, package tours, dining</p>
                </div>
              </div>
            </div>

            {/* Custom SVG Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Listings Share chart */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-extrabold text-gray-800 mb-4">Listings Distribution</h3>
                <div className="flex flex-col md:flex-row items-center gap-6 justify-around">
                  {/* Custom SVG Donut Chart */}
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3"/>
                    {/* Hotels Share */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3"
                      strokeDasharray={`${(analytics.metrics.listings.hotels / (analytics.metrics.listings.total || 1)) * 100} ${100 - (analytics.metrics.listings.hotels / (analytics.metrics.listings.total || 1)) * 100}`}
                      strokeDashoffset="100"/>
                    {/* Tours Share */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3"
                      strokeDasharray={`${(analytics.metrics.listings.tours / (analytics.metrics.listings.total || 1)) * 100} ${100 - (analytics.metrics.listings.tours / (analytics.metrics.listings.total || 1)) * 100}`}
                      strokeDashoffset={`${100 - (analytics.metrics.listings.hotels / (analytics.metrics.listings.total || 1)) * 100}`}/>
                    {/* Restaurants Share */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${(analytics.metrics.listings.restaurants / (analytics.metrics.listings.total || 1)) * 100} ${100 - (analytics.metrics.listings.restaurants / (analytics.metrics.listings.total || 1)) * 100}`}
                      strokeDashoffset={`${100 - ((analytics.metrics.listings.hotels + analytics.metrics.listings.tours) / (analytics.metrics.listings.total || 1)) * 100}`}/>
                  </svg>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-bold">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"/>
                      Stays (Hotels): {analytics.metrics.listings.hotels}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-bold">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full"/>
                      Tours (Packages): {analytics.metrics.listings.tours}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-bold">
                      <span className="w-3 h-3 bg-amber-500 rounded-full"/>
                      Dining (Places): {analytics.metrics.listings.restaurants}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-bold">
                      <span className="w-3 h-3 bg-pink-500 rounded-full"/>
                      Short Reels: {analytics.metrics.listings.reels}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown Bar chart */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-extrabold text-gray-800 mb-4">Bookings Status</h3>
                <div className="space-y-4 pt-2">
                  {analytics.bookingsByStatus.map((item) => {
                    const percentage = (item.count / (analytics.metrics.totalBookings || 1)) * 100;
                    const barColor = item._id === "confirmed" ? "bg-emerald-500" : item._id === "cancelled" ? "bg-rose-500" : "bg-amber-500";
                    return (
                      <div key={item._id} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600 font-bold uppercase">
                          <span>{item._id}</span>
                          <span>{item.count} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}/>
                        </div>
                      </div>
                    );
                  })}
                  {analytics.bookingsByStatus.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">No booking status recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-base font-extrabold text-gray-800">Recent Booking Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Item</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentBookings.map((b) => (
                      <tr key={b._id} className="border-b border-gray-50 text-xs text-gray-600 font-medium hover:bg-gray-50/50">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{b.userName}</p>
                          <p className="text-[10px] text-gray-400">{b.userEmail}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-700">{b.itemName}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase font-bold">{b.itemType}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-800">₹{b.total?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : b.status === "cancelled" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600"
                          }`}>{b.status}</span>
                        </td>
                        <td className="p-4 text-[10px] text-gray-400">
                          {b.checkIn} – {b.checkOut}
                        </td>
                      </tr>
                    ))}
                    {analytics.recentBookings.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-xs text-gray-400">No bookings found on the platform.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* USERS & SELLERS SECTION */}
        {/* ========================================================================= */}
        {activeSection === "Users & Sellers" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            {/* Users list */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-gray-50 text-xs text-gray-600 font-medium hover:bg-gray-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            onError={e => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"; }}/>
                          <div>
                            <p className="font-bold text-gray-800">{u.name}</p>
                            {u.role === "seller" && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                u.isApprovedSeller ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 animate-pulse"
                              }`}>{u.isApprovedSeller ? "✓ Approved Seller" : "⌛ Approval Pending"}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-700">{u.email}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-600 outline-none focus:ring-2 focus:ring-emerald-300"
                          >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-4 text-gray-400 text-[10px]">{u.joinedAt}</td>
                        <td className="p-4 text-right space-x-2">
                          {u.role === "seller" && !u.isApprovedSeller && (
                            <button
                              onClick={() => handleApproveSeller(u._id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-sm"
                            >
                              Approve
                            </button>
                          )}
                          {u._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-xs text-gray-400">No users match your criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ALL LISTINGS SECTION */}
        {/* ========================================================================= */}
        {activeSection === "All Listings" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type Filter:</span>
              <div className="flex gap-2">
                {["All", "Place", "Hotel", "Restaurant", "Reel"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setListingFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                      listingFilter === t
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition-all">
                  <img
                    src={item.image}
                    alt=""
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 bg-gray-50 border border-gray-100"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.type === "Place" ? "bg-emerald-50 text-emerald-600" :
                        item.type === "Hotel" ? "bg-blue-50 text-blue-600" :
                        item.type === "Restaurant" ? "bg-amber-50 text-amber-600" : "bg-pink-50 text-pink-600"
                      }`}>{item.type}</span>
                      <span className="text-[10px] text-gray-400 truncate">📍 {item.location}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-800 truncate">{item.title}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1">₹{item.price?.toLocaleString()} {item.type === "Hotel" ? "/ night" : ""}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteListing(item.id, item.type)}
                    className="flex-shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 p-2.5 rounded-2xl transition-all"
                    title="Remove Listing"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-full py-16 bg-white rounded-3xl border border-gray-100 text-center text-xs text-gray-400">
                  No listings found for the selected filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PLATFORM BOOKINGS SECTION */}
        {/* ========================================================================= */}
        {activeSection === "Platform Bookings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="p-4">Booking Details</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Price Detail</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b border-gray-50 text-xs text-gray-600 font-medium hover:bg-gray-50/50">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{b.itemName}</p>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">{b.itemType}</span>
                            <span className="text-[10px] text-gray-400">{b.checkIn} to {b.checkOut}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-700">{b.userName}</p>
                          <p className="text-[10px] text-gray-400">📞 {b.userPhone || "N/A"}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-black text-gray-800">₹{b.total?.toLocaleString()}</p>
                          <p className="text-[9px] text-gray-400">{b.nights} night{b.nights > 1 ? "s" : ""} · {b.persons} guest{b.persons > 1 ? "s" : ""}</p>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : b.status === "cancelled" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600"
                          }`}>{b.status}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {b.status !== "cancelled" && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b._id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-xs text-gray-400">No bookings recorded on the platform.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
