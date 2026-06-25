import { useState, useMemo, useEffect } from "react";
import ReelCard from './ReelCard';

// Updated locations to match your places.js database
const reelData = [
  { id: 1, url: '/SivaTemple.mp4', location: 'Mahabalipuram', description: 'Shore temples of TN.', price: '1,500' },
  { id: 2, url: '/temple.mp4', location: 'Madurai', description: 'Architectural marvel.', price: '2,200' },
];

export default function ReelFeed() {
  const [filterMode, setFilterMode] = useState("all"); 
  const [likedList, setLikedList] = useState([]);
  const [savedList, setSavedList] = useState([]);

  // Centralized function to fetch fresh data from localStorage
  const refreshLists = () => {
    setLikedList(JSON.parse(localStorage.getItem("likedReels") || "[]"));
    setSavedList(JSON.parse(localStorage.getItem("savedReels") || "[]"));
  };

  // Run on initial mount and when filterMode changes
  useEffect(() => {
    refreshLists();
  }, [filterMode]);

  const filteredReels = useMemo(() => {
    if (filterMode === "all") return reelData;
    if (filterMode === "liked") return reelData.filter(r => likedList.some(l => l.location === r.location));
    if (filterMode === "saved") return reelData.filter(r => savedList.some(s => s.location === r.location));
    return reelData;
  }, [filterMode, likedList, savedList]);

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