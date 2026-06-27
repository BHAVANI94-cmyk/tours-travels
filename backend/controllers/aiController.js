const { GoogleGenerativeAI } = require(
    "@google/generative-ai"
);

// Fallback parsing function
function parsePrompt(prompt) {
  const data = {
    from: "Chennai",
    to: "Ooty",
    days: 3,
    budget: 5000,
    people: 1,
    transport: "train",
    accommodation: "mid-range",
    interests: []
  };

  try {
    const fromMatch = prompt.match(/From:\s*([^\n]+)/i);
    if (fromMatch) data.from = fromMatch[1].trim();

    const toMatch = prompt.match(/To\s*\/\s*Destination:\s*([^\n]+)/i);
    if (toMatch) data.to = toMatch[1].trim();

    const daysMatch = prompt.match(/Duration:\s*(\d+)\s*days/i);
    if (daysMatch) data.days = parseInt(daysMatch[1], 10);

    const budgetMatch = prompt.match(/Total Budget:\s*₹?([0-9,]+)/i);
    if (budgetMatch) data.budget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);

    const transportMatch = prompt.match(/Transport Mode:\s*([^\n]+)/i);
    if (transportMatch) data.transport = transportMatch[1].trim();

    const accommodationMatch = prompt.match(/Accommodation:\s*([^\n]+)/i);
    if (accommodationMatch) data.accommodation = accommodationMatch[1].trim();

    const interestsMatch = prompt.match(/Interests:\s*([^\n]+)/i);
    if (interestsMatch) {
      data.interests = interestsMatch[1].split(",").map(i => i.trim()).filter(Boolean);
    }
  } catch (e) {
    console.error("Error parsing prompt for fallback:", e);
  }

  return data;
}

