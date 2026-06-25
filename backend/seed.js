const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const Tour = require("./models/Tour");
const Hotel = require("./models/Hotel");
const Offer = require("./models/Offer");
const Restaurant = require("./models/Restaurant");

const places = [
  {
    id: 1, name: "Ooty", location: "Tamil Nadu", category: "Hill Station",
    rating: 4.7, reviews: 2340, price: 3500,
    entryCost: 0,
    guidePrice: 500,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800&q=80",
    ],
    tags: ["Nature", "Trekking", "Scenic"],
    description: "Ooty, the Queen of Hill Stations, sits at 2,240 metres in the Nilgiri Hills. Famous for its lush tea gardens, the Nilgiri Mountain Railway (a UNESCO World Heritage toy train), Ooty Lake, and the Government Botanical Garden. The cool climate, misty mornings, and colonial-era bungalows make it a favourite escape from the South Indian heat.",
    highlights: ["Nilgiri Mountain Railway", "Ooty Lake Boating", "Botanical Garden", "Tea Factory Visit", "Doddabetta Peak"],
    dos: ["Carry warm clothes — it gets cold at night", "Try the local Ooty chocolate and homemade jam", "Book toy train tickets in advance on IRCTC", "Visit early morning for misty views"],
    donts: ["Don't litter in the lake or garden areas", "Don't pet stray animals near viewpoints", "Avoid peak season (Apr–Jun) if you dislike crowds", "Don't miss the last bus back if day-tripping"],
    bestTime: "Oct – Jun",
  },
  {
    id: 2, name: "Kodaikanal", location: "Tamil Nadu", category: "Hill Station",
    rating: 4.5, reviews: 1890, price: 2800,
    entryCost: 0,
    guidePrice: 400,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800&q=80",
    ],
    tags: ["Lake", "Nature", "Romantic"],
    description: "Kodaikanal, the Princess of Hill Stations, is famous for its star-shaped lake, lush shola forests, and the dramatic Coaker's Walk with views into the plains. At 2,133 metres, it offers a cool climate and romantic atmosphere with pine forests, waterfalls, and a charming market town.",
    highlights: ["Kodai Lake Cycling", "Coaker's Walk", "Bear Shola Falls", "Pine Forest", "Pillar Rocks"],
    dos: ["Rent a cycle and go around the lake — it's magical", "Visit Coaker's Walk at sunrise for the best views", "Try the local Kodai cheese and garlic", "Carry a light jacket always"],
    donts: ["Don't attempt treks alone — inform your hotel", "Avoid visiting Jul–Sep (heavy rain)", "Don't skip the silent valley walk", "Don't feed monkeys near viewpoints"],
    bestTime: "Apr – Jun",
  },
  {
    id: 3, name: "Rameswaram", location: "Tamil Nadu", category: "Pilgrimage",
    rating: 4.8, reviews: 3100, price: 2000,
    entryCost: 50,
    guidePrice: 600,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    ],
    tags: ["Temple", "Beach", "Spiritual"],
    description: "Rameswaram is one of India's most sacred pilgrimage sites, an island town connected to the mainland by the Pamban Bridge. The Ramanathaswamy Temple, with its 1,212-metre main corridor, is one of the longest temple corridors in the world. A must-visit for spirituality, stunning beaches, and the legendary Dhanushkodi ghost town.",
    highlights: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi Beach", "Adam's Bridge View", "22 Holy Wells"],
    dos: ["Dress modestly — dhoti required for men inside temple", "Take a ritual dip at Agni Theertham beach at sunrise", "Visit Dhanushkodi at golden hour", "Hire a local guide for temple rituals explanation"],
    donts: ["Don't carry leather items inside the temple", "Don't visit Dhanushkodi during high tide", "Don't rush the temple — it deserves 3–4 hours", "Don't skip the Pamban Bridge view"],
    bestTime: "Oct – Apr",
  },
  {
    id: 4, name: "Munnar", location: "Kerala", category: "Hill Station",
    rating: 4.6, reviews: 2750, price: 4200,
    entryCost: 0,
    guidePrice: 550,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["Tea Gardens", "Waterfall", "Nature"],
    description: "Munnar sits at the confluence of three mountain streams in the Western Ghats at 1,600 metres. It is Kerala's most loved hill station, blanketed in endless tea plantations, misty valleys, and wildlife sanctuaries. The Eravikulam National Park here is home to the endangered Nilgiri Tahr.",
    highlights: ["Eravikulam National Park", "Tea Museum", "Attukal Waterfalls", "Top Station Viewpoint", "Mattupetty Dam"],
    dos: ["Visit Eravikulam early morning to spot Nilgiri Tahr", "Try fresh tea from the factory shop", "Carry a waterproof jacket — mist turns to rain fast", "Book park entry online to avoid queues"],
    donts: ["Don't drive to Top Station in fog — wait for it to clear", "Don't miss sunset at Mattupetty Dam", "Avoid Jan–Feb if you dislike cold", "Don't pick tea leaves from the estates"],
    bestTime: "Sep – Mar",
  },
  {
    id: 5, name: "Mahabalipuram", location: "Tamil Nadu", category: "Heritage",
    rating: 4.4, reviews: 1650, price: 1500,
    entryCost: 40,
    guidePrice: 500,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    tags: ["Temples", "Beach", "History"],
    description: "Mahabalipuram (Mamallapuram) is a UNESCO World Heritage Site on the Coromandel Coast, featuring some of the finest rock-cut architecture in the world from the 7th-century Pallava dynasty. The Shore Temple, Pancha Rathas, and Arjuna's Penance are masterpieces of Dravidian architecture. The town also has a beautiful beach and a thriving sculpture school.",
    highlights: ["Shore Temple", "Pancha Rathas", "Arjuna's Penance", "Krishna's Butter Ball", "Tiger Cave"],
    dos: ["Hire an ASI-certified guide for history context", "Visit monuments at sunrise for best light and no crowds", "Explore the sculpture workshops on the main road", "Combine with a beach evening"],
    donts: ["Don't touch or climb the ancient rock sculptures", "Don't skip Arjuna's Penance — it's a 28-metre masterpiece", "Avoid midday visits — extreme heat and harsh light", "Don't leave without trying the local seafood"],
    bestTime: "Nov – Mar",
  },
  {
    id: 6, name: "Alleppey", location: "Kerala", category: "Backwaters",
    rating: 4.7, reviews: 3200, price: 5500,
    entryCost: 0,
    guidePrice: 700,
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["Houseboat", "Backwaters", "Scenic"],
    description: "Alleppey (Alappuzha), the Venice of the East, is famous for its network of canals, lagoons, and houseboats drifting through emerald backwaters. The Nehru Trophy Boat Race held here in August is one of India's most spectacular sporting events. A houseboat overnight stay is one of the most unique travel experiences in the country.",
    highlights: ["Houseboat Cruise", "Nehru Trophy Boat Race (Aug)", "Alleppey Beach", "Marari Beach", "Kuttanad Paddy Fields"],
    dos: ["Book houseboats 1-2 months early for peak season", "Choose a houseboat with solar power for eco stays", "Try Kerala Sadya (banana leaf feast) on the boat", "Negotiate houseboat prices — they are flexible"],
    donts: ["Don't book the cheapest houseboat — safety matters", "Avoid visiting Jun–Aug unless you love the monsoon drama", "Don't litter in the backwaters — it's a protected ecosystem", "Don't miss sunrise on the water"],
    bestTime: "Nov – Feb",
  },
  {
    id: 7, name: "Yercaud", location: "Tamil Nadu", category: "Hill Station",
    rating: 4.3, reviews: 980, price: 1800,
    entryCost: 0,
    guidePrice: 300,
    image: "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["Nature", "Lake", "Budget"],
    description: "Yercaud, the Jewel of the South, is a budget-friendly hill station in the Shevaroy Hills of Tamil Nadu at 1,515 metres. It has coffee, orange, and pepper plantations, a serene lake, and beautiful viewpoints. Much less crowded than Ooty or Kodaikanal, making it perfect for a peaceful getaway.",
    highlights: ["Yercaud Lake", "Lady's Seat Viewpoint", "Pagoda Point", "Coffee Plantations", "Rose Garden"],
    dos: ["Visit the coffee plantations and learn the process", "Rent a cycle around Yercaud Lake", "Visit Pagoda Point for panoramic views", "Try locally grown coffee and oranges"],
    donts: ["Don't expect the same polish as Ooty — it's raw beauty", "Avoid planning too many activities — it's a relaxation destination", "Don't miss the Shevaroyan Temple on the hilltop", "Avoid peak summer for solitude"],
    bestTime: "Oct – Jun",
  },
  {
    id: 8, name: "Coorg", location: "Karnataka", category: "Hill Station",
    rating: 4.8, reviews: 4100, price: 5000,
    entryCost: 0,
    guidePrice: 600,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["Coffee", "Nature", "Trekking"],
    description: "Coorg (Kodagu), the Scotland of India, is a lush mountainous district in Karnataka known for its sprawling coffee and tea estates, misty valleys, and the famous warrior Kodava community. Dubare Elephant Camp, Abbey Falls, and the Nagarhole Tiger Reserve are among the top attractions. The local Pandi Curry (pork) is a must-try.",
    highlights: ["Dubare Elephant Camp", "Abbey Falls", "Nagarhole Tiger Reserve", "Raja's Seat", "Talakaveri"],
    dos: ["Stay in a coffee estate homestay for the full experience", "Wake up early for elephant bathing at Dubare", "Try Kodava cuisine — Pandi Curry and Kadambuttu", "Take a guided forest trek with certified guides"],
    donts: ["Don't visit Jul–Aug — heavy rain blocks many roads", "Don't feed elephants without permission from handlers", "Don't skip Talakaveri (source of River Cauvery)", "Avoid weekends if you dislike crowds at Dubare"],
    bestTime: "Oct – Mar",
  },
  {
    id: 9, name: "Pondicherry", location: "Tamil Nadu", category: "Beach",
    rating: 4.5, reviews: 2200, price: 2500,
    entryCost: 0,
    guidePrice: 400,
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["French Town", "Beach", "Cafes"],
    description: "Pondicherry (Puducherry) is a unique Union Territory that was a French colony until 1954, and the French influence is visible in its well-preserved White Town with cobblestone streets, yellow-painted colonial buildings, French bakeries, and tree-lined boulevards. It also houses the Sri Aurobindo Ashram and Auroville, the international township dedicated to human unity.",
    highlights: ["White Town Walk", "Sri Aurobindo Ashram", "Auroville", "Promenade Beach", "Paradise Beach by Boat"],
    dos: ["Rent a scooter and explore White Town early morning", "Visit Auroville Matrimandir (book in advance)", "Try French cafe culture — croissants and filter coffee", "Watch sunrise from the Promenade Beach"],
    donts: ["Don't carry alcohol near the Ashram area", "Don't skip Paradise Beach — it's only accessible by boat", "Avoid Oct–Dec (cyclone season)", "Don't rush Auroville — give it half a day"],
    bestTime: "Oct – Mar",
  },
  {
    id: 10, name: "Wayanad", location: "Kerala", category: "Wildlife",
    rating: 4.6, reviews: 1870, price: 3800,
    entryCost: 150,
    guidePrice: 700,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    ],
    tags: ["Wildlife", "Trekking", "Nature"],
    description: "Wayanad is a stunning green district in Kerala's Western Ghats with rolling hills, coffee plantations, and some of South India's best wildlife. The Wayanad Wildlife Sanctuary is home to elephants, tigers, leopards, and gaur. The Edakkal Caves contain prehistoric carvings dating back 6,000 years.",
    highlights: ["Wayanad Wildlife Sanctuary", "Edakkal Caves", "Chembra Peak Trek", "Banasura Sagar Dam", "Soochipara Waterfalls"],
    dos: ["Book wildlife safari early morning (6–9 AM) for best sightings", "Carry a zoom camera — animals are shy", "Trek Chembra Peak with a guide (mandatory)", "Visit Edakkal Caves on weekdays to avoid crowds"],
    donts: ["Don't trek alone — wildlife is real here", "Don't use flash photography near wildlife", "Don't pick anything from the forest floor", "Don't litter — Wayanad is pristine, keep it that way"],
    bestTime: "Oct – May",
  },
  {
    id: 11, name: "Madurai", location: "Tamil Nadu", category: "Pilgrimage",
    rating: 4.7, reviews: 3800, price: 1200,
    entryCost: 0,
    guidePrice: 500,
    image: "https://images.unsplash.com/photo-1575994532954-c5b0e9f4adc3?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1575994532954-c5b0e9f4adc3?w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    ],
    tags: ["Temple", "Culture", "History"],
    description: "Madurai is one of the world's oldest continuously inhabited cities, with 2,500+ years of history. The Meenakshi Amman Temple, with its 14 ornate gopurams visible from across the city, is the heart of Madurai. The city never sleeps — the temple has rituals at midnight too. Known for Madurai jasmine, Kothu Parotta, and the liveliest street food scene in Tamil Nadu.",
    highlights: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace", "Gandhi Museum", "Vandiyur Mariamman Teppakulam", "Madurai Night Food Market"],
    dos: ["Visit the temple for the evening aarti (6:30 PM) — spectacular", "Hire a guide inside the temple — history is incredible", "Eat Madurai-style Jigarthanda on the roadside", "Visit the flower market near the temple at dawn"],
    donts: ["Don't carry leather inside the temple", "Don't miss the midnight procession if you can stay", "Don't disrespect the dress code — it's strictly enforced", "Don't skip the Palace — it's rarely crowded"],
    bestTime: "Oct – Mar",
  },
  {
    id: 12, name: "Varkala", location: "Kerala", category: "Beach",
    rating: 4.4, reviews: 1450, price: 3000,
    entryCost: 0,
    guidePrice: 350,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
    ],
    tags: ["Cliff Beach", "Sunset", "Relaxing"],
    description: "Varkala is Kerala's only cliff beach, where dramatic red laterite cliffs drop straight into the Arabian Sea. The cliff-top promenade is lined with yoga shalas, Ayurveda centres, seafood restaurants, and bohemian boutiques. The natural mineral springs at Papanasam Beach are believed to have cleansing properties. Perfect for slow travel, sunsets, and switching off.",
    highlights: ["Varkala Cliff Walk", "Papanasam Beach", "Natural Mineral Springs", "Janardanaswamy Temple", "Sunset at Helipad Viewpoint"],
    dos: ["Walk the cliff promenade at sunset — absolutely stunning", "Try Ayurvedic massage at one of the cliff-top centres", "Eat fresh catch seafood at the cliff restaurants", "Visit Janardanaswamy Temple (2,000 years old) early morning"],
    donts: ["Don't swim at the southern end — strong currents", "Don't walk the cliff edge after dark without a torch", "Don't haggle aggressively at small local shops", "Avoid Nov–Dec if you want sunny beaches (heavy rain)"],
    bestTime: "Nov – Mar",
  }
];

