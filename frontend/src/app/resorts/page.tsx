"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ExploreResortsPage() {
  const { user, logout } = useAuth();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
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
        <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Ultra-luxury beachfront resort"
              src="/images/resorts-hero.jpg"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6 font-extrabold leading-tight tracking-tight">
              Boundless Luxury, <br />
              <span className="italic font-serif font-light text-primary-container">Ethereal Destinations</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-white/95 mb-12 max-w-2xl">
              Discover a curated collection of the world's most secluded resorts designed for the modern visionary seeking clarity and calm.
            </p>

            {/* Floating Glass Search Bar */}
            <div className="glass-panel p-2 rounded-full flex flex-col md:flex-row items-center gap-2 max-w-3xl w-full shadow-2xl border border-white/50 bg-white/40">
              <div className="flex-1 flex items-center px-6 py-2 md:py-0 w-full md:border-r border-outline-variant/30">
                <span className="material-symbols-outlined text-white mr-3">location_on</span>
                <div className="text-left flex-1">
                  <label className="block font-sans text-xs font-semibold text-white/80">Destination</label>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-sans text-sm text-white placeholder:text-white/60 outline-none"
                    placeholder="Where to next?"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center px-6 py-2 md:py-0 w-full md:border-r border-outline-variant/30">
                <span className="material-symbols-outlined text-white mr-3">calendar_today</span>
                <div className="text-left flex-1">
                  <label className="block font-sans text-xs font-semibold text-white/80">Check-in</label>
                  <input
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-sans text-sm text-white placeholder:text-white/60 outline-none"
                    placeholder="Add dates"
                    type="text"
                  />
                </div>
              </div>
              <Link
                href={`/search?destination=${encodeURIComponent(destination)}`}
                className="bg-primary hover:bg-primary/95 text-on-primary p-4 rounded-full flex items-center justify-center hover:scale-95 transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined">search</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Resorts - Bento Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <h2 className="font-display text-3xl font-bold text-on-surface">Trending Resorts</h2>
              <p className="font-sans text-sm text-on-surface-variant mt-2">The destinations capturing the world's imagination this month.</p>
            </div>
            <Link className="font-sans text-sm font-semibold text-primary flex items-center gap-2 group" href="/search">
              View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {/* Large Featured Card */}
            <Link href="/search" className="col-span-12 lg:col-span-8 group relative rounded-[24px] overflow-hidden aspect-[16/9] card-shadow cursor-pointer">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Azure Heights Sanctuary in Santorini"
                src="/images/azure-heights.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-6 left-6 bg-primary text-on-primary px-4 py-1.5 rounded-full font-sans text-xs font-semibold">Top Rated</div>
              <div className="absolute bottom-8 left-8 text-white text-left">
                <h3 className="font-display text-2xl md:text-3xl font-bold">Azure Heights Sanctuary</h3>
                <p className="font-sans text-sm opacity-90">Oia, Santorini • Greece</p>
                <p className="font-display text-xl font-bold mt-2">$1,240 <span className="text-sm font-sans font-normal opacity-75">/ night</span></p>
              </div>
            </Link>
            {/* Secondary Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <Link href="/search" className="group relative rounded-[24px] overflow-hidden flex-1 min-h-[200px] card-shadow cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Zenith Jungle Villa in Bali"
                  src="/images/zenith-jungle.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <h3 className="font-display text-xl font-bold">Zenith Jungle Villa</h3>
                  <p className="font-sans text-xs opacity-90">Ubud, Bali</p>
                </div>
              </Link>
              <Link href="/search" className="group relative rounded-[24px] overflow-hidden flex-1 min-h-[200px] card-shadow cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Lumina Beach Club in Maldives"
                  src="/images/lumina-beach.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <h3 className="font-display text-xl font-bold">Lumina Beach Club</h3>
                  <p className="font-sans text-xs opacity-90">Malé, Maldives</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Seasonal Escapes - Horizontal Scroll */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold text-on-surface">Seasonal Escapes</h2>
              <p className="font-sans text-sm text-on-surface-variant mt-2">Curated winter getaways and sun-drenched retreats for right now.</p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-thin scrollbar-thumb-outline-variant">
              {loading ? (
                <div className="text-center w-full py-12 text-on-surface-variant font-sans">
                  Loading resorts...
                </div>
              ) : hotels.length > 0 ? (
                hotels.slice(0, 3).map((resort) => (
                  <div key={resort.id} className="min-w-[320px] md:min-w-[400px] snap-start bg-white rounded-[24px] overflow-hidden card-shadow group">
                    <div className="h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={resort.name}
                        src={resort.image_url || "/images/eiger-crest.jpg"}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-display text-lg font-bold text-on-surface">{resort.name}</h3>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-sans text-sm font-semibold">{resort.star_rating}.0</span>
                        </div>
                      </div>
                      <p className="font-sans text-sm text-on-surface-variant mb-6 line-clamp-2">{resort.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-display text-xl font-bold text-on-surface">
                          ${resort.price_per_night} <span className="text-xs font-sans font-normal text-on-surface-variant">/ night</span>
                        </span>
                        <Link
                          href={`/search?destination=${encodeURIComponent(resort.location.split(',')[0])}`}
                          className="p-3 rounded-full border border-outline-variant hover:bg-primary hover:text-white transition-colors active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center w-full py-12 text-on-surface-variant font-sans">
                  No resorts found.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Member Exclusives - Immersive Glass Section */}
        <section className="relative py-32 overflow-hidden text-left">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover grayscale opacity-10"
              alt="High-end wellness center spa"
              src="/images/wellness-spa.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <div>
              <span className="font-sans text-xs font-semibold text-primary tracking-widest block mb-4 uppercase">LuxeStay Elite</span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-on-surface mb-6 leading-tight">Experience Beyond the Extraordinary</h2>
              <p className="font-sans text-sm md:text-base text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                Unlock access to our 'Hidden Collection'—resorts that aren't listed publicly. Plus, enjoy complimentary spa retreats, private jet transfers, and 24/7 personal concierge service.
              </p>
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-on-surface">Priority Booking</h4>
                    <p className="font-sans text-xs text-on-surface-variant">Get first access to peak season dates at our top 50 resorts.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-on-surface">Curated Upgrades</h4>
                    <p className="font-sans text-xs text-on-surface-variant">Automatic room upgrades to suites and villas upon arrival.</p>
                  </div>
                </div>
              </div>
              <button className="bg-on-surface text-background px-10 py-4 rounded-full font-sans text-sm font-semibold hover:scale-95 transition-transform active:scale-90 shadow-md">
                Apply for Membership
              </button>
            </div>
            <div className="relative">
              <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/50 shadow-2xl relative z-10">
                <h3 className="font-display text-lg md:text-2xl mb-8 text-center italic text-on-surface font-light">
                  "The defining experience of my decade. Every detail was curated with an ethereal precision."
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <img
                    alt="Marcus Sterling"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                    src="/images/avatar-marcus.jpg"
                  />
                  <div className="text-left">
                    <p className="font-sans text-sm font-bold text-on-surface">Marcus Sterling</p>
                    <p className="font-sans text-xs text-on-surface-variant">Founder, Horizon Tech</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Collections CTA */}
        <section className="py-24 text-center max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-primary/5 rounded-[48px] py-20 px-8">
            <h2 className="font-display text-3xl font-bold text-on-surface mb-6">Not sure where to start?</h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant mb-10 max-w-2xl mx-auto">
              Browse our collections curated by lifestyle, from 'Digital Nomad Sanctuaries' to 'Ultra-Private Island Retreats'.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white border border-outline-variant px-8 py-3 rounded-full hover:border-primary transition-all font-sans text-sm font-semibold hover:scale-95 cursor-pointer">
                Wellness &amp; Spa
              </button>
              <button className="bg-white border border-outline-variant px-8 py-3 rounded-full hover:border-primary transition-all font-sans text-sm font-semibold hover:scale-95 cursor-pointer">
                Adventure Luxury
              </button>
              <button className="bg-white border border-outline-variant px-8 py-3 rounded-full hover:border-primary transition-all font-sans text-sm font-semibold hover:scale-95 cursor-pointer">
                Modern Estates
              </button>
              <button className="bg-white border border-outline-variant px-8 py-3 rounded-full hover:border-primary transition-all font-sans text-sm font-semibold hover:scale-95 cursor-pointer">
                Island Escapes
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="font-display text-sm font-bold text-primary mb-2 block">
              LuxeStay
            </Link>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed">
              Elevating travel to an art form. Join us in exploring the world's most serene destinations.
            </p>
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
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Careers
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="font-sans text-xs text-on-surface-variant">© {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.</p>
            <div className="flex justify-center md:justify-end gap-4 mt-4 text-on-surface-variant">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">public</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">mail</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
