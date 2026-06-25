import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" strokeLinecap="round"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Wander<span className="text-emerald-400">India</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Discover the best of South India — handpicked destinations, curated stays, and AI-powered travel planning.
            </p>
            <div className="flex gap-3">
              {[
                { label:"Instagram", d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" },
                { label:"Twitter",   d:"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                { label:"YouTube",   d:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM10 15V9l5.2 3z" },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 bg-white/10 hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d={s.d} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-5">Explore</h3>
            <ul className="space-y-3">
              {[
                { label:"All Destinations",       to:"/explore" },
                { label:"Hotels & Stays",         to:"/stays" },
                { label:"Restaurants & Dining",   to:"/dining" },
                { label:"Reels Feed",             to:"/feed" },
                { label:"AI Trip Planner",        to:"/planner" },
                { label:"Travel Guide",           to:"/travel" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-5">For Business</h3>
            <ul className="space-y-3">
              {[
                { label:"List Your Place",      to:"/seller/add/place" },
                { label:"List Your Hotel",      to:"/seller/add/hotel" },
                { label:"List Restaurant",      to:"/seller/add/restaurant" },
                { label:"Upload a Reel",        to:"/seller/add/reel" },
                { label:"Seller Dashboard",     to:"/seller/listings" },
                { label:"Profile",              to:"/profile" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-5">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              {[
                { icon:"M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z", label:"support@wandertamil.com" },
                { icon:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 2.81h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z", label:"+91 98765 43210" },
                { icon:"M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z M12 9a2.5 2.5 0 1 0 0-4 2.5 2.5 0 0 0 0 4z", label:"Madurai, Tamil Nadu, India" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d={item.icon} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">{item.label}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Get travel tips</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors"/>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors flex-shrink-0">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {year} WanderTamil. All rights reserved. Made with ❤️ in Tamil Nadu.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            {["Privacy Policy","Terms of Service","Refund Policy","Cookie Policy"].map(item => (
              <a key={item} href="#" className="text-gray-600 hover:text-white text-xs transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
