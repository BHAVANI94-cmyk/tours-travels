import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import FilterPanel from "../components/search/FilterPanel";
import PlaceGrid from "../features/places/PlaceGrid";
import { useFilter } from "../hooks/useFilter";

export default function Explore() {
  const { filters, onFilterChange, filtered } = useFilter();
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [searchParams] = useSearchParams();

  // ── Read URL params from homepage clicks ──────────────────────
  // When user clicks a category or searches from the homepage,
  // we read ?search= or ?category= and apply the filter automatically
  useEffect(() => {
    const searchQ = searchParams.get("search");
    const categoryQ = searchParams.get("category");
    if (searchQ) onFilterChange("search", searchQ);
    if (categoryQ) onFilterChange("category", categoryQ);
  }, []); // runs once on mount

  // This logic runs whenever 'filtered' changes or 'showLikedOnly' is toggled
  const finalDisplayList = useMemo(() => {
    if (!showLikedOnly) return filtered;

    // Pull the fresh list of names from storage
    const savedData = JSON.parse(localStorage.getItem("savedReels") || "[]");
    const savedNames = savedData.map(item => item.location);

    // Filter the current view to only include names that are in our saved list
    return filtered.filter(place => savedNames.includes(place.name));
  }, [filtered, showLikedOnly]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
            Explore <span className="text-emerald-200">Destinations</span>
          </h1>

          <div className="max-w-2xl flex gap-3">
            <div className="flex-1">
              <SearchBar value={filters.search} onChange={(val) => onFilterChange("search", val)} />
            </div>
            
            {/* THIS IS THE ICON BUTTON YOU CLICKED */}
            <button
              onClick={() => setShowLikedOnly(!showLikedOnly)}
              className={`px-6 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg border-2 ${
                showLikedOnly 
                ? "bg-red-500 border-red-400 text-white" 
                : "bg-white border-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg 
                className={`w-5 h-5 ${showLikedOnly ? "fill-current" : ""}`} 
                viewBox="0 0 24 24" stroke="currentColor" fill="none"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2.5" />
              </svg>
              {showLikedOnly ? "Liked" : "Show Liked"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block">
            <FilterPanel filters={filters} onFilterChange={onFilterChange} resultCount={finalDisplayList.length} />
          </div>
          <div className="flex-1">
            {/* The Grid now dynamically updates based on the toggle state */}
            {/* Feed promo card - only shown when no filters active */}
          {!filters.search && filters.category === "All" && filters.location === "All" && (
            <FeedPromoCard />
          )}
          <PlaceGrid places={finalDisplayList} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedPromoCard() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/feed")}
      className="mb-5 rounded-2xl overflow-hidden relative h-36 cursor-pointer group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-60"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(236,72,153,0.6), rgba(6,182,212,0.5))" }}/>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">New</span>
            <span className="text-white/60 text-xs">Discover differently</span>
          </div>
          <h3 className="text-white font-black text-xl leading-tight">Watch Travel Reels</h3>
          <p className="text-white/70 text-xs mt-1">Short videos of real destinations — like, save & book</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mini reel previews */}
          <div className="flex gap-1.5">
            {["https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&q=60",
              "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=100&q=60",
              "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&q=60"
            ].map((img, i) => (
              <div key={i} className={`rounded-xl overflow-hidden border-2 border-white/30 flex-shrink-0 ${i === 1 ? "w-14 h-20" : "w-10 h-16 opacity-60"}`}>
                <img src={img} alt="" className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>

          <div className="bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-xl group-hover:bg-emerald-400 group-hover:text-white transition-colors whitespace-nowrap shadow-lg">
            Open Feed →
          </div>
        </div>
      </div>
    </div>
  );
}