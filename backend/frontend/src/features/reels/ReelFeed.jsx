import { useState, useMemo, useEffect } from "react";
import ReelCard from './ReelCard';
import { reelsAPI } from "../../services/api";

// Expanded default reels matching places.js destinations
const reelData = [
  { id: 1, url: '/SivaTemple.mp4', location: 'Mahabalipuram', description: 'Explore the 7th-century rock-cut Dravidian Shore Temple. UNESCO World Heritage Site.', price: '1,500' },
  { id: 2, url: '/temple.mp4', location: 'Madurai', description: 'Witness the gorgeous architecture and towering gopurams of Meenakshi Amman Temple in Madurai.', price: '2,200' },
  { id: 3, url: '/SivaTemple.mp4', location: 'Munnar', description: 'Breathtaking rolling green tea estates and mist-covered valleys of Munnar.', price: '4,200' },
  { id: 4, url: '/temple.mp4', location: 'Alleppey', description: 'Relaxing overnight houseboat cruise on the serene emerald backwaters of Kerala.', price: '5,500' },
  { id: 5, url: '/SivaTemple.mp4', location: 'Rameswaram', description: 'Drive along the spectacular Pamban Bridge to the sacred island town of Rameswaram.', price: '2,000' },
  { id: 6, url: '/temple.mp4', location: 'Ooty', description: 'Riding the famous UNESCO Heritage Nilgiri Mountain Railway toy train through Ooty.', price: '3,500' },
  { id: 7, url: '/SivaTemple.mp4', location: 'Kodaikanal', description: 'Stunning viewpoints, cycling paths, and silent pine forests of Kodaikanal.', price: '2,800' },
  { id: 8, url: '/temple.mp4', location: 'Coorg', description: 'Discover beautiful coffee estates and Abbey Falls in the hills of Coorg.', price: '5,000' }
];

export default function ReelFeed() {
  const [filterMode, setFilterMode] = useState("all"); 
  const [likedList, setLikedList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [dbReels, setDbReels] = useState([]);

  // Centralized function to fetch fresh data from localStorage
  const refreshLists = () => {
    setLikedList(JSON.parse(localStorage.getItem("likedReels") || "[]"));
    setSavedList(JSON.parse(localStorage.getItem("savedReels") || "[]"));
  };

  // Run on initial mount and when filterMode changes
  useEffect(() => {
    refreshLists();
  }, [filterMode]);

  // Fetch db reels on mount
  useEffect(() => {
    let active = true;
    reelsAPI.getAll()
      .then(res => {
        if (active) setDbReels(res || []);
      })
      .catch(err => console.error("Error fetching database reels:", err));
    return () => { active = false; };
  }, []);

  const allReels = useMemo(() => {
    const dbMapped = dbReels.map((r, index) => ({
      id: r._id || `db-${index}`,
      url: r.url.startsWith("http") ? r.url : (r.url.startsWith("/") ? r.url : `/${r.url}`),
      location: r.location || "Unknown Location",
      description: r.description || "",
      price: r.price || "N/A"
    }));
    // Filter out duplicates (if db reel has same url as a default reel)
    const uniqueDbMapped = dbMapped.filter(
      dbR => !reelData.some(def => def.url === dbR.url && def.location.toLowerCase() === dbR.location.toLowerCase())
    );
    return [...reelData, ...uniqueDbMapped];
  }, [dbReels]);

  const filteredReels = useMemo(() => {
    let list = allReels;
    if (filterMode === "liked") {
      list = allReels.filter(r => likedList.some(l => l.location.toLowerCase() === r.location.toLowerCase()));
    } else if (filterMode === "saved") {
      list = allReels.filter(r => savedList.some(s => s.location.toLowerCase() === r.location.toLowerCase()));
    }
    return list;
  }, [filterMode, allReels, likedList, savedList]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      
      {/* MASTER FILTER ICONS */}
      <div className="absolute top-20 left-0 right-0 z-50 flex justify-center gap-4">
        <button 
          onClick={() => setFilterMode("all")}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all border ${
            filterMode === 'all' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/20 backdrop-blur-md'
          }`}
        >
          FOR YOU
        </button>
        <button 
          onClick={() => setFilterMode("liked")}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all border ${
            filterMode === 'liked' ? 'bg-red-500 text-white border-red-500' : 'bg-black/40 text-white border-white/20 backdrop-blur-md'
          }`}
        >
          ❤️ LIKED
        </button>
        <button 
          onClick={() => setFilterMode("saved")}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all border ${
            filterMode === 'saved' ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-black/40 text-white border-white/20 backdrop-blur-md'
          }`}
        >
          🔖 SAVED
        </button>
      </div>

      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {filteredReels.length > 0 ? (
          filteredReels.map((reel) => (
            <ReelCard 
              key={reel.id} 
              {...reel} 
              onRefresh={refreshLists} // Passing the refresh trigger to the card
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40">
            <p className="text-xl font-bold">No {filterMode} reels yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}