export const restaurants = [
  // Ooty
  { id: 1, placeId: 1, placeName: "Ooty", name: "Sidewalk Cafe", cuisine: "Continental", rating: 4.6, priceFor2: 800,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    specialty: "Cheese Fondue, Pasta", hours: "8am – 10pm", contact: "+91 94321 10001", distance: "0.2 km", type: "Cafe" },
  { id: 2, placeId: 1, placeName: "Ooty", name: "Hyderabad Biryani House", cuisine: "Indian", rating: 4.4, priceFor2: 400,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    specialty: "Mutton Biryani, Haleem", hours: "11am – 11pm", contact: "+91 94321 10002", distance: "0.5 km", type: "Restaurant" },
  { id: 3, placeId: 1, placeName: "Ooty", name: "Earl's Secret", cuisine: "Bakery & Tea", rating: 4.8, priceFor2: 600,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    specialty: "Ooty Homemade Chocolates, Tea", hours: "9am – 8pm", contact: "+91 94321 10003", distance: "0.1 km", type: "Cafe" },
  // Munnar
  { id: 4, placeId: 4, placeName: "Munnar", name: "Saravana Bhavan Munnar", cuisine: "South Indian", rating: 4.5, priceFor2: 350,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
    specialty: "Masala Dosa, Filter Coffee", hours: "7am – 10pm", contact: "+91 94321 20001", distance: "0.3 km", type: "Restaurant" },
  { id: 5, placeId: 4, placeName: "Munnar", name: "Rapsy Restaurant", cuisine: "Kerala", rating: 4.6, priceFor2: 500,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    specialty: "Kerala Fish Curry, Appam", hours: "8am – 10pm", contact: "+91 94321 20002", distance: "0.7 km", type: "Restaurant" },
  // Alleppey
  { id: 6, placeId: 6, placeName: "Alleppey", name: "Chakara Restaurant", cuisine: "Seafood", rating: 4.7, priceFor2: 900,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    specialty: "Karimeen Pollichathu, Prawn Curry", hours: "12pm – 11pm", contact: "+91 94321 30001", distance: "0.5 km", type: "Fine Dining" },
  { id: 7, placeId: 6, placeName: "Alleppey", name: "Thaff Restaurant", cuisine: "Kerala", rating: 4.4, priceFor2: 450,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    specialty: "Sadya Meals, Fish Molee", hours: "7am – 10pm", contact: "+91 94321 30002", distance: "1 km", type: "Restaurant" },
  // Pondicherry
  { id: 8, placeId: 9, placeName: "Pondicherry", name: "Le Cafe", cuisine: "French", rating: 4.7, priceFor2: 1200,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
    specialty: "Croque Monsieur, Crepes", hours: "8am – 11pm", contact: "+91 94321 40001", distance: "On beach", type: "Cafe" },
  { id: 9, placeId: 9, placeName: "Pondicherry", name: "Surguru Restaurant", cuisine: "South Indian", rating: 4.5, priceFor2: 400,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
    specialty: "Thali, Idli Sambar", hours: "7am – 10pm", contact: "+91 94321 40002", distance: "0.8 km", type: "Restaurant" },
  // Coorg
  { id: 10, placeId: 8, placeName: "Coorg", name: "Coorg Cuisine Restaurant", cuisine: "Kodava", rating: 4.8, priceFor2: 700,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    specialty: "Pandi Curry, Kadambuttu", hours: "12pm – 10pm", contact: "+91 94321 50001", distance: "1 km", type: "Restaurant" },
  // Madurai
  { id: 11, placeId: 11, placeName: "Madurai", name: "Amma Mess", cuisine: "Tamil Nadu", rating: 4.9, priceFor2: 300,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    specialty: "Mutton Kari, Parotta", hours: "11am – 3pm, 6pm – 10pm", contact: "+91 94321 60001", distance: "0.4 km", type: "Restaurant" },
  { id: 12, placeId: 11, placeName: "Madurai", name: "Kumar Mess", cuisine: "Non-Veg Tamil", rating: 4.7, priceFor2: 350,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
    specialty: "Chettinad Chicken, Seeraga Samba Rice", hours: "11am – 10pm", contact: "+91 94321 60002", distance: "0.6 km", type: "Restaurant" },
  // Varkala
  { id: 13, placeId: 12, placeName: "Varkala", name: "Cliff Top Cafe", cuisine: "Multi-cuisine", rating: 4.5, priceFor2: 650,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80",
    specialty: "Grilled Fish, Fresh Juices", hours: "8am – 11pm", contact: "+91 94321 70001", distance: "On cliff", type: "Cafe" },
  // Generic fallbacks for other places
  { id: 14, placeId: 2, placeName: "Kodaikanal", name: "Cloud Street Bistro", cuisine: "Continental", rating: 4.4, priceFor2: 700,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80",
    specialty: "Waffles, Fresh Pasta", hours: "9am – 9pm", contact: "+91 94321 80001", distance: "0.3 km", type: "Cafe" },
  { id: 15, placeId: 3, placeName: "Rameswaram", name: "Vasantha Bhavan", cuisine: "South Indian", rating: 4.3, priceFor2: 280,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
    specialty: "Idli, Vada, Temple Prasadam Meals", hours: "6am – 10pm", contact: "+91 94321 90001", distance: "0.2 km", type: "Restaurant" },
];

export const cuisineTypes = ["All", "South Indian", "Kerala", "Tamil Nadu", "Seafood", "Continental", "French", "Kodava"];
export const restaurantTypes = ["All", "Cafe", "Restaurant", "Fine Dining"];
