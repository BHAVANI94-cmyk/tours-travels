import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import PlaceDetails from "./pages/PlaceDetails";
import NearbyPage from "./pages/NearbyPage";
import HotelDetails from "./pages/HotelDetails";
import RestaurantDetails from "./pages/RestaurantDetails";
import StaysPage from "./pages/StaysPage";
import DiningPage from "./pages/DiningPage";
import OffersPage from "./pages/OffersPage";
import Planner from "./pages/Planner";
import TravelGuide from "./pages/TravelGuide";
import Profile from "./pages/Profile";
import SavedReels from "./pages/SavedReels";
import AddPlace from "./pages/AddPlace";
import ReelFeed from "./features/reels/ReelFeed";
import SellerDashboard from "./features/seller/SellerDashboard";
import SellerAddForm from "./features/seller/SellerAddForm";
import AdminDashboard from "./pages/AdminDashboard";


function Layout() {
  const { pathname } = useLocation();
  const noFooter = ["/feed"];
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/nearby/:id" element={<NearbyPage />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/stays" element={<StaysPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/feed" element={<ReelFeed />} />
        <Route path="/travel" element={<TravelGuide />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<SavedReels />} />
        <Route path="/seller/listings" element={<SellerDashboard />} />
        <Route path="/seller/add/:listingType" element={<SellerAddForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/host" element={<AddPlace />} />
        <Route path="/nearby/:placeId" element={<NearbyPage />} />
      </Routes>
      {!noFooter.includes(pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
