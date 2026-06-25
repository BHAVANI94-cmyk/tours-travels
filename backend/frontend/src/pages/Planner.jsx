import { useState } from "react";

const transportOptions = [
  { value: "train", label: "Train", icon: "🚂" },
  { value: "bus", label: "Bus", icon: "🚌" },
  { value: "car", label: "Self Drive / Cab", icon: "🚗" },
  { value: "flight", label: "Flight", icon: "✈️" },
  { value: "bike", label: "Bike / Scooter", icon: "🏍️" },
];

const interests = ["Temples", "Beaches", "Hill Stations", "Wildlife", "Food Tour", "Heritage", "Adventure", "Backwaters", "Shopping", "Photography"];

export default function Planner() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    days: 3,
    budget: 5000,
    people: 2,
    transport: "train",
    interests: [],
    accommodation: "mid-range",
  });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (i) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(i) ? prev.interests.filter((x) => x !== i) : [...prev.interests, i],
    }));

  const generatePlan = async () => {
    if (!form.from || !form.to) { setError("Please enter From and To destinations."); return; }
    setError("");
    setLoading(true);
    setPlan("");

    const prompt = `You are an expert South India travel planner. Create a detailed day-by-day trip itinerary with the following details:

From: ${form.from}
To / Destination: ${form.to}
Duration: ${form.days} days
Total Budget: ₹${form.budget.toLocaleString()} for ${form.people} person(s) (₹${Math.round(form.budget / form.people).toLocaleString()} per person)
Transport Mode: ${form.transport}
Accommodation: ${form.accommodation}
Interests: ${form.interests.length > 0 ? form.interests.join(", ") : "General sightseeing"}

Please provide:
1. A brief overview of the trip
2. Day-by-day itinerary with morning / afternoon / evening activities
3. Recommended places to eat each day (local specialties)
4. Accommodation suggestions matching the budget
5. Transport tips (routes, booking advice, estimated cost)
6. Total estimated cost breakdown (transport + food + stay + activities)
7. Packing tips and best time to visit advice
8. 3 insider tips that most tourists miss

Format clearly with headings and bullet points. Keep it practical, specific, and budget-conscious.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not found in .env file");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from Gemini. Please try again.");
      setPlan(text);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">AI Trip Planner</h1>
          <p className="text-purple-200 text-sm max-w-md mx-auto">
            Tell us your travel details — our AI builds a complete day-by-day itinerary with food, stay, transport & budget.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Form */}
          <div className="space-y-5">
            {/* From / To */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Trip Details</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">From (Starting point)</label>
                  <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
                    placeholder="e.g. Chennai" className="input-field"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">To (Destination)</label>
                  <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                    placeholder="e.g. Ooty" className="input-field"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Days: <span className="text-indigo-600 font-bold">{form.days}</span></label>
                    <input type="range" min={1} max={14} value={form.days} onChange={(e) => setForm({ ...form, days: +e.target.value })} className="w-full accent-indigo-500"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">People: <span className="text-indigo-600 font-bold">{form.people}</span></label>
                    <input type="range" min={1} max={10} value={form.people} onChange={(e) => setForm({ ...form, people: +e.target.value })} className="w-full accent-indigo-500"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Total Budget</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-extrabold text-indigo-600">₹{form.budget.toLocaleString()}</span>
                <span className="text-xs text-gray-400">≈ ₹{Math.round(form.budget / form.people).toLocaleString()} / person</span>
              </div>
              <input type="range" min={1000} max={100000} step={500} value={form.budget}
                onChange={(e) => setForm({ ...form, budget: +e.target.value })} className="w-full accent-indigo-500"/>
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹1,000</span><span>₹1,00,000</span></div>
            </div>

            {/* Transport */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Mode of Transport</p>
              <div className="grid grid-cols-5 gap-2">
                {transportOptions.map((t) => (
                  <button key={t.value} onClick={() => setForm({ ...form, transport: t.value })}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                      form.transport === t.value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-100 text-gray-500 hover:border-indigo-300"
                    }`}>
                    <span className="text-xl">{t.icon}</span>
                    {t.label.split(" / ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Accommodation Style</p>
              <div className="grid grid-cols-3 gap-2">
                {[["budget", "₹ Budget", "Hostels & lodges"], ["mid-range", "₹₹ Mid-range", "3-star hotels"], ["luxury", "₹₹₹ Luxury", "4-5 star / resorts"]].map(([v, label, sub]) => (
                  <button key={v} onClick={() => setForm({ ...form, accommodation: v })}
                    className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                      form.accommodation === v ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-indigo-300"
                    }`}>
                    <p className={`text-sm font-bold ${form.accommodation === v ? "text-indigo-700" : "text-gray-700"}`}>{label}</p>
                    <p className="text-[10px] text-gray-400">{sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Interests (optional)</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      form.interests.includes(i) ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                    }`}>{i}</button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button onClick={generatePlan} disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm active:scale-95">
              {loading ? "✨ Generating your trip plan..." : "✨ Generate My Trip Plan"}
            </button>
          </div>

          {/* RIGHT: Output */}
          <div>
            {!plan && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-4xl">🗺️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Your plan appears here</h3>
                <p className="text-sm text-gray-400 max-w-xs">Fill in the details on the left and click Generate — our AI builds a full itinerary in seconds.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin mb-6"/>
                <p className="text-gray-600 font-semibold">Building your perfect trip...</p>
                <p className="text-sm text-gray-400 mt-1">Crafting routes, food spots & budget breakdown</p>
              </div>
            )}

            {plan && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Plan header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Your AI-Generated Plan</p>
                  <h3 className="text-lg font-extrabold">{form.from} → {form.to}</h3>
                  <div className="flex gap-4 mt-2 text-xs opacity-80">
                    <span>{form.days} days · {form.people} people</span>
                    <span>₹{form.budget.toLocaleString()} budget</span>
                    <span>{transportOptions.find(t => t.value === form.transport)?.icon} {form.transport}</span>
                  </div>
                </div>

                {/* Plan content */}
                <div className="p-5 max-h-[600px] overflow-y-auto">
                  <div className="prose-travel whitespace-pre-wrap">
                    {plan}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <button onClick={() => { setPlan(""); setForm({ from: "", to: "", days: 3, budget: 5000, people: 2, transport: "train", interests: [], accommodation: "mid-range" }); }}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Start Over
                  </button>
                  <button onClick={generatePlan}
                    className="flex-1 py-2.5 bg-indigo-500 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors">
                    Regenerate
                  </button>
                  <button onClick={() => { const blob = new Blob([plan], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${form.from}-to-${form.to}-plan.txt`; a.click(); }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`.input-field { width: 100%; padding: 10px 14px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; outline: none; font-size: 14px; color: #374151; } .input-field:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }`}</style>
    </div>
  );
}
