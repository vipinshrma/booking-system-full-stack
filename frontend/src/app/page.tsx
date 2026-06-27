"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsIndicator } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"hotels" | "flights" | "resorts">("hotels");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("http://localhost:4000/api/hotels");
        const data = await res.json();
        if (data.success) {
          setHotels(data.data);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoadingHotels(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
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
              className="font-sans text-sm font-semibold text-primary border-b-2 border-primary pb-1 transition-all duration-300"
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
              href="/resorts"
            >
              Resorts
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

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden hero-gradient py-16">
          {/* Atmospheric Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] animate-pulse"></div>
            <div
              className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary-container/30 rounded-full blur-[120px] animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            {/* Background overlay stays fixed */}
            <img
              alt="Ethereal mountain landscape"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
              src="/images/hero-bg.jpg"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 text-center">
            <div className="mb-6 inline-flex items-center gap-3 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 card-shadow">
              <div className="flex -space-x-2">
                <img
                  alt="User 1"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="/images/avatar-user1.jpg"
                />
                <img
                  alt="User 2"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="/images/avatar-user2.jpg"
                />
                <img
                  alt="User 3"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="/images/avatar-user3.jpg"
                />
              </div>
              <span className="font-sans text-xs font-semibold text-on-surface-variant">
                Trusted by 2,500+ global travelers
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-on-surface mb-12 max-w-4xl mx-auto leading-tight font-extrabold tracking-tight">
              Find your <span className="text-primary italic font-serif font-light">perfect stay</span> across the globe
            </h1>

            {/* Search Module (Glass Card) */}
            <div className="max-w-5xl mx-auto glass-panel p-2 rounded-[32px] card-shadow border border-white/60">
              <div className="bg-white/80 rounded-[28px] p-6 md:p-8">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full mb-8">
                  <TabsList className="relative bg-surface-container/40 p-1.5 rounded-full flex flex-wrap h-auto gap-1 border-none shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-fit">
                    <TabsIndicator className="bg-primary rounded-full z-0" />
                    <TabsTrigger
                      value="hotels"
                      className="relative z-10 flex items-center gap-2 px-8 py-4 rounded-full font-sans text-base md:text-lg font-semibold transition-colors duration-300 cursor-pointer data-active:bg-transparent data-active:text-white text-on-surface-variant hover:text-on-surface data-active:hover:text-white border-none shadow-none"
                    >
                      <span className="material-symbols-outlined text-xl md:text-2xl">hotel</span>
                      Hotels
                    </TabsTrigger>
                    <TabsTrigger
                      value="flights"
                      className="relative z-10 flex items-center gap-2 px-8 py-4 rounded-full font-sans text-base md:text-lg font-semibold transition-colors duration-300 cursor-pointer data-active:bg-transparent data-active:text-white text-on-surface-variant hover:text-on-surface data-active:hover:text-white border-none shadow-none"
                    >
                      <span className="material-symbols-outlined text-xl md:text-2xl">flight</span>
                      Flights
                    </TabsTrigger>
                    <TabsTrigger
                      value="resorts"
                      className="relative z-10 flex items-center gap-2 px-8 py-4 rounded-full font-sans text-base md:text-lg font-semibold transition-colors duration-300 cursor-pointer data-active:bg-transparent data-active:text-white text-on-surface-variant hover:text-on-surface data-active:hover:text-white border-none shadow-none"
                    >
                      <span className="material-symbols-outlined text-xl md:text-2xl">beach_access</span>
                      Resorts
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <div className="text-left">
                    <Label className="block font-sans text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="destination">
                      Destination
                    </Label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                        location_on
                      </span>
                      <Input
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-12 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                        placeholder={
                          activeTab === "hotels"
                            ? "Where are you staying?"
                            : activeTab === "flights"
                              ? "Where are you flying to?"
                              : "Which resort is calling you?"
                        }
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <Label className="block font-sans text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="dates">
                      Check-in / Out
                    </Label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                        calendar_today
                      </span>
                      <Input
                        id="dates"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        className="w-full pl-12 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                        placeholder="Select dates"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <Label className="block font-sans text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="guests">
                      Guests
                    </Label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                        group
                      </span>
                      <Input
                        id="guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full pl-12 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                        placeholder="Add guests"
                        type="text"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/search?destination=${encodeURIComponent(destination)}`)}
                    className="bg-primary hover:opacity-90 text-on-primary h-[50px] rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer w-full font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined">search</span>
                    Search Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Destinations Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h2 className="font-display text-3xl font-bold text-on-surface mb-2">Trending Destinations</h2>
              <p className="font-sans text-sm text-on-surface-variant max-w-md">
                Explore our handpicked selection of the most breathtaking locations around the world.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingHotels ? (
              <div className="col-span-3 text-center py-12 text-on-surface-variant font-sans">
                Loading trending destinations...
              </div>
            ) : hotels.length > 0 ? (
              hotels.slice(0, 3).map((hotel) => (
                <Link key={hotel.id} href={`/search?destination=${encodeURIComponent(hotel.location.split(',')[0])}`} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden card-shadow mb-4">
                    <img
                      alt={hotel.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={hotel.image_url || "/images/santorini.jpg"}
                    />
                    {hotel.star_rating >= 5 && (
                      <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1.5 rounded-full font-sans text-xs font-semibold shadow-lg">
                        Top Rated
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 text-white text-left">
                      <p className="font-sans text-xs font-bold tracking-wider opacity-85 mb-1">
                        {hotel.location.split(',').pop()?.trim().toUpperCase() || "DESTINATION"}
                      </p>
                      <h3 className="font-display text-2xl font-bold">{hotel.name}</h3>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-sans text-sm font-semibold">{hotel.star_rating}.0</span>
                    </div>
                    <p className="font-display text-xl font-bold text-on-surface">
                      ${hotel.price_per_night} <span className="font-sans text-sm text-on-surface-variant font-normal">/night</span>
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-on-surface-variant font-sans">
                No destinations available.
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="mb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="bg-surface-container-high rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[300px] -rotate-12 translate-x-20 -translate-y-10 select-none">
                explore
              </span>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-on-surface mb-6 leading-tight">
                Get exclusive travel deals in your inbox
              </h2>
              <p className="font-sans text-base md:text-lg text-on-surface-variant mb-10">
                Join our newsletter to receive secret member-only prices and travel inspiration twice a month.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto items-center w-full">
                <Input
                  className="h-14 flex-grow bg-surface border border-border rounded-xl px-6 focus:border-primary focus:ring-3 focus:ring-primary/10 shadow-sm outline-none text-base md:text-sm w-full"
                  placeholder="Your email address"
                  type="email"
                  required
                />
                <Button
                  type="submit"
                  className="h-14 w-full md:w-auto bg-primary text-on-primary px-8 rounded-xl font-sans text-base md:text-sm font-semibold hover:opacity-90 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              flight_takeoff
            </span>
            <span className="font-display text-sm font-bold text-primary">
              LuxeStay Athereal Travel
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="/help">
              Help Center
            </Link>
            <a className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Careers
            </a>
          </div>
          <p className="font-sans text-xs text-on-surface-variant">
            © {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
