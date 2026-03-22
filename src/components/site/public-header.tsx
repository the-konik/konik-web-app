"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEGA_MENU: Record<string, { featured: string[]; explore: string[]; images: { src: string; label: string; href: string }[] }> = {
  "/shop": {
    featured: ["New Arrivals", "Best Sellers", "Athleisure Collection", "Essentials", "Seamless Collection"],
    explore: ["T-Shirts", "Hoodies & Jackets", "Joggers & Pants", "Shorts", "Accessories", "Limited Editions"],
    images: [
      { src: "/discipline-uniform.png", label: "RECOMMENDED FOR YOU", href: "/shop" },
      { src: "/hero-legacy.png", label: "NEW ARRIVALS", href: "/shop" },
      { src: "/hero-mustang.png", label: "ACCESSORIES", href: "/shop" },
    ],
  },
  "/tools": {
    featured: ["Habit Engine", "Goal Architect", "Legacy Planner", "Mind Forge"],
    explore: ["Productivity", "Focus Sessions", "Daily Trackers", "Weekly Reviews", "Journaling"],
    images: [
      { src: "/hero-tools.png", label: "POPULAR SYSTEMS", href: "/tools" },
      { src: "/hero-levelup.png", label: "START A SYSTEM", href: "/tools" },
    ],
  },
  "/plans": {
    featured: ["Free Tier", "Legacy Pro", "VIP Membership"],
    explore: ["Compare Plans", "Upgrade", "Benefits", "Community"],
    images: [
      { src: "/hero-levelup.png", label: "CHOOSE YOUR PATH", href: "/plans" },
      { src: "/hero-mustang.png", label: "VIP LIFESTYLE", href: "/plans" },
      { src: "/hero-tools.png", label: "UNLOCK SYSTEMS", href: "/plans" },
    ],
  },
};

const MAIN_NAV = [
  { href: "/shop", label: "The Collections" },
  { href: "/tools", label: "The Systems" },
  { href: "/plans", label: "The Paths" },
] as const;

const TOP_NAV = [
  { href: "/auth/register", label: "Start My Legacy" },
  { href: "/company#about", label: "ABOUT KONIK" },
  { href: "/help", label: "FEEDBACK" },
  { href: "/auth/login", label: "LOG IN" },
] as const;