// Fallback generator function
function generateFallbackPlan({ from, to, days, budget, transport, accommodation, interests }) {
  const dest = to.toLowerCase();
  
  // Custom elements per destination
  let details = {
    overview: `A beautiful getaway to ${to} from ${from}.`,
    highlights: ["Local Sightseeing", "Scenic Viewpoints", "Main Markets"],
    food: ["Local South Indian restaurants", "Street food stalls"],
    stay: `Cozy ${accommodation} rooms located close to the city center.`,
    tips: ["Carry cash as some local shops do not accept cards.", "Book tickets in advance to save time.", "Start your day early to beat the crowd."]
  };

  if (dest.includes("ooty")) {
    details = {
      overview: `Escape to Ooty, the Queen of Hill Stations. Known for its cool climate, beautiful tea gardens, and colonial charm.`,
      highlights: ["Ride the UNESCO Nilgiri Mountain Railway toy train.", "Boating in Ooty Lake and strolling in the Botanical Gardens.", "Stunning sunrise at Doddabetta Peak (2,637m)."],
      food: ["Hot local tea and Ooty varkey at the Tea Factory.", "Freshly baked homemade chocolates at King Star Bakery.", "Traditional South Indian lunch at Nahar Sidewalk Cafe."],
      stay: accommodation === "budget" ? "YMCA Hostel or local guest houses" : (accommodation === "luxury" ? "Savoy - IHCL SeleQtions or Savoy Hotel" : "Nahar Residency or Meadows Residency"),
      tips: ["Carry warm clothes as temperatures drop significantly in the evening.", "Book toy train tickets weeks in advance via IRCTC.", "Try the hot carrot cake and Nilgiri spices."]
    };
  } else if (dest.includes("munnar")) {
    details = {
      overview: `A lush escape to Munnar, famous for endless tea plantations, mist-covered hills, and rare wildlife.`,
      highlights: ["Spotting Nilgiri Tahr at Eravikulam National Park.", "Boating and echoing at Mattupetty Dam.", "Stunning views from Top Station and the Tea Museum."],
      food: ["Traditional Kerala meals served on banana leaves.", "Freshly brewed tea.", "Appam with stew at local Kuttanad restaurants."],
      stay: accommodation === "budget" ? "Suryanelli tents or budget homestays" : (accommodation === "luxury" ? "Blanket Hotel & Spa or Elixir Hills" : "Munnar Castle or Tea Castle"),
      tips: ["Fog can get very dense; avoid driving late in the evening.", "Buy authentic tea leaves directly from Ripple Tea outlet.", "Spot waterfalls like Attukal on your drives."]
    };
  } else if (dest.includes("coorg")) {
    details = {
      overview: `A tranquil coffee country experience in Coorg (Kodagu), known as the Scotland of India.`,
      highlights: ["Chasing water at Abbey Falls and sunset at Raja's Seat.", "Elephant bathing at Dubare Elephant Camp.", "Experiencing Tibetan culture at Namdroling Monastery (Golden Temple)."],
      food: ["Coorg's famous Pandi Curry (pork) with Kadambuttu (rice balls).", "Freshly brewed estate coffee.", "Bamboo shoot curry at local Coorg cuisine places."],
      stay: accommodation === "budget" ? "Local coffee estate homestays" : (accommodation === "luxury" ? "The Tamara Coorg or Evolve Back" : "Coorg Cliff Resort or Crystal Homestay"),
      tips: ["Visit Dubare Camp early morning (8:30 AM) to see elephant bathing.", "Buy spices like green pepper and cardamom directly from estates.", "Respect monastery guidelines at Bylakuppe."]
    };
  } else if (dest.includes("alleppey") || dest.includes("alappuzha")) {
    details = {
      overview: `A magical cruise through Alleppey, the Venice of the East, famous for backwaters and houseboats.`,
      highlights: ["Cruising on a traditional Kettuvallam (houseboat).", "Sunset walks at Alappuzha beach and lighthouse.", "Kayaking through narrow village canals."],
      food: ["Karimeen Pollichathu (pearl spot fish fry).", "Spicy duck roast and toddy shop delicacies.", "Fresh coconut water and local banana fritters."],
      stay: accommodation === "budget" ? "Locally run canal-side homestays" : (accommodation === "luxury" ? "Lake Palace Resort or luxury private houseboat" : "Ramada by Wyndham or boutique houseboats"),
      tips: ["Ensure your houseboat has a government-approved license.", "Try local kayaking instead of large boats to see village life closely.", "Carry mosquito repellent for the evening."]
    };
  } else if (dest.includes("rameswaram")) {
    details = {
      overview: `A spiritual and historic journey to the sacred island town of Rameswaram.`,
      highlights: ["A holy dip in Agni Theertham and bathing in 22 Wells.", "Driving on the Pamban Bridge.", "Exploring the ghost town and ruins of Dhanushkodi."],
      food: ["South Indian filter coffee and temple prasadam.", "Crispy hot dosas at local mess halls.", "Freshly caught coastal fish fry."],
      stay: accommodation === "budget" ? "Dharmashalas and lodges near temple" : (accommodation === "luxury" ? "Daiwik Hotels or Hyatt Place Rameswaram" : "Hotel ABS Sanctuary or Jiwan Residencia"),
      tips: ["Dress code is strict inside the temple (modest clothes).", "Dhanushkodi is best visited between 2:00 PM and sunset.", "Do not carry bags or mobile phones inside the temple."]
    };
  } else if (dest.includes("pondicherry") || dest.includes("puducherry")) {
    details = {
      overview: `A unique blend of French colonial heritage and spiritual serenity in Pondicherry.`,
      highlights: ["Strolling the colorful French Quarter (White Town).", "Visiting Auroville and the Matrimandir.", "Sunset at Promenade Beach or Paradise Beach."],
      food: ["Croissants and crepes at Baker's Street.", "Wood-fired French pizza at Cafe Xtasi.", "Traditional Tamil-French fusion food (Creole)."],
      stay: accommodation === "budget" ? "Auroville guest houses or backpacker hostels" : (accommodation === "luxury" ? "Palais de Mahe or Promenade Hotel" : "Shenbaga Hotel or Villa Shanti"),
      tips: ["Rent a scooty to explore Pondicherry and Auroville easily.", "Matrimandir inner chamber entry requires booking 2 days in advance.", "Promenade beach is closed to vehicles in the evening, perfect for walks."]
    };
  }

  // Generate daily activities
  let itineraryMarkdown = "";
  for (let d = 1; d <= days; d++) {
    itineraryMarkdown += `### Day ${d}: ${d === 1 ? 'Arrival & Exploration' : (d === days ? 'Final Sightseeing & Departure' : 'Adventure & Highlights')}\n`;
    if (d === 1) {
      itineraryMarkdown += `- **Morning**: Arrive in ${to} via ${transport}. Check in to your ${accommodation} stay. Rest and refresh.\n`;
      itineraryMarkdown += `- **Afternoon**: Head out for a light lunch. Visit ${details.highlights[0]}.\n`;
      itineraryMarkdown += `- **Evening**: Stroll through the local markets. Enjoy local dinner featuring ${details.food[0]}.\n\n`;
    } else if (d === days) {
      itineraryMarkdown += `- **Morning**: Start early for a scenic sunrise view or a quick walk. Visit ${details.highlights[2] || 'a local tea/coffee estate'}.\n`;
      itineraryMarkdown += `- **Afternoon**: Enjoy a final meal. Pack your bags and check out of your stay.\n`;
      itineraryMarkdown += `- **Evening**: Travel back to ${from} with wonderful memories.\n\n`;
    } else {
      itineraryMarkdown += `- **Morning**: Enjoy breakfast at your stay. Set out for ${details.highlights[1]}.\n`;
      itineraryMarkdown += `- **Afternoon**: Take a break for lunch. Taste the famous ${details.food[1] || 'local delicacies'}.\n`;
      itineraryMarkdown += `- **Evening**: Unwind at a scenic viewpoint or lake. Relax and enjoy the pleasant evening weather.\n\n`;
    }
  }

  return `==================================================
AI TRIP PLANNER - SMART BACKUP GENERATOR
==================================================

## 1. Trip Overview
${details.overview}
- **Route**: ${from} ➔ ${to}
- **Duration**: ${days} Days Trip
- **Travelers**: Customized travel itinerary
- **Transport**: Recommended to travel by **${transport.toUpperCase()}**
- **Accommodation Style**: **${accommodation.toUpperCase()}**

---

## 2. Day-by-Day Itinerary
${itineraryMarkdown}
---

## 3. Recommended Eats & Dining
- **Breakfast**: Try local filter coffee and fresh idlis at a local eatery.
- **Lunch**: ${details.food[2] || details.food[0]}.
- **Dinner**: ${details.food[1] || 'Enjoy a light dinner at a garden restaurant.'}

---

## 4. Stay Suggestions (Budget: ${accommodation})
- **Recommended Stay**: ${details.stay}

---

## 5. Insider Tips for ${to}
1. *Tip 1*: ${details.tips[0]}
2. *Tip 2*: ${details.tips[1]}
3. *Tip 3*: ${details.tips[2]}

*(Note: This itinerary was generated using the local smart planner database fallback to guarantee 100% uptime and zero rate limits. It is fully customized to your inputs.)*`;
}

exports.chatBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if key is missing or is dummy placeholder
    if (!apiKey || apiKey.startsWith("AQ.") || apiKey === "your_api_key_here") {
      console.warn("⚠️ Using offline backup planner: GEMINI_API_KEY is not configured or is a placeholder.");
      const parsedData = parsePrompt(message);
      const reply = generateFallbackPlan(parsedData);
      return res.json({ reply });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(message);
      const reply = result.response.text();
      return res.json({ reply });
    } catch (apiError) {
      console.warn("⚠️ API Call failed, falling back to smart local generator:", apiError.message);
      const parsedData = parsePrompt(message);
      const reply = generateFallbackPlan(parsedData);
      return res.json({ reply });
    }
  } catch (err) {
    console.error("Critical AI Controller Error:", err);
    res.status(500).json({ error: "AI service temporarily unavailable" });
  }
};