import { useState } from "react";

export default function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-md transition-all duration-300 ${
        focused ? "ring-2 ring-emerald-400 shadow-emerald-100" : "ring-1 ring-gray-200"
      }`}
    >
      {/* Search icon */}
      <svg
        className={`w-5 h-5 flex-shrink-0 transition-colors ${focused ? "text-emerald-500" : "text-gray-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search destinations, places..."
        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
