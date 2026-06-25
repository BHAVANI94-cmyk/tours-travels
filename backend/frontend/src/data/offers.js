// ─── Shared Offers Data ──────────────────────────────────────────────────────
// Single source of truth. Import OFFERS / PLACE_OFFERS and helpers wherever
// offer badges are needed: Explore, PlaceDetails, Stays, NearbyPage, OffersPage.

export const OFFERS = [
  { id:1,  hotelId:1,  hotel:"Savoy Hotel Ooty",      placeId:1,  placeName:"Ooty",         discount:30, originalPrice:6500,  offerPrice:4550, validUntil:"2026-08-31", tag:"Hill Station", badge:"🔥 Hot Deal",       badgeColor:"bg-red-500",     image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",  description:"Book 7 days in advance and save 30%. Includes breakfast and tea garden tour.",                                     includes:["Complimentary Breakfast","Tea Garden Tour","Free WiFi","Airport Pickup"] },
  { id:2,  hotelId:7,  hotel:"Punnamada Lake Resort",  placeId:6,  placeName:"Alleppey",     discount:25, originalPrice:9200,  offerPrice:6900, validUntil:"2026-07-31", tag:"Backwaters",   badge:"⏰ Limited Time",   badgeColor:"bg-amber-500",   image:"https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80",  description:"2 nights on the backwaters with houseboat cruise, kayaking and Kerala Sadya meals.",                               includes:["Houseboat Cruise","Kayaking","Kerala Sadya","Lake View Room"] },
  { id:3,  hotelId:11, hotel:"Amanvana Spa Resort",    placeId:8,  placeName:"Coorg",        discount:20, originalPrice:11000, offerPrice:8800, validUntil:"2026-09-15", tag:"Hill Station", badge:"🌿 Eco Stay",       badgeColor:"bg-green-600",   image:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",  description:"Luxury eco-retreat in Coorg coffee estates. Plantation walk, spa, and organic meals.",                             includes:["Coffee Plantation Walk","Spa Session","Organic Meals","Yoga Class"] },
  { id:4,  hotelId:10, hotel:"Palais de Mahe",         placeId:9,  placeName:"Pondicherry",  discount:15, originalPrice:7200,  offerPrice:6120, validUntil:"2026-12-30", tag:"Beach",        badge:"🏖️ Beach Special", badgeColor:"bg-sky-500",     image:"https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",   description:"French colonial heritage palace steps from Pondicherry promenade beach.",                                          includes:["Beach Access","French Breakfast","Heritage Tour","Rooftop Dinner"] },
  { id:5,  hotelId:13, hotel:"Vythiri Resort",         placeId:10, placeName:"Wayanad",      discount:22, originalPrice:7800,  offerPrice:6084, validUntil:"2026-08-15", tag:"Wildlife",     badge:"🌿 Monsoon Offer",  badgeColor:"bg-teal-600",    image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",  description:"Treehouse stay with wildlife safari in lush monsoon Wayanad.",                                                     includes:["Treehouse Stay","Wildlife Safari","Nature Walk","Waterfall Visit"] },
  { id:6,  hotelId:14, hotel:"Carlton Hotel",          placeId:2,  placeName:"Kodaikanal",   discount:18, originalPrice:4500,  offerPrice:3690, validUntil:"2026-07-20", tag:"Hill Station", badge:"💙 Weekend Deal",   badgeColor:"bg-indigo-600",  image:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", description:"Book Fri–Sun and get 18% off this iconic lakeside heritage hotel.",                                                 includes:["Lake View Room","Cycling Rental","Boat Ride","Continental Breakfast"] },
  { id:7,  hotelId:15, hotel:"Heritage Madurai",       placeId:11, placeName:"Madurai",      discount:12, originalPrice:6200,  offerPrice:5456, validUntil:"2027-01-01", tag:"Pilgrimage",   badge:"🛕 Temple Special", badgeColor:"bg-orange-500",  image:"https://images.unsplash.com/photo-1575994532954-c5b0e9f4adc3?w=600&q=80",  description:"Stay steps from Meenakshi Temple with guided tour and traditional dinner.",                                         includes:["Temple View Room","Guided Temple Tour","Traditional Dinner","Cultural Show"] },
  { id:8,  hotelId:4,  hotel:"Windermere Estate",      placeId:4,  placeName:"Munnar",       discount:28, originalPrice:8500,  offerPrice:6120, validUntil:"2026-06-15", tag:"Hill Station", badge:"☕ Tea Estate",     badgeColor:"bg-emerald-600", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",  description:"Tea estate bungalow with sunrise over Munnar's misty mountains.",                                                  includes:["Tea Estate Bungalow","Tea Factory Visit","Sunrise Trek","Bonfire Evening"] },
];

export const PLACE_OFFERS = [
  { id:"p1", name:"Ooty Day Tour",             placeId:1,  placeName:"Ooty",        tag:"Hill Station", discount:0,  originalPrice:500,  offerPrice:0,   validUntil:"2026-09-30", badge:"🎉 Free Entry",       badgeColor:"bg-emerald-600", image:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", description:"Explore Ooty tea gardens, botanical garden and Nilgiri Mountain Railway viewpoint. No entry fee — just your guide cost.", includes:["Botanical Garden","Tea Factory Visit","Lake View","Nilgiri Viewpoint"], isPlace:true },
  { id:"p2", name:"Munnar Explorer Pass",       placeId:4,  placeName:"Munnar",      tag:"Hill Station", discount:20, originalPrice:650,  offerPrice:520,  validUntil:"2026-08-31", badge:"🌿 20% Off Guide",    badgeColor:"bg-teal-600",    image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", description:"Book a guided Munnar day tour — tea estates, Eravikulam National Park and Top Station viewpoint.", includes:["Eravikulam Park Entry","Tea Estate Walk","Top Station","Guide Included"], isPlace:true },
  { id:"p3", name:"Alleppey Houseboat Day",     placeId:6,  placeName:"Alleppey",    tag:"Backwaters",   discount:15, originalPrice:1200, offerPrice:1020, validUntil:"2026-07-31", badge:"🚤 15% Off",          badgeColor:"bg-cyan-600",    image:"https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80", description:"Half-day houseboat experience on Alleppey backwaters with lunch and sunset cruise included.", includes:["Houseboat Ride","Backwater Cruise","Lunch Included","Sunset View"], isPlace:true },
  { id:"p4", name:"Rameswaram Temple Tour",     placeId:3,  placeName:"Rameswaram",  tag:"Pilgrimage",   discount:0,  originalPrice:50,   offerPrice:50,   validUntil:"2027-01-01", badge:"🛕 Heritage",         badgeColor:"bg-orange-600",  image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", description:"Visit the magnificent Ramanathaswamy Temple with its 1,212-metre corridor.", includes:["Temple Entry","22 Holy Wells","Corridor Walk","Pamban Bridge View"], isPlace:true },
  { id:"p5", name:"Coorg Nature Trail",         placeId:8,  placeName:"Coorg",       tag:"Hill Station", discount:25, originalPrice:800,  offerPrice:600,  validUntil:"2026-09-30", badge:"☕ 25% Off",          badgeColor:"bg-green-700",   image:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80", description:"Guided coffee plantation walk, Abbey Falls trek and Raja's Seat sunset — complete Coorg experience.", includes:["Coffee Plantation","Abbey Falls Trek","Raja's Seat Sunset","Local Lunch"], isPlace:true },
  { id:"p6", name:"Pondicherry Heritage Walk",  placeId:9,  placeName:"Pondicherry", tag:"Beach",        discount:10, originalPrice:400,  offerPrice:360,  validUntil:"2026-12-31", badge:"🏛️ 10% Off",         badgeColor:"bg-sky-600",     image:"https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",  description:"Guided heritage walk through White Town's French colonial streets, Auroville, and Paradise Beach.", includes:["White Town Walk","Auroville Visit","Paradise Beach","French Quarter Tour"], isPlace:true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safe days-remaining — NEVER returns NaN */
export function daysLeft(validUntil) {
  if (!validUntil) return 0;
  const diff = new Date(validUntil) - new Date();
  return isNaN(diff) ? 0 : Math.max(0, Math.ceil(diff / 86400000));
}

/** Hotel offer by hotel ID */
export function getHotelOffer(hotelId) {
  return OFFERS.find(o => o.hotelId === hotelId) || null;
}

/** Place/tour offer by place ID */
export function getPlaceOffer(placeId) {
  return PLACE_OFFERS.find(o => o.placeId === placeId) || null;
}

/** Best hotel offer for a destination (highest discount %) */
export function getBestHotelOfferForPlace(placeId) {
  const list = OFFERS.filter(o => o.placeId === placeId);
  if (!list.length) return null;
  return list.reduce((best, o) => o.discount > best.discount ? o : best, list[0]);
}