const hotels = [
  {
    id: 1, placeId: 1, placeName: "Ooty",
    name: "Savoy Hotel Ooty", style: "Heritage", stars: 5,
    price: 6500, rating: 4.8, reviews: 1240,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    amenities: ["Pool", "Spa", "Free WiFi", "Restaurant", "Garden"],
    description: "Colonial-era heritage hotel set amidst lush gardens.",
    available: true,
  },
  {
    id: 2, placeId: 1, placeName: "Ooty",
    name: "Fortune Sullivan Court", style: "Luxury", stars: 4,
    price: 4200, rating: 4.5, reviews: 890,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    amenities: ["Free WiFi", "Restaurant", "Room Service", "Parking"],
    description: "Modern comfort with breathtaking hill views.",
    available: true,
  },
  {
    id: 3, placeId: 1, placeName: "Ooty",
    name: "Ooty Budget Inn", style: "Budget", stars: 2,
    price: 1200, rating: 4.1, reviews: 430,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    amenities: ["Free WiFi", "Hot Water", "Parking"],
    description: "Clean and comfortable stay at an affordable price.",
    available: true,
  },
  {
    id: 4, placeId: 4, placeName: "Munnar",
    name: "Windermere Estate", style: "Heritage", stars: 5,
    price: 8500, rating: 4.9, reviews: 2100,
    image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=600&q=80",
    amenities: ["Pool", "Spa", "Tea Estate Tour", "Restaurant", "Bonfire"],
    description: "Iconic tea estate bungalow with panoramic mountain views.",
    available: true,
  },
  {
    id: 5, placeId: 4, placeName: "Munnar",
    name: "Blackberry Hills", style: "Resort", stars: 4,
    price: 5500, rating: 4.6, reviews: 780,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    amenities: ["Pool", "Free WiFi", "Trekking", "Restaurant"],
    description: "Eco-resort nestled in the misty Western Ghats.",
    available: false,
  },
  {
    id: 6, placeId: 4, placeName: "Munnar",
    name: "Green Leaf Homestay", style: "Budget", stars: 3,
    price: 1800, rating: 4.3, reviews: 560,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
    amenities: ["Free WiFi", "Home Cooked Meals", "Garden"],
    description: "Cozy homestay run by a local family with authentic meals.",
    available: true,
  },
  {
    id: 7, placeId: 6, placeName: "Alleppey",
    name: "Punnamada Lake Resort", style: "Luxury", stars: 5,
    price: 9200, rating: 4.8, reviews: 1450,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    amenities: ["Pool", "Spa", "Houseboat", "Restaurant", "Kayaking"],
    description: "Five-star luxury right on the edge of Punnamada Lake.",
    available: true,
  },
  {
    id: 8, placeId: 6, placeName: "Alleppey",
    name: "Backwater Breeze", style: "Resort", stars: 3,
    price: 3200, rating: 4.4, reviews: 670,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    amenities: ["Free WiFi", "Canoe Rides", "Restaurant"],
    description: "Peaceful backwater resort with traditional Kerala cuisine.",
    available: true,
  },
  {
    id: 9, placeId: 9, placeName: "Pondicherry",
    name: "Villa Shanti", style: "Boutique", stars: 4,
    price: 4800, rating: 4.7, reviews: 920,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    amenities: ["Pool", "Free WiFi", "Rooftop Bar", "Spa"],
    description: "Charming French colonial villa in the White Town quarter.",
    available: true,
  },
  {
    id: 10, placeId: 9, placeName: "Pondicherry",
    name: "Palais de Mahe", style: "Heritage", stars: 5,
    price: 7200, rating: 4.9, reviews: 1100,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    amenities: ["Pool", "Spa", "Free WiFi", "Fine Dining", "Library"],
    description: "Heritage palace hotel with original French-era architecture.",
    available: true,
  },
  {
    id: 11, placeId: 8, placeName: "Coorg",
    name: "Amanvana Spa Resort", style: "Luxury", stars: 5,
    price: 11000, rating: 4.9, reviews: 1800,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    amenities: ["Pool", "Spa", "Yoga", "Restaurant", "Coffee Tour"],
    description: "Ultra-luxury island resort on the Cauvery river.",
    available: true,
  },
  {
    id: 12, placeId: 8, placeName: "Coorg",
    name: "Coorg Cliffs Resort", style: "Resort", stars: 4,
    price: 5200, rating: 4.6, reviews: 980,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    amenities: ["Pool", "Free WiFi", "Trekking", "Restaurant"],
    description: "Cliff-top resort with coffee plantation walks.",
    available: false,
  },
  {
    id: 13, placeId: 10, placeName: "Wayanad",
    name: "Vythiri Resort", style: "Resort", stars: 5,
    price: 7800, rating: 4.8, reviews: 1320,
    image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=600&q=80",
    amenities: ["Treehouse", "Pool", "Spa", "Wildlife Tour", "Restaurant"],
    description: "Award-winning eco-resort with iconic treetop villas.",
    available: true,
  },
  {
    id: 14, placeId: 2, placeName: "Kodaikanal",
    name: "Carlton Hotel", style: "Heritage", stars: 4,
    price: 4500, rating: 4.6, reviews: 880,
    image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=600&q=80",
    amenities: ["Pool", "Spa", "Free WiFi", "Lake View", "Restaurant"],
    description: "Iconic lakeside hotel with over 100 years of history.",
    available: true,
  },
  {
    id: 15, placeId: 11, placeName: "Madurai",
    name: "Heritage Madurai", style: "Heritage", stars: 5,
    price: 6200, rating: 4.7, reviews: 1050,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    amenities: ["Pool", "Spa", "Free WiFi", "Temple View", "Restaurant"],
    description: "Colonial-style hotel with stunning Meenakshi Temple views.",
    available: true,
  }
];

