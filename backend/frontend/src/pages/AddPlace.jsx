import { useState } from "react";

export default function AddPlace() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "Heritage",
    imageUrl: "",
    description: "",
    sellerId: "SELL_9981" // Hardcoded for now to show logic
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending to Backend Team:", formData);
    alert("Place sent for verification!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-xl mx-auto glass-p2 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-black text-gradient-p2 mb-2">Host a Place</h2>
        <p className="text-slate-400 mb-8 text-sm">Add your destination to the WanderIndia network.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Destination Name</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none transition-all"
              placeholder="e.g. Ooty Tea Garden"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Heritage</option>
                <option>Nature</option>
                <option>Spiritual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Image URL</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none"
                placeholder="Paste link here"
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 focus:border-cyan-500 outline-none"
              placeholder="Describe the beauty of this place..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl font-black text-[#020617] uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
          >
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
}
