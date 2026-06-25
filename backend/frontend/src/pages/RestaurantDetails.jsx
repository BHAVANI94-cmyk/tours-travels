import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { places } from "../data/places";

const MENU = {
  1:[{name:"Cheese Fondue",price:350,tag:"Signature"},{name:"Pasta Arrabiata",price:280,tag:"Popular"},{name:"Hot Chocolate",price:120,tag:"Must Try"}],
  2:[{name:"Mutton Biryani",price:220,tag:"Signature"},{name:"Haleem",price:160,tag:"Popular"},{name:"Sheer Khurma",price:80,tag:"Dessert"}],
  3:[{name:"Ooty Chocolate",price:150,tag:"Signature"},{name:"Nilgiri Tea",price:60,tag:"Must Try"},{name:"Jam Toast",price:80,tag:"Breakfast"}],
  4:[{name:"Masala Dosa",price:80,tag:"Signature"},{name:"Filter Coffee",price:40,tag:"Must Try"},{name:"Idli Set",price:60,tag:"Popular"}],
  5:[{name:"Kerala Fish Curry",price:180,tag:"Signature"},{name:"Appam",price:60,tag:"Popular"},{name:"Prawn Masala",price:220,tag:"Bestseller"}],
  6:[{name:"Karimeen Pollichathu",price:450,tag:"Signature"},{name:"Prawn Curry",price:380,tag:"Popular"},{name:"Fish Molee",price:280,tag:"Local"}],
  7:[{name:"Fish Molee",price:220,tag:"Signature"},{name:"Sadya Meals",price:180,tag:"Popular"},{name:"Payasam",price:80,tag:"Dessert"}],
  8:[{name:"Croque Monsieur",price:320,tag:"Signature"},{name:"French Crepes",price:180,tag:"Popular"},{name:"Cafe au Lait",price:140,tag:"Must Try"}],
  9:[{name:"Thali Meals",price:120,tag:"Popular"},{name:"Idli Sambar",price:70,tag:"Breakfast"},{name:"Filter Coffee",price:35,tag:"Must Try"}],
  10:[{name:"Pandi Curry",price:280,tag:"Signature"},{name:"Kadambuttu",price:80,tag:"Local"},{name:"Coorg Wine",price:200,tag:"Special"}],
  11:[{name:"Mutton Kari Parotta",price:180,tag:"Signature"},{name:"Kola Urundai",price:120,tag:"Popular"},{name:"Jigarthanda",price:60,tag:"Must Try"}],
  12:[{name:"Chettinad Chicken",price:220,tag:"Signature"},{name:"Seeraga Samba Rice",price:140,tag:"Popular"},{name:"Kavuni Arisi Payasam",price:80,tag:"Dessert"}],
  13:[{name:"Grilled Fish",price:380,tag:"Signature"},{name:"Fresh Juice",price:120,tag:"Popular"},{name:"Prawn Fry",price:320,tag:"Bestseller"}],
  14:[{name:"Waffles",price:220,tag:"Signature"},{name:"Fresh Pasta",price:260,tag:"Popular"},{name:"Espresso",price:120,tag:"Must Try"}],
  15:[{name:"Idli Vada",price:60,tag:"Popular"},{name:"Prasadam Meals",price:100,tag:"Special"},{name:"Coconut Chutney",price:20,tag:"Free"}],
};