const offers = [
  {
    id: "off1", type: "tour", targetId: 1,
    name: "Toy Train Ride Free Entry",
    description: "Get free entry and reservation on the historic Nilgiri Mountain Railway toy train with every Ooty group booking.",
    originalPrice: 120, offerPrice: 0, validUntil: "2026-07-15",
    badge: "🚂 Train Deal", badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    discount: 100
  },
  {
    id: "off2", type: "hotel", targetId: 1,
    name: "Savoy Selection Special Deal",
    description: "Book Savoy Select Stay with complimentary breakfast and Ayurvedic massage coupons.",
    originalPrice: 9500, offerPrice: 6500, validUntil: "2026-07-30",
    badge: "🏨 Resort Deal", badgeColor: "bg-rose-500",
    discount: 31
  },
  {
    id: "off3", type: "tour", targetId: 3,
    name: "Dhanushkodi Golden Hour Tour",
    description: "Experience the ghost town Dhanushkodi at sunrise with an off-road jeep drive included.",
    originalPrice: 1500, offerPrice: 1200, validUntil: "2026-08-10",
    badge: "🌅 Sunrise Deal", badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    discount: 20
  },
  {
    id: "off4", type: "hotel", targetId: 4,
    name: "Windermere Estate Eco Retreat",
    description: "Exclusive discount on 3-night premium suites with complimentary tea tasting walks.",
    originalPrice: 12000, offerPrice: 8500, validUntil: "2026-08-15",
    badge: "🌿 Nature Deal", badgeColor: "bg-emerald-500",
    discount: 29
  }
];

