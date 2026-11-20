"use client";

import { useState } from "react";
import Image from "next/image";

const footerSections = [
  {
    title: "Resources",
    links: [
      "Health Recipes",
      "Dr Nutrition Blog",
      "BMI Calculator",
      "Healthy Package",
    ],
  },
  {
    title: "Quick Links",
    links: ["Stacks & Combos", "Clearance", "Wholesale"],
  },
  {
    title: "Customer Service",
    links: [
      "Shipping & Delivery",
      "FAQ",
      "Return Policy",
      "Privacy & Policy",
      "Terms Of Use",
      "Original Products",
    ],
  },
  {
    title: "Popular Brands",
    links: [
      "Laperva",
      "Body Builder",
      "Applied Nutrition",
      "Optimum Nutrition",
      "MuscleTech",
      "Universal Nutrition",
      "Cellucor",
      "Olimp Sport Nutrition",
    ],
  },
  {
    title: "Categories",
    links: [
      "Sports Nutrition",
      "Health & Wellness",
      "Weight Management",
      "Accessories & Activewear",
      "Healthy Foods",
      "Multivitamins",
      "Whey Protein",
    ],
  },
];

const socialMedia = [
  { name: "Facebook", icon: "f" },
  { name: "Instagram", icon: "◎" },
  { name: "LinkedIn", icon: "in" },
  { name: "Snapchat", icon: "👻" },
  { name: "TikTok", icon: "♪" },
  { name: "Twitter", icon: "𝕏" },
  { name: "YouTube", icon: "▶" },
];

const appStores = [
  { top: "Download on the", bottom: "App Store", icon: "" },
  { top: "GET IT ON", bottom: "Google Play", icon: "▶" },
  { top: "EXPLORE IT ON", bottom: "AppGallery", icon: "✿" },
];

function FooterSection({ title, links }: { title: string; links: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 lg:border-0">
      {/* Desktop */}
      <div className="hidden lg:block">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
          {title}
        </h3>

        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={link} className="text-sm text-gray-400">
              {link}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-4 text-white font-semibold text-sm uppercase tracking-wider"
        >
          {title}

          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
          className={`grid transition-all duration-200 ${
            isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link} className="text-sm text-gray-400">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 text-gray-300" dir="ltr">
      <div className="container mx-auto px-4 pt-12 pb-6">
        {/* Logo and Contact */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-gray-700">
          <div className="flex-shrink-0">
            <Image
              src="/images/logo_4.png"
              alt="Dr. Nutrition"
              width={160}
              height={48}
              className="h-12 w-auto brightness-0 invert"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <div className="inline-flex items-center gap-2.5 bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-300">
                <span className="text-primary">☎</span>
                <span dir="ltr">+971 4 204 0700</span>
              </div>

              <div className="inline-flex items-center gap-2.5 bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-300">
                <span className="text-primary">✉</span>
                <span>customerservice@drnutrition.com</span>
              </div>

              <div className="inline-flex items-center gap-2.5 bg-green-800/40 border border-green-700/30 rounded-full px-4 py-2 text-sm text-green-400">
                <span>◉</span>
                <span>WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Footer Sections */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 py-10">
          {footerSections.map((section) => (
            <FooterSection
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        {/* Mobile Footer Sections */}
        <div className="lg:hidden divide-y divide-gray-700 py-6">
          {footerSections.map((section) => (
            <FooterSection
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        {/* Social Media and App Stores */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-700">
          {/* Social Media */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm font-medium text-gray-400 hidden sm:inline">
              Follow Us
            </span>

            {socialMedia.map((social) => (
              <div
                key={social.name}
                title={social.name}
                aria-label={social.name}
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm font-semibold"
              >
                {social.icon}
              </div>
            ))}
          </div>

          {/* App Store Badges */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {appStores.map((store) => (
              <div
                key={store.bottom}
                className="inline-flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2.5"
              >
                <span className="text-2xl">{store.icon}</span>

                <div>
                  <div className="text-[10px] leading-none opacity-80">
                    {store.top}
                  </div>
                  <div className="text-sm font-semibold leading-tight">
                    {store.bottom}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t border-gray-800">
          Copyright © Dr. Nutrition 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