const TAG_COLORS = { Signature:"bg-red-100 text-red-700", Popular:"bg-blue-100 text-blue-700", "Must Try":"bg-amber-100 text-amber-700", Bestseller:"bg-purple-100 text-purple-700", Dessert:"bg-pink-100 text-pink-700", Breakfast:"bg-green-100 text-green-700", Special:"bg-indigo-100 text-indigo-700", Local:"bg-emerald-100 text-emerald-700", Free:"bg-gray-100 text-gray-600" };
const TYPE_COLOR = { Cafe:"bg-amber-100 text-amber-700", Restaurant:"bg-blue-100 text-blue-700", "Fine Dining":"bg-purple-100 text-purple-700" };

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = restaurants.find(x => x.id === parseInt(id));
  const place = places.find(p => p.id === r?.placeId);
  const menu = MENU[parseInt(id)] || [];
  const [imgErr, setImgErr] = useState(false);

  if (!r) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><p className="text-5xl mb-4">🍽️</p><h2 className="text-xl font-bold text-gray-700 mb-4">Restaurant not found</h2>
        <button onClick={() => navigate("/dining")} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold">Browse Restaurants</button></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gray-200">
        <img src={imgErr?"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200":r.image}
          alt={r.name} onError={() => setImgErr(true)} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"/>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-black/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" strokeLinecap="round"/></svg>Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${TYPE_COLOR[r.type]||"bg-gray-100 text-gray-600"}`}>{r.type}</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{r.cuisine}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">{r.name}</h1>
            <p className="text-white/70 text-sm mt-1">📍 {r.placeName} · {r.distance}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2 space-y-7">
            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                <span className="font-black text-amber-700">{r.rating}</span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">🕐 {r.hours}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">₹{r.priceFor2} for 2</span>
              {place && <Link to={`/place/${place.id}`} className="text-sm text-amber-600 hover:underline font-semibold">📍 View {place.name} →</Link>}
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-3">About</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {r.name} is a {r.type.toLowerCase()} in {r.placeName} specialising in {r.cuisine} cuisine. Signature dishes include <strong>{r.specialty}</strong>. Located {r.distance} from the town centre and open {r.hours}.
              </p>
            </div>

            {/* Menu */}
            {menu.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-800 mb-3">🍽️ Menu Highlights</h2>
                <div className="space-y-3">
                  {menu.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-lg">🍴</div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{item.name}</p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag]||"bg-gray-100 text-gray-600"}`}>{item.tag}</span>
                        </div>
                      </div>
                      <p className="font-black text-gray-800">₹{item.price}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">* Prices are approximate. Contact restaurant for full menu.</p>
              </div>
            )}

            {/* Dos and Donts */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <h3 className="font-black text-emerald-700 mb-3">✅ Good to know</h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  {["Call ahead to reserve on weekends","Try the signature dish first","Mention dietary restrictions when booking","Visit during off-peak hours for best service"].map((d,i) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h3 className="font-black text-red-600 mb-3">❌ Avoid</h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  {["Don't arrive at closing time","No outside food allowed","Avoid rush hours (1–2 PM, 8–9 PM)","Don't skip the house special"].map((d,i) => (
                    <li key={i} className="flex gap-2"><span className="text-red-400">•</span>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-6 py-5 text-white">
                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">Price for 2</p>
                <p className="text-4xl font-black">₹{r.priceFor2}</p>
                <p className="text-amber-200 text-xs mt-1">Approx. including taxes</p>
              </div>
              <div className="p-5 space-y-3">
                <a href={`tel:${r.contact}`} className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-md active:scale-95 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 2.81h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round"/></svg>
                  Call to Reserve
                </a>
                {place && <Link to={`/nearby/${place.id}`} className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-50">🏨 Nearby Hotels</Link>}
                {place && <Link to={`/place/${place.id}`} className="flex items-center justify-center gap-2 w-full py-3 border border-amber-200 text-amber-600 font-bold rounded-2xl text-sm hover:bg-amber-50">📍 Explore {place.name}</Link>}
              </div>
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Info</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  {[["Cuisine",r.cuisine],["Type",r.type],["Hours",r.hours],["Distance",r.distance],["Rating",`★ ${r.rating}`],["Contact",r.contact]].map(([k,v]) => (
                    <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span>
                      {k==="Contact" ? <a href={`tel:${v}`} className="font-semibold text-amber-600 hover:underline">{v}</a> : <span className="font-semibold">{v}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
