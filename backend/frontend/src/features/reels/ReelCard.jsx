import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { places } from '../../data/places';
import { hotels } from '../../data/hotels';
import { restaurants } from '../../data/restaurants';

export default function ReelCard({ url, location, description, price }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [playing, setPlaying]   = useState(false);
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [muted, setMuted]       = useState(true);
  const [shared, setShared]     = useState(false);
  const [showPanel, setShowPanel] = useState(false); // bottom sheet

  // Find matching place by name
  const matchedPlace = places.find(p =>
    location.toLowerCase().includes(p.name.toLowerCase()) ||
    p.name.toLowerCase().includes(location.split(",")[0].toLowerCase())
  );

  const nearbyHotels = matchedPlace
    ? hotels.filter(h => h.placeId === matchedPlace.id).slice(0, 3)
    : [];

  const nearbyRests = matchedPlace
    ? restaurants.filter(r => r.placeId === matchedPlace.id).slice(0, 3)
    : [];

  useEffect(() => {
    const likedD = JSON.parse(localStorage.getItem("likedReels") || "[]");
    const savedD = JSON.parse(localStorage.getItem("savedReels") || "[]");
    setLiked(likedD.some(i => i.location === location));
    setSaved(savedD.some(i => i.location === location));
  }, [location]);

  const handleToggle = (key, state, setState) => {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (!state) {
      localStorage.setItem(key, JSON.stringify([...list, { url, location, description, price }]));
    } else {
      localStorage.setItem(key, JSON.stringify(list.filter(i => i.location !== location)));
    }
    setState(!state);
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: location, text: description, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); setShared(true); setTimeout(() => setShared(false), 2000); }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { videoRef.current?.play(); setPlaying(true); }
      else { videoRef.current?.pause(); setPlaying(false); setShowPanel(false); }
    }, { threshold: 0.7 });
    if (videoRef.current) obs.observe(videoRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="h-screen w-full snap-start flex justify-center bg-black relative">
      <div className="relative h-full aspect-[9/16] w-full max-w-[450px] overflow-hidden">

        {/* Video */}
        <video ref={videoRef} src={url} className="h-full w-full object-cover"
          loop muted={muted} playsInline onClick={togglePlay}/>

        {/* Play/pause overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 rounded-full p-5">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {/* Mute */}
        <button onClick={() => setMuted(!muted)}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 z-10">
          {muted
            ? <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" strokeLinecap="round"/></svg>
            : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round"/></svg>
          }
        </button>

        {/* Bottom gradient + info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 z-10">
          <h3 className="font-black text-lg text-white mb-0.5">{location}</h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Action buttons row */}
          <div className="flex gap-2">
            {/* Book Now — goes to PlaceDetails page */}
            <button
              onClick={() => matchedPlace ? navigate(`/place/${matchedPlace.id}`) : navigate("/explore")}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-sm px-4 py-3 rounded-2xl transition-all shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" strokeLinecap="round"/>
              </svg>
              Book Now
            </button>

            {/* Nearby stays & restaurants */}
            <button onClick={() => setShowPanel(true)}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-bold text-sm px-4 py-3 rounded-2xl transition-all border border-white/20">
              🏨 Nearby
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="absolute right-3 bottom-44 flex flex-col gap-5 items-center z-10">
          {/* Like */}
          <button onClick={() => handleToggle("likedReels", liked, setLiked)} className="flex flex-col items-center gap-1">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-125 ${liked ? "bg-red-500" : "bg-black/40 backdrop-blur-sm"}`}>
              <svg className="w-5 h-5 text-white" fill={liked ? "white" : "none"} stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[10px] text-white font-bold">Like</span>
          </button>

          {/* Save */}
          <button onClick={() => handleToggle("savedReels", saved, setSaved)} className="flex flex-col items-center gap-1">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-125 ${saved ? "bg-cyan-500" : "bg-black/40 backdrop-blur-sm"}`}>
              <svg className={`w-5 h-5 ${saved ? "fill-white stroke-white" : "fill-none stroke-white"}`} viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[10px] text-white font-bold">Save</span>
          </button>

          {/* Share */}
          <button onClick={handleShare} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-125 transition-all">
              {shared
                ? <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round"/></svg>
                : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round"/></svg>
              }
            </div>
            <span className="text-[10px] text-white font-bold">{shared ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* ── BOTTOM SHEET — Nearby Stays & Restaurants ────────────── */}
        {showPanel && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPanel(false)}/>

            {/* Sheet */}
            <div className="relative bg-white rounded-t-3xl max-h-[78%] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full"/>
              </div>

              <div className="px-5 pb-8 pt-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{location}</h3>
                    <p className="text-xs text-gray-400">Nearby stays & restaurants</p>
                  </div>
                  <button onClick={() => setShowPanel(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
                  </button>
                </div>

                {/* Explore place page */}
                {matchedPlace && (
                  <button onClick={() => navigate(`/place/${matchedPlace.id}`)}
                    className="w-full mb-5 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 group hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🗺️</span>
                      <div className="text-left">
                        <p className="text-sm font-black text-emerald-800">Explore {matchedPlace.name}</p>
                        <p className="text-xs text-emerald-600">See all hotels, restaurants & details</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}

                {/* Hotels */}
                {nearbyHotels.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">🏨 Nearby Stays</p>
                    <div className="space-y-3">
                      {nearbyHotels.map(h => (
                        <div key={h.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3 items-center">
                          <img src={h.image} alt={h.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=60"; }}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-800 truncate">{h.name}</p>
                            <p className="text-xs text-gray-400">{h.style} · ★ {h.rating}</p>
                            <p className="text-sm font-black text-emerald-600 mt-0.5">₹{h.price.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/night</span></p>
                          </div>
                          <button
                            onClick={() => navigate(`/place/${matchedPlace?.id}`)}
                            className={`text-xs font-black px-3 py-2 rounded-xl flex-shrink-0 ${h.available ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"} transition-colors`}
                            disabled={!h.available}>
                            {h.available ? "Book" : "Full"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restaurants */}
                {nearbyRests.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">🍽️ Nearby Restaurants</p>
                    <div className="space-y-3">
                      {nearbyRests.map(r => (
                        <div key={r.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3 items-center">
                          <img src={r.image} alt={r.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            onError={e => { e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=60"; }}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-800 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.cuisine} · ★ {r.rating}</p>
                            <p className="text-xs text-gray-500 mt-0.5">₹{r.priceFor2} for 2 · {r.type}</p>
                          </div>
                          <a href={`tel:${r.contact}`}
                            className="text-xs font-black px-3 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0">
                            Call
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No match fallback */}
                {!matchedPlace && (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">🗺️</p>
                    <p className="text-gray-500 text-sm mb-1">No exact match found for this location.</p>
                    <button onClick={() => navigate("/explore")}
                      className="mt-3 bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                      Browse All Destinations
                    </button>
                  </div>
                )}

                {/* If no hotels or restaurants but place found */}
                {matchedPlace && nearbyHotels.length === 0 && nearbyRests.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <p>No listings yet for this place.</p>
                    <button onClick={() => navigate(`/place/${matchedPlace.id}`)}
                      className="mt-3 text-emerald-600 font-bold hover:underline text-sm">
                      View place details →
                    </button>
                  </div>
                )}

                {/* Not interested */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 text-center mb-3">Not interested in booking?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowPanel(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                      Keep Watching
                    </button>
                    <button onClick={() => navigate("/planner")}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-black rounded-xl hover:opacity-90 transition-all">
                      ✨ Plan Trip Instead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}