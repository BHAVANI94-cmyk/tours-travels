import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SavedReels() {
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedReels") || "[]");
    setSavedItems(data);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-cyan-400">Saved Gems</h1>
            <p className="text-slate-500 mt-2">Your curated collection of Indian wonders.</p>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-bold"
          >
            ← Home
          </button>
        </header>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedItems.map((item, index) => (
              <div key={index} className="glass-p2 rounded-[2.5rem] overflow-hidden border border-white/5 group bg-white/5 shadow-2xl">
                <div className="relative h-64 bg-black">
                  {/* The Video Engine */}
                  <video 
                    src={item.videoUrl} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-cyan-400">
                    REEL
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{item.location}</h3>
                  <p className="text-cyan-400 font-black text-lg">₹{item.price}</p>
                  <button className="mt-4 w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500 hover:text-black transition-all text-xs font-black">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-600 italic font-medium mb-4">Your collection is empty.</p>
            <button onClick={() => navigate("/reels")} className="text-cyan-400 font-bold hover:underline">Explore Reels now →</button>
          </div>
        )}
      </div>
    </div>
  );
}