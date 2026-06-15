"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsIndicator } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  name: string;
  location: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  price: string;
  image: string;
  type?: string;
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  const upcomingBookings: Booking[] = [
    {
      id: "azure",
      name: "Azure Horizon Villa",
      location: "Santorini, Greece",
      bookingId: "LX-882910",
      checkIn: "Oct 24, 2024",
      checkOut: "Oct 30, 2024",
      price: "$4,250.00",
      image: "/images/azure-horizon.jpg",
      type: "hero",
    },
    {
      id: "celestial",
      name: "Celestial Towers",
      location: "Tokyo, Japan • Nov 12 - 15",
      bookingId: "LX-901122",
      checkIn: "Nov 12, 2024",
      checkOut: "Nov 15, 2024",
      price: "$1,890",
      image: "/images/celestial-towers.jpg",
    },
    {
      id: "alpine",
      name: "Alpine Whisper Chalet",
      location: "Zermatt, Switzerland • Dec 20 - 27",
      bookingId: "LX-994400",
      checkIn: "Dec 20, 2024",
      checkOut: "Dec 27, 2024",
      price: "$5,400",
      image: "/images/alpine-whisper.jpg",
    },
    {
      id: "indigo",
      name: "Indigo Reef Overwater",
      location: "Malé, Maldives • Jan 05 - 12",
      bookingId: "LX-112233",
      checkIn: "Jan 05, 2025",
      checkOut: "Jan 12, 2025",
      price: "$8,120",
      image: "/images/indigo-reef.jpg",
    },
  ];

  const pastBookings: Booking[] = [
    {
      id: "past1",
      name: "Kyoto Serenity Inn",
      location: "Kyoto, Japan",
      bookingId: "LX-441239",
      checkIn: "Apr 10, 2024",
      checkOut: "Apr 15, 2024",
      price: "$2,100",
      image: "/images/kyoto.jpg",
    },
    {
      id: "past2",
      name: "Aspen Hideaway",
      location: "Aspen, USA",
      bookingId: "LX-339218",
      checkIn: "Jan 15, 2024",
      checkOut: "Jan 20, 2024",
      price: "$3,800",
      image: "/images/aspen.jpg",
    },
  ];

  const cancelledBookings: Booking[] = [];

  const heroBooking = upcomingBookings.find((b) => b.type === "hero");
  const otherUpcoming = upcomingBookings.filter((b) => b.type !== "hero");

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
              className="font-sans text-sm font-semibold text-primary border-b-2 border-primary pb-1 transition-all duration-300"
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

      <main className="pt-32 pb-24 min-h-screen text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Dashboard Header */}
          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-2">My Bookings</h1>
            <p className="font-sans text-sm text-on-surface-variant">Manage your ethereal journeys and upcoming stays.</p>
          </div>

          {/* Tabs Selection */}
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full mb-8">
            <TabsList variant="line" className="relative flex gap-8 border-b border-outline-variant w-full justify-start rounded-none h-auto p-0 pb-px">
              <TabsIndicator className="absolute bottom-0 h-[3px] bg-primary rounded-full z-10" />
              <TabsTrigger
                value="upcoming"
                className="relative z-10 pb-5 font-sans text-base md:text-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-transparent data-active:text-primary border-none shadow-none after:hidden"
              >
                <span className="material-symbols-outlined text-xl md:text-2xl">event_upcoming</span> Upcoming Stays
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="relative z-10 pb-5 font-sans text-base md:text-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-transparent data-active:text-primary border-none shadow-none after:hidden"
              >
                <span className="material-symbols-outlined text-xl md:text-2xl">history</span> Past Trips
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="relative z-10 pb-5 font-sans text-base md:text-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-transparent data-active:text-primary border-none shadow-none after:hidden"
              >
                <span className="material-symbols-outlined text-xl md:text-2xl">cancel</span> Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Bookings Content */}
          {activeTab === "upcoming" && (
            <div className="grid grid-cols-12 gap-6">
              {/* Active Booking Hero (Larger Card) */}
              {heroBooking && (
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[24px] overflow-hidden card-shadow border border-white flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative min-h-[240px]">
                    <img
                      className="h-full w-full object-cover"
                      alt={heroBooking.name}
                      src={heroBooking.image}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-sans text-xs font-semibold shadow-lg">Next Trip</span>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">{heroBooking.name}</h3>
                          <p className="text-on-surface-variant font-sans text-sm flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-base">location_on</span> {heroBooking.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider">Booking ID</p>
                          <p className="font-sans text-sm font-bold text-on-surface">{heroBooking.bookingId}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-surface-container-low p-4 rounded-xl">
                          <p className="font-sans text-xs text-on-surface-variant mb-1">Check-in</p>
                          <p className="font-sans text-sm font-semibold text-on-surface">{heroBooking.checkIn}</p>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-xl">
                          <p className="font-sans text-xs text-on-surface-variant mb-1">Check-out</p>
                          <p className="font-sans text-sm font-semibold text-on-surface">{heroBooking.checkOut}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
                      <div>
                        <p className="font-sans text-xs text-on-surface-variant">Total Price</p>
                        <p className="font-display text-xl font-bold text-primary">{heroBooking.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="p-3 rounded-full border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer w-10 h-10">
                          <span className="material-symbols-outlined text-sm">download</span>
                        </Button>
                        <Button className="px-6 py-3 bg-on-surface text-surface hover:text-surface rounded-full font-sans text-xs font-semibold hover:opacity-90 transition-all cursor-pointer h-auto">
                          Manage Booking
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Upcoming Stays */}
              {otherUpcoming.map((booking) => (
                <div key={booking.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-[24px] overflow-hidden card-shadow border border-white flex flex-col">
                  <div className="h-48 relative">
                    <img className="h-full w-full object-cover" alt={booking.name} src={booking.image} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full">
                      <span className="material-symbols-outlined text-primary text-xl">bed</span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="mb-4">
                      <h3 className="font-display text-lg font-bold text-on-surface leading-tight mb-1">{booking.name}</h3>
                      <p className="text-on-surface-variant font-sans text-xs">{booking.location}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/50">
                      <div>
                        <p className="text-on-surface-variant font-sans text-xs">Booking ID</p>
                        <p className="font-sans text-xs font-bold">{booking.bookingId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-on-surface">{booking.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promotional Card */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-primary rounded-[24px] p-8 flex flex-col justify-between text-on-primary">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4">explore</span>
                  <h3 className="font-display text-xl font-bold mb-2">Plan your next escape</h3>
                  <p className="font-sans text-sm opacity-80 leading-relaxed">Discover exclusive members-only rates for your winter getaway.</p>
                </div>
                <Link href="/resorts" className="w-full mt-8 py-4 bg-white text-primary rounded-full font-sans text-sm font-semibold hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md">
                  Browse Destinations <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "past" && (
            <div className="grid grid-cols-12 gap-6">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <div key={booking.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-[24px] overflow-hidden card-shadow border border-white flex flex-col">
                    <div className="h-48 relative">
                      <img className="h-full w-full object-cover" alt={booking.name} src={booking.image} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full">
                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-display text-lg font-bold text-on-surface leading-tight mb-1">{booking.name}</h3>
                        <p className="text-on-surface-variant font-sans text-xs">{booking.location}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/50">
                        <div>
                          <p className="text-on-surface-variant font-sans text-xs">Booking ID</p>
                          <p className="font-sans text-xs font-bold">{booking.bookingId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg font-bold text-on-surface">{booking.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-12 py-16 bg-surface-container-low rounded-2xl text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">history</span>
                  <p className="font-sans text-sm text-on-surface-variant">No past trips found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "cancelled" && (
            <div className="grid grid-cols-12 gap-6">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking) => (
                  <div key={booking.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-[24px] overflow-hidden card-shadow border border-white flex flex-col opacity-60">
                    {/* Simplified structure */}
                  </div>
                ))
              ) : (
                <div className="col-span-12 py-20 bg-surface-container-lowest border border-dashed border-outline-variant rounded-[24px] text-center flex flex-col items-center justify-center p-8">
                  <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">cancel</span>
                  <h3 className="font-display text-lg font-bold text-on-surface mb-2">No cancelled bookings</h3>
                  <p className="font-sans text-xs text-on-surface-variant max-w-[280px]">Any bookings you cancel in the future will be listed here.</p>
                </div>
              )}
            </div>
          )}

          {/* Helpful Information Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface-container-low">
              <span className="material-symbols-outlined text-primary mb-3 text-3xl">support_agent</span>
              <h4 className="font-sans text-sm font-bold text-on-surface mb-2">24/7 Concierge</h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Our premium support team is available anytime to assist with your bookings.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low">
              <span className="material-symbols-outlined text-primary mb-3 text-3xl">security</span>
              <h4 className="font-sans text-sm font-bold text-on-surface mb-2">Safe &amp; Secure</h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">All your travel documents and payments are protected with top-tier encryption.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low">
              <span className="material-symbols-outlined text-primary mb-3 text-3xl">verified</span>
              <h4 className="font-sans text-sm font-bold text-on-surface mb-2">LuxeStay Guarantee</h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">We guarantee the quality of every property listed on our platform.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="font-display text-sm font-bold text-primary">
              LuxeStay
            </Link>
            <p className="font-sans text-xs text-on-surface-variant text-center md:text-left max-w-xs leading-relaxed">
              Elevating travel to an art form. Discover stays that transcend the ordinary.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">
              Privacy Policy
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">
              Terms of Service
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="/help">
              Help Center
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">
              Careers
            </Link>
          </div>
          <div className="text-on-surface-variant font-sans text-xs">
            © {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
