import { useState, useMemo, useEffect } from "react";
import { placesAPI } from "../services/api";
import { priceRanges } from "../data/places";

const DEFAULT_FILTERS = {
  search: "",
  location: "All",
  category: "All",
  priceRange: "All",
  rating: 1,
  sort: "recommended",
};

export function useFilter() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [allPlaces, setAllPlaces] = useState([]);

  useEffect(() => {
    placesAPI.getAll()
      .then(data => {
        setAllPlaces(data);
      })
      .catch(err => {
        console.error("Failed to fetch places:", err);
      });
  }, []);

  function onFilterChange(key, value) {
    if (key === "reset") {
      setFilters(DEFAULT_FILTERS);
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(() => {
    let result = [...allPlaces];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Location
    if (filters.location !== "All") {
      result = result.filter((p) => p.location === filters.location);
    }

    // Category
    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range
    if (filters.priceRange !== "All") {
      const range = priceRanges.find((pr) => pr.label === filters.priceRange);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    // Rating
    result = result.filter((p) => p.rating >= filters.rating);

    // Sort
    switch (filters.sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  return { filters, onFilterChange, filtered };
}