const restaurants = [
  { id: 1, placeId: 1, placeName: "Ooty", name: "Sidewalk Cafe", cuisine: "Continental", rating: 4.6, priceFor2: 800,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    specialty: "Cheese Fondue, Pasta", hours: "8am – 10pm", contact: "+91 94321 10001", type: "Cafe", photos: [] },
  { id: 2, placeId: 1, placeName: "Ooty", name: "Hyderabad Biryani House", cuisine: "Indian", rating: 4.4, priceFor2: 400,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    specialty: "Mutton Biryani, Haleem", hours: "11am – 11pm", contact: "+91 94321 10002", type: "Restaurant", photos: [] },
  { id: 3, placeId: 1, placeName: "Ooty", name: "Earl's Secret", cuisine: "Bakery & Tea", rating: 4.8, priceFor2: 600,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    specialty: "Ooty Homemade Chocolates, Tea", hours: "9am – 8pm", contact: "+91 94321 10003", type: "Cafe", photos: [] },
  { id: 4, placeId: 4, placeName: "Munnar", name: "Saravana Bhavan Munnar", cuisine: "South Indian", rating: 4.5, priceFor2: 350,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
    specialty: "Masala Dosa, Filter Coffee", hours: "7am – 10pm", contact: "+91 94321 20001", type: "Restaurant", photos: [] },
  { id: 5, placeId: 4, placeName: "Munnar", name: "Rapsy Restaurant", cuisine: "Kerala", rating: 4.6, priceFor2: 500,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    specialty: "Kerala Fish Curry, Appam", hours: "8am – 10pm", contact: "+91 94321 20002", type: "Restaurant", photos: [] },
  { id: 6, placeId: 6, placeName: "Alleppey", name: "Chakara Restaurant", cuisine: "Seafood", rating: 4.7, priceFor2: 900,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    specialty: "Karimeen Pollichathu, Prawn Curry", hours: "12pm – 11pm", contact: "+91 94321 30001", type: "Fine Dining", photos: [] },
  { id: 7, placeId: 6, placeName: "Alleppey", name: "Thaff Restaurant", cuisine: "Kerala", rating: 4.4, priceFor2: 450,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    specialty: "Sadya Meals, Fish Molee", hours: "7am – 10pm", contact: "+91 94321 30002", type: "Restaurant", photos: [] },
  { id: 8, placeId: 9, placeName: "Pondicherry", name: "Le Cafe", cuisine: "French", rating: 4.7, priceFor2: 1200,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
    specialty: "Croque Monsieur, Crepes", hours: "8am – 11pm", contact: "+91 94321 40001", type: "Cafe", photos: [] },
  { id: 9, placeId: 9, placeName: "Pondicherry", name: "Surguru Restaurant", cuisine: "South Indian", rating: 4.5, priceFor2: 400,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
    specialty: "Thali, Idli Sambar", hours: "7am – 10pm", contact: "+91 94321 40002", type: "Restaurant", photos: [] },
  { id: 10, placeId: 8, placeName: "Coorg", name: "Coorg Cuisine Restaurant", cuisine: "Kodava", rating: 4.8, priceFor2: 700,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    specialty: "Pandi Curry, Kadambuttu", hours: "12pm – 10pm", contact: "+91 94321 50001", type: "Restaurant", photos: [] },
  { id: 11, placeId: 11, placeName: "Madurai", name: "Amma Mess", cuisine: "Tamil Nadu", rating: 4.9, priceFor2: 300,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    specialty: "Mutton Kari, Parotta", hours: "11am – 3pm, 6pm – 10pm", contact: "+91 94321 60001", type: "Restaurant", photos: [] },
  { id: 12, placeId: 11, placeName: "Madurai", name: "Kumar Mess", cuisine: "Non-Veg Tamil", rating: 4.7, priceFor2: 350,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
    specialty: "Chettinad Chicken, Seeraga Samba Rice", hours: "11am – 10pm", contact: "+91 94321 60002", type: "Restaurant", photos: [] },
  { id: 13, placeId: 12, placeName: "Varkala", name: "Cliff Top Cafe", cuisine: "Multi-cuisine", rating: 4.5, priceFor2: 650,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80",
    specialty: "Grilled Fish, Fresh Juices", hours: "8am – 11pm", contact: "+91 94321 70001", type: "Cafe", photos: [] },
  { id: 14, placeId: 2, placeName: "Kodaikanal", name: "Cloud Street Bistro", cuisine: "Continental", rating: 4.4, priceFor2: 700,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80",
    specialty: "Waffles, Fresh Pasta", hours: "9am – 9pm", contact: "+91 94321 80001", type: "Cafe", photos: [] },
  { id: 15, placeId: 3, placeName: "Rameswaram", name: "Vasantha Bhavan", cuisine: "South Indian", rating: 4.3, priceFor2: 280,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
    specialty: "Idli, Vada, Temple Prasadam Meals", hours: "6am – 10pm", contact: "+91 94321 90001", type: "Restaurant", photos: [] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    // Clear collections
    await Tour.deleteMany({});
    await Hotel.deleteMany({});
    await Offer.deleteMany({});
    await Restaurant.deleteMany({});

    // Hotel details to merge
    const hotelDetails = {
      1: {
        photos: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        ],
        features: ["King Bed Rooms", "Garden View", "Heritage Architecture", "In-house Restaurant", "Concierge Service"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "Free cancellation up to 48 hrs", "No smoking inside rooms", "Pets not allowed"],
        contact: "+91 423 244 2500",
      },
      2: {
        photos: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800&q=80"],
        features: ["Hill View Rooms", "24hr Room Service", "Business Centre", "Laundry Service"],
        policies: ["Check-in: 1:00 PM", "Check-out: 12:00 PM", "Free cancellation up to 24 hrs", "No smoking"],
        contact: "+91 423 244 3000",
      },
      3: {
        photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
        features: ["Clean Rooms", "Hot Water", "Parking", "Budget Friendly"],
        policies: ["Check-in: 12:00 PM", "Check-out: 10:00 AM", "No cancellation after booking"],
        contact: "+91 94321 10003",
      },
      4: {
        photos: ["https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800&q=80","https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"],
        features: ["Tea Estate Views", "Bonfire Evenings", "Tea Tasting", "Mountain Trekking", "Bird Watching"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "Free cancellation 72 hrs before", "No loud music after 10 PM"],
        contact: "+91 485 229 7000",
      },
      5: {
        photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80","https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800&q=80"],
        features: ["Eco Resort", "Pool", "Trekking Guides", "Nature Walks"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "50% refund if cancelled 48hrs before"],
        contact: "+91 94321 20002",
      },
      6: {
        photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80","https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800&q=80"],
        features: ["Home Cooked Meals", "Garden Seating", "Local Experience", "Family Run"],
        policies: ["Check-in: 11:00 AM", "Check-out: 10:00 AM", "No cancellation"],
        contact: "+91 94321 20003",
      },
      7: {
        photos: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80","https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"],
        features: ["Lake View Rooms", "Kayaking", "Spa", "Houseboat Access", "Swimming Pool", "Fine Dining"],
        policies: ["Check-in: 3:00 PM", "Check-out: 12:00 PM", "Free cancellation 7 days before", "No parties"],
        contact: "+91 477 223 3000",
      },
      8: {
        photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80","https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"],
        features: ["Canoe Rides", "Backwater Views", "Kerala Cuisine", "Peaceful"],
        policies: ["Check-in: 1:00 PM", "Check-out: 11:00 AM", "Free cancellation 48 hrs before"],
        contact: "+91 477 223 4000",
      },
      9: {
        photos: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"],
        features: ["French Colonial Style", "Rooftop Bar", "Pool", "Spa", "Yoga Classes", "Beach Access"],
        policies: ["Check-in: 2:00 PM", "Check-out: 12:00 PM", "Free cancellation 48 hrs before", "No loud music after 11 PM"],
        contact: "+91 413 222 5000",
      },
      10: {
        photos: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"],
        features: ["Beach View", "Heritage Palace", "Fine Dining", "Spa", "Library"],
        policies: ["Check-in: 3:00 PM", "Check-out: 12:00 PM", "Free cancellation 7 days before"],
        contact: "+91 413 222 6000",
      },
      11: {
        photos: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"],
        features: ["Private Island", "Infinity Pool", "Yoga Deck", "Coffee Tours", "Cauvery River View"],
        policies: ["Check-in: 3:00 PM", "Check-out: 12:00 PM", "Free cancellation 7 days before", "No children under 12"],
        contact: "+91 82771 00000",
      },
      12: {
        photos: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80","https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"],
        features: ["Cliff Views", "Coffee Plantation Walk", "Pool", "Trekking"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "Free cancellation 48 hrs before"],
        contact: "+91 82771 00001",
      },
      13: {
        photos: ["https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80","https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"],
        features: ["Treehouse Villas", "Wildlife Safari", "Pool", "Spa", "Nature Walks", "Bird Watching"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "Free cancellation 72 hrs before", "No plastic allowed on property"],
        contact: "+91 94960 00000",
      },
      14: {
        photos: ["https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
        features: ["Lake View", "Heritage Property", "Boat Rides", "Cycling"],
        policies: ["Check-in: 2:00 PM", "Check-out: 11:00 AM", "Free cancellation 48 hrs before"],
        contact: "+91 4542 240 056",
      },
      15: {
        photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
        features: ["Temple Views", "Pool", "Spa", "Heritage Architecture", "Rooftop Dining"],
        policies: ["Check-in: 2:00 PM", "Check-out: 12:00 PM", "Free cancellation 48 hrs before"],
        contact: "+91 452 238 0000",
      },
    };

    const hotelsWithDetails = hotels.map(h => ({
      ...h,
      ...(hotelDetails[h.id] || {})
    }));

    // Seed lists
    await Tour.insertMany(places);
    await Hotel.insertMany(hotelsWithDetails);
    await Offer.insertMany(offers);
    await Restaurant.insertMany(restaurants);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
