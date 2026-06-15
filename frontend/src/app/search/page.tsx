"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  isTopRated?: boolean;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const searchDest = searchParams.get("destination") || "Santorini";

  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const properties: Property[] = [
    {
      id: "astra",
      name: "Astra Luxury Suites",
      location: "Imerovigli, Santorini",
      price: 850,
      rating: 4.9,
      image: "/images/astra-suites.jpg",
      description: "Panoramic caldera views, private infinity pools, and world-class Mediterranean dining in the heart of Imerovigli.",
      isTopRated: true,
    },
    {
      id: "canaves",
      name: "Canaves Oia Suites",
      location: "Oia, Santorini",
      price: 1200,
      rating: 4.8,
      image: "/images/canaves-suites.jpg",
      description: "Sculpted into the volcanic cliffside, offering unparalleled elegance and the island's most iconic sunset views.",
      isTopRated: true,
    },
    {
      id: "grace",
      name: "Grace Hotel Resort",
      location: "Imerovigli, Santorini",
      price: 980,
      rating: 4.9,
      image: "/images/grace-resort.jpg",
      description: "An exclusive boutique sanctuary offering the perfect balance of luxury, privacy and the spirit of the Aegean.",
      isTopRated: true,
    },
    {
      id: "katikies",
      name: "Katikies Santorini",
      location: "Oia, Santorini",
      price: 720,
      rating: 4.7,
      image: "/images/katikies-resort.jpg",
      description: "Inspiring high-end living with white-on-white architecture and three infinity pools overlooking the Aegean.",
    },
    {
      id: "mystique",
      name: "Mystique Resort",
      location: "Oia, Santorini",
      price: 650,
      rating: 4.6,
      image: "/images/mystique-resort.jpg",
      description: "Designed with natural stone and organic forms, this Luxury Collection hotel offers a distinct, earthy luxury.",
    },
    {
      id: "vedema",
      name: "Vedema Resort",
      location: "Megalochori, Santorini",
      price: 540,
      rating: 4.8,
      image: "/images/vedema-resort.jpg",
      description: "A converted 400-year-old winery offering a unique village-style experience with secluded terraces and pools.",
    },
  ];

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredProperties = properties.filter((p) =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_10px_40px_rgba(31,41,55,0.05)] border-none">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12 duration-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              flight_takeoff
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-on-surface">
              LuxeStay
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-all duration-300"
              href="/resorts"
            >
              Explore
            </Link>
            <Link
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-all duration-300"
              href="/bookings"
            >
              Bookings
            </Link>
            <Link
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-all duration-300"
              href="/help"
            >
              Help
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-sans text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-left w-full flex-grow">
        {/* Header & Statistics */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 mb-2 text-on-surface-variant opacity-70">
                <span className="font-sans text-xs">Greece</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="font-sans text-xs">Cyclades</span>
              </nav>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                Stays in {searchDest}
              </h1>
              <p className="font-sans text-sm text-on-surface-variant mt-2">
                {filteredProperties.length} properties found for your search
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant">grid_view</span>
              </button>
              <button className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant">format_list_bulleted</span>
              </button>
            </div>
          </div>
        </header>

        {/* Horizontal Filter Bar */}
        <div className="glass-panel mb-12 p-4 rounded-2xl shadow-sm border border-white/40 sticky top-24 z-40 bg-white/70 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
              <span className="font-sans text-xs font-semibold">Price Range</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all">
              <span className="material-symbols-outlined text-primary text-xl">star</span>
              <span className="font-sans text-xs font-semibold">Rating</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all">
              <span className="material-symbols-outlined text-primary text-xl">home_work</span>
              <span className="font-sans text-xs font-semibold">Property Type</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </div>
            <div className="h-8 w-px bg-outline-variant mx-2 hidden md:block"></div>
            <div className="flex items-center gap-2 flex-grow md:flex-grow-0 bg-white px-4 py-2.5 rounded-xl border border-outline-variant hover:border-outline group transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <span className="material-symbols-outlined text-on-surface-variant text-xl group-focus-within:text-primary transition-colors">search</span>
              <Input
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="border-none focus-visible:ring-0 focus-visible:border-none bg-transparent font-sans text-sm w-full md:w-48 p-0 outline-none shadow-none h-auto"
                placeholder="Search specific stay..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="group bg-white rounded-[24px] overflow-hidden card-shadow hover:translate-y-[-8px] transition-all duration-500 flex flex-col h-full border border-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={property.name}
                    src={property.image}
                  />
                  {property.isTopRated && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full font-sans text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Top Rated
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-error transition-all cursor-pointer shadow-md"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: favorites.includes(property.id) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-lg font-bold text-on-surface leading-snug">{property.name}</h3>
                    <div className="flex items-center gap-1 text-primary shrink-0">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-sans text-sm font-semibold">{property.rating}</span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">{property.description}</p>
                  <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between">
                    <div>
                      <span className="font-display text-xl font-bold text-primary">${property.price}</span>
                      <span className="font-sans text-xs text-on-surface-variant"> / night</span>
                    </div>
                    <button className="bg-surface-container hover:bg-primary hover:text-white text-primary px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer active:scale-95">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-surface-container-low rounded-[32px] border border-outline-variant/30">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">No stays match your search</h3>
            <p className="font-sans text-xs text-on-surface-variant max-w-[340px] mx-auto">Try clearing your filters or entering a different hotel name.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-all cursor-pointer active:scale-90">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-sans text-sm font-bold shadow-md">1</button>
            <button className="w-12 h-12 rounded-full hover:bg-surface-container flex items-center justify-center font-sans text-sm font-semibold transition-all cursor-pointer">2</button>
            <button className="w-12 h-12 rounded-full hover:bg-surface-container flex items-center justify-center font-sans text-sm font-semibold transition-all cursor-pointer">3</button>
            <span className="w-12 h-12 flex items-center justify-center text-on-surface-variant">...</span>
            <button className="w-12 h-12 rounded-full hover:bg-surface-container flex items-center justify-center font-sans text-sm font-semibold transition-all cursor-pointer">12</button>
          </div>
          <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-all cursor-pointer active:scale-90">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">flight_takeoff</span>
              <span className="font-display text-sm font-bold text-primary">LuxeStay Athereal Travel</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs text-center md:text-left leading-relaxed">
              Elevating your travel experience through curated luxury and seamless digital journeys.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="/help">Help Center</Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</Link>
          </div>
          <div className="text-center md:text-right">
            <p className="font-sans text-xs text-on-surface-variant opacity-80">© {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PropertySearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