const ANNOUNCEMENTS = [
  "Make It Happen — No Excuses",
  "Build Your Legacy",
  "Standard Shipping — Free",
  "Elite Performance — No Shortcuts"
] as const;

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel timer logic
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Determine theme based on scroll and page
  const isTransparent = isHomePage && !scrolled && !activeMenu;
  const headerTextColor = isTransparent ? "text-[#FFFFFF]" : "text-[#121212]";
  const navHoverColor = isTransparent ? "hover:text-[#FFFFFF]/70" : "hover:text-[#B8860B]";
  const iconColor = isTransparent ? "#FFFFFF" : "#121212";

  const handleMenuEnter = (href: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(href);
  };

  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 200);
  };

  const handleDropdownEnter = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
  };

  const handleDropdownLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* ── Tier 1: Top Utility Bar ── */}
      <motion.div 
        initial={false}
        animate={{ 
          height: scrolled ? 0 : "auto",
          opacity: scrolled ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block bg-[#F8F8F8] overflow-hidden whitespace-nowrap"
        style={{ borderBottomWidth: scrolled ? 0 : 1, borderBottomStyle: "solid", borderBottomColor: "#E5E7EB" }}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 lg:px-12 py-2 text-[11px] font-bold tracking-tight text-[#121212] grid grid-cols-3">
          <div className="flex-1" />
          
          {/* Announcement Carousel */}
          <div 
            className="text-center font-poppins flex-1 col-start-2 h-4 relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={ANNOUNCEMENTS[msgIndex]}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="absolute left-1/2 -translate-x-1/2 top-0 text-[11px] font-medium text-[#4B5563] tracking-wide uppercase whitespace-nowrap cursor-default"
              >
                {ANNOUNCEMENTS[msgIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-1 items-center justify-end gap-5">
            {TOP_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#B8860B] transition-colors uppercase whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Top Bar ── */}
      <motion.div 
        initial={false}
        animate={{ 
          height: scrolled ? 0 : "auto",
          opacity: scrolled ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden bg-[#F8F8F8] text-center overflow-hidden"
        style={{ borderBottomWidth: scrolled ? 0 : 1, borderBottomStyle: "solid", borderBottomColor: "#E5E7EB" }}
      >
        <div className="py-1.5 px-4 w-full">
          <div 
            className="h-4 relative overflow-hidden w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={ANNOUNCEMENTS[msgIndex]}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="absolute left-1/2 -translate-x-1/2 top-0 text-[10px] sm:text-[11px] font-medium text-[#4B5563] uppercase tracking-wide whitespace-nowrap"
              >
                {ANNOUNCEMENTS[msgIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Tier 2: Main Navigation ── */}
      <div
        className={`transition-all duration-300 border-b ${
          isTransparent 
            ? "bg-transparent border-transparent py-4 md:py-6" 
            : "bg-[#FFFFFF] border-[#E5E7EB] py-2 md:py-3 shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-12 gap-4 lg:gap-8 grid grid-cols-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src={isTransparent ? "/KONIK%20NEW%20-%20WHITE.png" : "/KONIK%20NEW%20-%20BLACK.png"}
                alt="KONIK Logo"
                width={25}
                height={25}
                className="object-contain transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav with Mega Menu triggers */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-12 flex-1 justify-center col-start-2 text-center">
            {MAIN_NAV.map(({ href, label }) => (
              <div
                key={href}
                className="relative py-2"
                onMouseEnter={() => handleMenuEnter(href)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={href}
                  className={`text-[12px] font-bold tracking-tight transition-colors duration-200 whitespace-nowrap ${navHoverColor} ${
                    pathname === href || pathname.startsWith(href + "/") || activeMenu === href
                    ? (isTransparent && activeMenu !== href ? "text-[#FFFFFF] underline underline-offset-8 decoration-2" : "text-[#121212] underline underline-offset-8 decoration-2")
                    : headerTextColor
                  }`}
                >
                  {label}
                </Link>
                {/* Invisible bridge to connect nav item to dropdown */}
                {activeMenu === href && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[200px] h-6" />
                )}
              </div>
            ))}
          </nav>

          {/* Right side — search + icons */}
          <div className={`col-start-3 flex items-center gap-2 sm:gap-4 md:gap-5 justify-end ${headerTextColor}`}>
            {/* Desktop search */}
            <div className={`hidden lg:flex relative items-center max-w-[200px] xl:max-w-xs group`}>
              <div className={`absolute left-0 h-10 w-10 flex border items-center justify-center rounded-l-full transition-colors ${
                isTransparent 
                  ? "bg-white/10 border-white/20 group-hover:bg-white/20" 
                  : "bg-[#F8F8F8] border-[#E7E7EB] group-hover:bg-[#E5E7EB]"
              }`}>
                <Search className="w-4 h-4" color={iconColor} />
              </div>
              <input  
                type="text"
                placeholder="Search"
                className={`w-full h-10 pl-11 pr-4 rounded-full border text-sm font-medium focus:outline-none focus:ring-1 transition-all ${
                  isTransparent
                    ? "bg-white/10 border-white/20 placeholder:text-white/50 text-white focus:ring-white/40"
                    : "bg-[#F8F8F8] border-[#E7E7EB] placeholder:text-[#4B5563] text-[#121212] focus:ring-[#121212]"
                }`}
              />
            </div>

            {/* Mobile search */}
            <button className={`lg:hidden p-1.5 rounded-full flex items-center justify-center transition-colors ${
              isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
            }`}>
              <Search className="w-5 h-5" color={iconColor} strokeWidth={1.5} />
            </button>

            <button className={`flex p-1.5 flex items-center justify-center rounded-full transition-colors ${
              isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
            }`}>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" color={iconColor} strokeWidth={1.5} />
            </button>

            <Link href="/cart" className={`p-1.5 rounded-full flex items-center justify-center transition-colors relative ${
              isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
            }`}>
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" color={iconColor} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-[#B8860B] text-[#FFFFFF] text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              className={`lg:hidden p-1.5 rounded-full flex items-center justify-center transition-colors ${
                isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
              }`}
            >
              <Menu className="w-6 h-6" color={iconColor} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mega Menu Dropdown ── */}
      <AnimatePresence>
        {activeMenu && MEGA_MENU[activeMenu] && (
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block absolute left-0 right-0 bg-[#FFFFFF] border-b border-[#E5E7EB] shadow-lg z-[48] overflow-hidden"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="mx-auto max-w-[1440px] px-12 py-10 flex gap-16">
              {/* Left Columns: Featured + Explore */}
              <div className="flex gap-14 min-w-[280px] shrink-0">
                <div>
                  <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#121212] mb-5">
                    Featured
                  </h4>
                  <ul className="space-y-3">
                    {MEGA_MENU[activeMenu].featured.map((item) => (
                      <li key={item}>
                        <Link
                          href={activeMenu}
                          className="text-[13px] text-[#4B5563] hover:text-[#121212] transition-colors duration-200 block"
                          onClick={() => setActiveMenu(null)}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#121212] mb-5">
                    Explore
                  </h4>
                  <ul className="space-y-3">
                    {MEGA_MENU[activeMenu].explore.map((item) => (
                      <li key={item}>
                        <Link
                          href={activeMenu}
                          className="text-[13px] text-[#4B5563] hover:text-[#121212] transition-colors duration-200 block"
                          onClick={() => setActiveMenu(null)}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Image Cards */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                {MEGA_MENU[activeMenu].images.map((img) => (
                  <Link
                    key={img.label}
                    href={img.href}
                    className="relative aspect-[4/3] overflow-hidden group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#121212]/40 group-hover:bg-[#121212]/50 transition-colors" />
                    <span className="absolute bottom-4 left-4 text-[11px] font-bold tracking-[0.15em] uppercase text-[#FFFFFF]">
                      {img.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer (Obsidian Black) ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[59] bg-[#121212]/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[60] w-[75vw] bg-[#121212] transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close */}
        <div className="flex justify-end p-5">
          <button
            onClick={() => setOpen(false)}
            className="text-[#FFFFFF] p-2 hover:bg-[#FFFFFF]/10 rounded-full transition-colors"
          >
            <X className="w-7 h-7" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-8 sm:px-10 pb-10">
          {/* Main links */}
          <nav className="space-y-7 mb-10">
            {MAIN_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block text-[16px] sm:text-[20px] font-bold tracking-widest uppercase font-atmospheric transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-[#B8860B]"
                    : "text-[#FFFFFF] hover:text-[#FFFFFF]/70"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Secondary */}
          <div className="border-t border-[#FFFFFF]/10 pt-8 mb-8 space-y-5">
            <Link
              href="/plans"
              className="block text-[16px] sm:text-[20px] font-bold tracking-widest uppercase font-atmospheric text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Start My Legacy
            </Link>
            <Link
              href="/about"
              className="block text-[16px] sm:text-[20px] font-bold tracking-widest uppercase font-atmospheric text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              About Konik
            </Link>
            <Link
              href="/feedback"
              className="block text-[16px] sm:text-[20px] font-bold tracking-widest uppercase font-atmospheric text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Feedback
            </Link>
            <Link
              href="/help"
              className="block text-[16px] sm:text-[20px] font-bold tracking-widest uppercase font-atmospheric text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Help
            </Link>
          </div>

          {/* CTA copy */}
          <p className="text-[#FFFFFF]/50 text-[15px] leading-relaxed mb-8 pr-4">
            Become a KONIKER, unlock premium products, real inspiration, and
            powerful stories that fuel your journey.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <Link
              href="/auth/register"
              onClick={() => setOpen(false)}
              className="flex-1 bg-[#FFFFFF] text-[#121212] py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#F8F8F8] transition-colors"
            >
              Join Us
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="flex-1 border-2 border-[#FFFFFF] text-[#FFFFFF] py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#FFFFFF]/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
