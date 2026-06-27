"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

interface Property {
  id: number;
  name: string;
  location: string;
  price_per_night: number;
  star_rating: number;
  image_url: string;
  description: string;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchDest = searchParams.get("destination") || "";
  const { user, token, logout } = useAuth();

  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hotels, setHotels] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal States
  const [selectedHotel, setSelectedHotel] = useState<Property | null>(null);
  
  const getTomorrowString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowString = () => {
    const today = new Date();
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState(getTomorrowString());
  const [checkOutDate, setCheckOutDate] = useState(getDayAfterTomorrowString());
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      try {
        const queryUrl = searchDest 
          ? `http://localhost:4000/api/hotels?search=${encodeURIComponent(searchDest)}`
          : "http://localhost:4000/api/hotels";
        const res = await fetch(queryUrl);
        const data = await res.json();
        if (data.success) {
          setHotels(data.data);
        }
      } catch (err) {
        console.error("Error fetching filtered hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSearchResults();
  }, [searchDest]);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedHotel) return 0;
    return calculateNights() * selectedHotel.price_per_night;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    
    const nights = calculateNights();
    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotel_id: selectedHotel?.id,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: calculateTotal(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess("Booking placed successfully! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/bookings");
        }, 1500);
      } else {
        setBookingError(data.message || "Failed to place booking.");
      }
    } catch (err: any) {
      setBookingError(err.message || "Network error while placing booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredProperties = hotels.filter((p) =>
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
            {user ? (
              <>
                <span className="font-sans text-sm text-on-surface-variant font-medium">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="bg-surface-container hover:bg-outline-variant text-on-surface px-6 py-2.5 rounded-full font-sans text-sm font-semibold active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
                <span className="font-sans text-xs">Destinations</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="font-sans text-xs">{searchDest || "All Stays"}</span>
              </nav>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                Stays in {searchDest || "Worldwide"}
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
        {loading ? (
          <div className="py-24 text-center">
            <span className="font-sans text-sm text-on-surface-variant">Loading boutique properties...</span>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="group bg-white rounded-[24px] overflow-hidden card-shadow hover:translate-y-[-8px] transition-all duration-500 flex flex-col h-full border border-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={property.name}
                    src={property.image_url || "/images/astra-suites.jpg"}
                  />
                  {property.star_rating >= 5 && (
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
                      <span className="font-sans text-sm font-semibold">{property.star_rating}.0</span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">{property.description}</p>
                  <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between">
                    <div>
                      <span className="font-display text-xl font-bold text-primary">${property.price_per_night}</span>
                      <span className="font-sans text-xs text-on-surface-variant"> / night</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedHotel(property);
                        setCheckInDate(getTomorrowString());
                        setCheckOutDate(getDayAfterTomorrowString());
                      }}
                      className="bg-surface-container hover:bg-primary hover:text-white text-primary px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer active:scale-95"
                    >
                      Book Now
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

        {/* Dynamic Interactive Booking Modal */}
        {selectedHotel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-outline-variant shadow-2xl relative text-left mx-4">
              <button
                onClick={() => {
                  setSelectedHotel(null);
                  setBookingError("");
                  setBookingSuccess("");
                }}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-surface-container hover:bg-outline-variant flex items-center justify-center text-on-surface cursor-pointer transition-colors border-none outline-none"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>

              <h3 className="font-display text-2xl font-bold text-on-surface mb-2">Book Your Stay</h3>
              <p className="font-sans text-xs text-on-surface-variant mb-6">
                Confirm your check-in and check-out dates at <span className="font-semibold text-primary">{selectedHotel.name}</span>.
              </p>

              {bookingError && (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-sans font-medium text-left mb-4">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="bg-success/10 text-success text-sm p-4 rounded-xl border border-success/20 font-sans font-medium text-left mb-4">
                  {bookingSuccess}
                </div>
              )}

              {!user ? (
                <div className="text-center py-4">
                  <p className="font-sans text-sm text-on-surface-variant mb-6">
                    You must sign in to place a booking.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Go to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1" htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        min={getTomorrowString()}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-on-surface text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1" htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        min={checkInDate || getTomorrowString()}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-on-surface text-sm"
                      />
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs text-on-surface-variant font-sans">
                      <span>Rate per night</span>
                      <span>${selectedHotel.price_per_night}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant font-sans">
                      <span>Total nights</span>
                      <span>{calculateNights()} nights</span>
                    </div>
                    <div className="h-[1px] bg-outline-variant my-1"></div>
                    <div className="flex justify-between items-center text-sm font-bold text-on-surface font-display">
                      <span>Estimated Total</span>
                      <span className="text-primary">${calculateTotal()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={bookingLoading || calculateNights() <= 0}
                    className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </form>
              )}
            </div>
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
