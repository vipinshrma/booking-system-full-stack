"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FaqItem[] = [
    {
      question: "How do I change my booking dates?",
      answer: "To change your booking dates, log in to your account, navigate to 'My Bookings', and select the reservation you wish to modify. Note that changes are subject to property availability and specific rate terms.",
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation policies vary by property and booking type. Most Flexible rates allow cancellation up to 48 hours before check-in for a full refund. Please review the 'Cancellation Terms' on your booking confirmation email.",
    },
    {
      question: "How can I earn LuxeRewards points?",
      answer: "Points are automatically earned for every eligible night stayed at a LuxeStay property. You can also earn bonus points through seasonal promotions or by using our partner services. Ensure you are logged in during booking!",
    },
    {
      question: "Is early check-in available?",
      answer: "Early check-in is subject to availability upon arrival. You can submit an early check-in request via the 'Special Requests' section during booking, and we will notify the host to try and accommodate your schedule.",
    },
  ];

  const categories = [
    {
      icon: "bed",
      title: "Bookings",
      description: "Manage reservations, cancellations, and special requests.",
      count: 12,
    },
    {
      icon: "payments",
      title: "Payments",
      description: "Billing, refunds, and accepted payment methods.",
      count: 8,
    },
    {
      icon: "star_rate",
      title: "LuxeRewards",
      description: "Everything about our loyalty program and benefits.",
      count: 15,
    },
    {
      icon: "security",
      title: "Safety",
      description: "Trust, safety protocols, and account security.",
      count: 10,
    },
  ];

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
              className="font-sans text-sm font-semibold text-primary border-b-2 border-primary pb-1 transition-all duration-300"
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

      <main className="pt-20 text-left">
        {/* Hero Section with Search */}
        <section className="relative w-full h-[450px] flex flex-col items-center justify-center text-center px-6 hero-gradient border-none">
          <div className="relative z-10 max-w-3xl mx-auto w-full">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface mb-6 leading-tight tracking-tight">
              How can we help you?
            </h1>
            <p className="font-sans text-base md:text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
              Search our knowledge base for instant answers or explore curated topics below.
            </p>
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
                <span className="material-symbols-outlined text-outline text-2xl group-focus-within:text-primary transition-colors">search</span>
              </div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm shadow-md"
                placeholder="Search for articles, bookings, or destinations..."
                type="text"
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="font-sans text-xs text-on-surface-variant px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                Popular: Refund Policy
              </span>
              <span className="font-sans text-xs text-on-surface-variant px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                Check-in times
              </span>
              <span className="font-sans text-xs text-on-surface-variant px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full">
                LuxeRewards
              </span>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-on-surface mb-4">Browse by Category</h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div key={idx} className="group p-8 bg-white rounded-3xl card-shadow border border-transparent hover:border-primary/20 transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-display text-lg font-bold mb-3 text-on-surface">{category.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant mb-4 leading-relaxed">{category.description}</p>
                <span className="text-primary font-sans text-sm font-semibold flex items-center gap-1">
                  {category.count} Articles <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-surface-container-low py-24">
          <div className="px-6 md:px-12 max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl font-bold text-on-surface mb-4">Frequently Asked Questions</h2>
              <p className="font-sans text-sm text-on-surface-variant">Quick answers to common queries from our travelers.</p>
            </div>
            <Accordion className="space-y-4 w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-2xl card-shadow border border-outline-variant/30 overflow-hidden transition-all duration-300 px-6 py-1 text-left"
                >
                  <AccordionTrigger className="font-display text-base font-bold text-on-surface hover:no-underline py-5 cursor-pointer flex items-center justify-between w-full">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-sans text-sm text-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-12">
              <button className="font-sans text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer">
                View All Help Articles
              </button>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 bg-inverse-surface text-inverse-on-surface flex flex-col justify-center min-h-[350px]">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-white">chat</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Live Chat Support</h2>
                <p className="font-sans text-sm md:text-base text-surface-variant/80 mb-8 max-w-md leading-relaxed">
                  Our support team is online and ready to help you in real-time. Typical response time is under 2 minutes.
                </p>
                <Button className="bg-primary text-on-primary px-10 py-6 rounded-full font-sans text-sm font-semibold shadow-xl hover:opacity-90 active:scale-95 transition-all w-fit cursor-pointer h-auto">
                  Start Chat Now
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 bg-white border border-outline-variant/30 flex flex-col justify-center min-h-[350px] card-shadow">
              <div className="relative z-10 text-left">
                <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-8 text-on-surface shadow-sm">
                  <span className="material-symbols-outlined text-4xl">mail</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-on-surface">Email Assistance</h2>
                <p className="font-sans text-sm md:text-base text-on-surface-variant mb-8 max-w-md leading-relaxed">
                  Send us a detailed message about your inquiry and our experts will get back to you within 24 hours.
                </p>
                <Button variant="outline" className="border-primary text-primary px-10 py-6 rounded-full font-sans text-sm font-semibold hover:bg-primary/5 active:scale-95 transition-all w-fit cursor-pointer h-auto bg-transparent">
                  Send an Email
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Anchor: Map Section */}
        <section className="mb-24 px-6 md:px-12 max-w-7xl mx-auto h-[400px] rounded-[32px] overflow-hidden relative group card-shadow">
          <img
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-700"
            alt="Minimalist topographical map of global experience centers"
            src="/images/global-hubs-map.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-surface/40 to-transparent flex items-end p-8 md:p-12">
            <div className="max-w-lg text-left">
              <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-2">Visit Our Global Hubs</h3>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Prefer in-person assistance? Our global experience centers are located in over 25 cities worldwide.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="font-display text-sm font-bold text-primary">
              LuxeStay
            </Link>
            <p className="font-sans text-xs text-on-surface-variant">© {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="font-sans text-xs font-semibold text-primary underline transition-colors" href="/help">
              Help Center
            </Link>
            <Link className="font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Careers
            </Link>
          </div>
          <div className="flex gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">language</span>
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">public</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
