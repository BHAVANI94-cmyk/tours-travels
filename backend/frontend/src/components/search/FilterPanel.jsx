import { locations, categories, priceRanges, sortOptions } from "../../data/places";

export default function FilterPanel({ filters, onFilterChange, resultCount }) {
  const chip = (active) =>
    `px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer border transition-all duration-200 ${
      active
        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
    }`;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4 space-y-6">
        {/* Result count */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Results</p>
          <p className="text-2xl font-bold text-gray-800">
            {resultCount} <span className="text-sm font-normal text-gray-400">places found</span>
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* Sort */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Sort By</p>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700 bg-gray-50"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <hr className="border-gray-100" />

        {/* Location */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Location</p>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => onFilterChange("location", loc)}
                className={chip(filters.location === loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Category */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange("category", cat)}
                className={chip(filters.category === cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Price Range */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
          <div className="flex flex-col gap-2">
            {priceRanges.map((pr) => (
              <button
                key={pr.label}
                onClick={() => onFilterChange("priceRange", pr.label)}
                className={chip(filters.priceRange === pr.label)}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Min Rating */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Min Rating: <span className="text-emerald-500 font-semibold">{filters.rating}★</span>
          </p>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => onFilterChange("rating", parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1★</span><span>5★</span>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => onFilterChange("reset")}
          className="w-full py-2 text-sm font-medium text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
