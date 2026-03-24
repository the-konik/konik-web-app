"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Package, CreditCard, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniCart } from "@/components/cart/mini-cart";
import { useSession, signOut } from "next-auth/react";

type MegaMenuColumn = {
  title: string;
  items: string[];
};

type MegaMenuData = {
  columns: MegaMenuColumn[];
  images: { src: string; label: string; href: string }[];
};

const MEGA_MENU: Record<string, MegaMenuData> = {
  "/shop?category=APPAREL": {
    columns: [
      { title: "Just for You: Essentials", items: ["Regular T-Shirts", "Premium Polos", "Minimalist Hoodies", "Oversized Tees", "Compression Tees"] },
      { title: "Bottom Wear", items: ["Premium Denims", "Tailored Pants", "Gym Shorts", "Joggers"] },
      { title: "Performance Wear", items: ["Sweat-wicking Gym Shirts", "Compression Wear", "Training Sets", "Lightweight Training Jackets"] },
      { title: "Outerwear", items: ["Minimalist Jackets", "Bomber Jackets", "Windbreakers"] },
      { title: "Recovery Gear", items: ["Minimal Sleepwear", "Recovery Hoodies"] },
    ],
    images: [
      { src: "/discipline-uniform.png", label: "The Uniform", href: "/shop?category=APPAREL" },
      { src: "/hero-legacy.png", label: "Elite Performance", href: "/shop?category=APPAREL" },
      { src: "/hero-training.png", label: "Discipline Gear", href: "/shop?category=APPAREL" },
    ],
  },
  "/shop?category=FOOTWEAR": {
    columns: [
      { title: "Just for You: Daily", items: ["White Sneakers", "Minimal Black Sneakers"] },
      { title: "Smart Casual", items: ["Loafers", "Leather Slip-ons"] },
      { title: "Performance", items: ["Training Shoes", "Running Shoes", "Gym Shoes (Flat Sole)"] },
      { title: "Lifestyle Edge", items: ["High-top Sneakers", "Streetwear Sneakers"] },
    ],
    images: [
      { src: "/hero-footwear.png", label: "The Rotation", href: "/shop?category=FOOTWEAR" },
      { src: "/sneakers-minimal.png", label: "Daily Presence", href: "/shop?category=FOOTWEAR" },
      { src: "/shoes-gym.png", label: "Technical Movement", href: "/shop?category=FOOTWEAR" },
    ],
  },
  "/shop?category=ACCESSORIES": {
    columns: [
      { title: "Just for You: Wearables", items: ["Caps", "Rings", "Chains / Necklaces", "Bracelets"] },
      { title: "Functional Daily Carry", items: ["Wallets", "Card Holders", "Premium Belts", "Crossbody Bags", "Backpacks"] },
      { title: "Lifestyle Gear", items: ["Water Bottles", "Gym Towels", "Grip Straps"] },
      { title: "Grooming", items: ["Beard Kits", "Skincare Basics", "Signature Perfume"] },
    ],
    images: [
      { src: "/hero-accessories.png", label: "The Details", href: "/shop?category=ACCESSORIES" },
      { src: "/accessories-jewelry.png", label: "Masculine Identity", href: "/shop?category=ACCESSORIES" },
      { src: "/grooming-kit.png", label: "Elite Grooming", href: "/shop?category=ACCESSORIES" },
    ],
  },
  "/tools": {
    columns: [
      { title: "Just for You: Best System", items: ["Legacy Life Builder", "Budget Planner"] },
      { title: "Build Legacy Life", items: ["Habit Architect", "Goal Engine"] },
      { title: "Plan Legacy Budget", items: ["Wealth Control", "Focus Sessions"] },
    ],
    images: [
      { src: "/system-legacy.png", label: "Best System", href: "/tools" },
      { src: "/hero-levelup.png", label: "Build Legacy Life", href: "/tools" },
      { src: "/hero-tools.png", label: "Plan Legacy Budget", href: "/tools" },
    ],
  },
};

const MAIN_NAV = [
  { href: "/shop?category=APPAREL", label: "Apparel" },
  { href: "/shop?category=FOOTWEAR", label: "Footwear" },
  { href: "/shop?category=ACCESSORIES", label: "Accessories" },
  { href: "/tools", label: "Systems" },
] as const;

const TOP_NAV = [
  { href: "/auth/register", label: "Start My Legacy" },
  { href: "/company#about", label: "About KONIK" },
  { href: "/auth/login", label: "Log In" },
] as const;

const ANNOUNCEMENTS = [
  "Make It Happen — No Excuses",
  "Build Your Legacy With KONIK",
  "Shipping Free Over LKR 10 000",
] as const;

export function PublicHeader() {
  return (
    <Suspense>
      <PublicHeaderContent />
    </Suspense>
  );
}

function PublicHeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState<{ text: string; href: string }[]>([]);

  // Fetch announcements
  useEffect(() => {
    fetch("/api/settings/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDynamicAnnouncements(data);
        }
      })
      .catch(() => {});
  }, []);

  const announcementsToDisplay = dynamicAnnouncements.length > 0 
    ? dynamicAnnouncements 
    : ANNOUNCEMENTS.map(text => ({ text, href: "/shop" }));
  const [profileOpen, setProfileOpen] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomePage = pathname === "/";

  const isLinkActive = (href: string) => {
    if (activeMenu === href) return true;
    const [path, query] = href.split('?');
    if (pathname !== path) return false;
    if (!query) return true;
    const category = new URLSearchParams(query).get("category");
    return currentCategory === category;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel timer logic
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % announcementsToDisplay.length);
    }, 4500); // 4.5s for smoother reading
    return () => clearInterval(interval);
  }, [isHovered, announcementsToDisplay.length]);

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
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full"
      onMouseLeave={() => setActiveMenu(null)}
    >
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
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 lg:px-12 py-1 text-[12px] font-bold tracking-tight text-[#121212] grid grid-cols-3">
          <div className="flex-1" />
          
          {/* Announcement Carousel */}
          <div 
            className="text-center font-poppins flex-1 col-start-2 h-5 relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <Link 
                href={announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.href || "/shop"} 
                className="absolute inset-0 z-10" 
              />
              <motion.div
                key={announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-1/2 underline -translate-x-1/2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-[#555] tracking-wide whitespace-nowrap cursor-pointer hover:text-[#222] transition-colors"
              >
                {announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.text}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-1 items-center justify-end gap-5">
            {session ? (
              <>
                <Link href="/auth/register" className="hover:text-[#B8860B] text-[#121212] font-poppins transition-colors whitespace-nowrap">
                   Start My Legacy
                </Link>
                <Link href="/company#about" className="hover:text-[#B8860B] text-[#121212] font-poppins transition-colors whitespace-nowrap">
                   About KONIK
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-[#EF4444] text-[#EF4444] font-bold font-poppins transition-colors whitespace-nowrap"
                >
                  Log Out
                </button>
              </>
            ) : (
              TOP_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#B8860B] text-[#121212] font-poppins transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Top Bar ── */}
      <motion.div 
        initial={false}
        animate={{ 
          height: "auto",
          opacity: 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden bg-[#F8F8F8] text-center overflow-hidden"
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E5E7EB" }}
      >
        <div className="py-2.5 px-4 w-full">
          <div 
            className="h-6 relative overflow-hidden w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <Link 
                href={announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.href || "/shop"} 
                className="absolute inset-0 z-10" 
              />
              <motion.div
                key={announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] font-bold text-[#4B5563] tracking-wide underline underline-offset-4 whitespace-nowrap"
              >
                {announcementsToDisplay[msgIndex % announcementsToDisplay.length]?.text}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Tier 2: Main Navigation ── */}
      <div
        className={`transition-all duration-300 border-b ${
          isTransparent 
            ? "bg-transparent border-transparent py-3 md:py-2.5" 
            : "bg-[#FFFFFF] border-[#E5E7EB] py-2 md:py-1.5 shadow-sm"
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
                className="object-contain transition-all duration-300 w-[28px] h-[28px] md:w-[35px] md:h-[35px]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav with Mega Menu triggers */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-12 flex-1 justify-center col-start-2 text-center">
            {MAIN_NAV.map(({ href, label }) => (
              <div
                key={href}
                className="relative"
                onMouseEnter={() => setActiveMenu(href)}
              >
                <Link
                  href={href}
                  className={`text-[14px] font-bold tracking-tight transition-colors duration-200 whitespace-nowrap block py-4 ${navHoverColor} ${
                    isLinkActive(href)
                    ? (isTransparent && activeMenu !== href ? "text-[#FFFFFF] underline underline-offset-8 decoration-2" : "text-[#121212] underline underline-offset-8 decoration-2")
                    : headerTextColor
                  }`}
                >
                  {label}
                </Link>
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
            <button className={`lg:hidden p-2.5 rounded-full flex items-center justify-center transition-colors ${
              isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
            }`}>
              <Search className="w-5 h-5 md:w-7 md:h-7" color={iconColor} strokeWidth={1.5} />
            </button>

            <button className={`flex p-2.5 items-center justify-center rounded-full transition-colors ${
              isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
            }`}>
              <Heart className="w-5 h-5 md:w-8 md:h-8" color={iconColor} strokeWidth={1.5} />
            </button>

            <MiniCart 
              isTransparent={isTransparent} 
              iconColor={iconColor} 
            />

            {/* User Profile Dropdown (Desktop & Mobile) */}
            {session && (
              <div 
                className="relative hidden lg:block"
                onMouseEnter={() => {
                  if (profileTimeout.current) clearTimeout(profileTimeout.current);
                  setProfileOpen(true);
                }}
                onMouseLeave={() => {
                  profileTimeout.current = setTimeout(() => setProfileOpen(false), 200);
                }}
              >
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                    isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
                  }`}
                >
                  <UserIcon className="w-5 h-5 md:w-8 md:h-8" color={iconColor} strokeWidth={1.5} />
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full pt-2 w-64 z-[100]"
                    >
                      <div className="bg-[#FFFFFF] border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden backdrop-blur-xl">
                         {/* User Info - Ultra Minimal */}
                         <div className="px-4 py-3 border-b border-[#F3F4F6]">
                            <p className="text-[11px] font-bold text-[#121212] truncate uppercase tracking-tight font-poppins">{session.user?.name || session.user?.email}</p>
                         </div>
                         
                         {/* Links - Text Only */}
                         <div className="p-1.5 space-y-0.5">
                            {[
                              { href: "/dashboard/dashboard", label: "Dashboard" },
                              { href: "/dashboard/dashboard/orders", label: "Orders" },
                              { href: "/dashboard/dashboard/subscription", label: "Membership" },
                              { href: "/dashboard/dashboard/profile", label: "Profile" },
                            ].map(item => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563] hover:bg-[#F8F8F8] hover:text-[#121212] transition-colors font-poppins"
                                onClick={() => setProfileOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              className={`lg:hidden p-2.5 rounded-full flex items-center justify-center transition-colors ${
                isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
              }`}
            >
              <Menu className="w-6 h-6 md:w-8 md:h-8" color={iconColor} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mega Menu Dropdown ── */}
      <AnimatePresence>
        {activeMenu && MEGA_MENU[activeMenu] && (
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden lg:block absolute top-full left-0 right-0 bg-[#FFFFFF] border-b border-[#E5E7EB] shadow-2xl z-50 overflow-hidden"
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >
            <div className="mx-auto max-w-[1920px] px-6 lg:px-12 py-14">
              <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
                {/* Left: Categories Grid */}
                <div className="flex-1 flex flex-wrap gap-x-16 xl:gap-x-20 gap-y-12">
                  {MEGA_MENU[activeMenu].columns.map((col) => {
                    const isSpecial = col.title.includes("Just for You");
                    return (
                      <div key={col.title} className="flex flex-col min-w-0">
                        <h4 className="text-[11px] font-bold tracking-normal text-[#121212] mb-8 font-poppins flex items-center gap-2 min-h-[20px] whitespace-nowrap">
                          {isSpecial && <Sparkles className="w-3 h-3 text-[#B8860B] shrink-0" />}
                          <span className={isSpecial ? "text-[#B8860B]" : ""}>
                            {col.title.replace("Just for You: ", "")}
                          </span>
                        </h4>
                        <ul className="space-y-4">
                          {col.items.map((item) => (
                            <li key={item}>
                              <Link
                                href={activeMenu}
                                className="text-[11px] text-[#4B5563] hover:text-[#B8860B] transition-colors duration-200 block font-poppins whitespace-nowrap"
                                onClick={() => setActiveMenu(null)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Image Cards */}
                <div className="w-full lg:w-[320px] xl:w-[450px] shrink-0">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {MEGA_MENU[activeMenu].images.map((img) => (
                      <Link
                        key={img.label}
                        href={img.href}
                        className="relative aspect-[3/4] xl:aspect-[4/5] overflow-hidden group rounded-sm shadow-sm"
                        onClick={() => setActiveMenu(null)}
                      >
                        <Image
                          src={img.src}
                          alt={img.label}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="text-[9px] font-bold tracking-normal text-[#FFFFFF] font-poppins drop-shadow-lg block leading-tight truncate">
                            {img.label}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
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
        className={`fixed top-0 right-0 bottom-0 z-[60] w-[85vw] bg-[#121212] transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close */}
        <div className="flex justify-end p-5">
          <button
            onClick={() => setOpen(false)}
            className="text-[#FFFFFF] p-2 hover:bg-[#FFFFFF]/10 rounded-full transition-colors"
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-8 sm:px-10 pb-10 relative">
          {session && (
            <div className="mb-8 pb-8 border-b border-[#FFFFFF]/5">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center flex-shrink-0">
                     <UserIcon className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                     <span className="inline-block px-2 py-0.5 rounded-full bg-[#B8860B]/10 text-[8px] font-bold tracking-widest text-[#B8860B] mb-1 font-poppins">Account Active</span>
                     <p className="text-[14px] font-bold text-[#FFFFFF] font-poppins leading-tight truncate tracking-tight">{session.user?.name || session.user?.email}</p>
                  </div>
               </div>
               
               {/* User Settings Dropdown */}
               <div className="space-y-1">
                 <button
                   onClick={() => setProfileOpen(!profileOpen)}
                   className="flex items-center justify-between w-full text-[11px] font-bold tracking-[0.2em] text-[#B8860B] font-poppins py-2"
                 >
                   <span>User Settings</span>
                   <motion.span
                     animate={{ rotate: profileOpen ? 180 : 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Menu className="w-4 h-4 opacity-50" />
                   </motion.span>
                 </button>
                 
                 <AnimatePresence>
                   {profileOpen && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-[#FFFFFF]/5 rounded-xl mt-2 px-2"
                     >
                       <div className="py-2 space-y-1">
                         {[
                           { href: "/dashboard/dashboard", label: "Overview" },
                           { href: "/dashboard/dashboard/orders", label: "My Orders" },
                           { href: "/dashboard/dashboard/subscription", label: "Membership" },
                           { href: "/dashboard/dashboard/profile", label: "Profile Settings" },
                         ].map(item => (
                           <Link
                             key={item.href}
                             href={item.href}
                             className="block px-3 py-2.5 text-[11px] font-bold text-[#FFFFFF]/60 hover:text-[#B8860B] tracking-widest transition-colors font-poppins"
                             onClick={() => {
                               setOpen(false);
                               setProfileOpen(false);
                             }}
                           >
                             {item.label}
                           </Link>
                         ))}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          )}

          {/* Main links */}
          <nav className="space-y-4 mb-10 overflow-x-hidden">
            {MAIN_NAV.map(({ href, label }) => (
              <div key={href} className="border-b border-[#FFFFFF]/5 pb-4">
                <button
                  onClick={() => setMobileActiveCategory(mobileActiveCategory === href ? null : href)}
                  className={`flex items-center justify-between w-full text-left text-[14px] sm:text-[16px] font-bold tracking-widest font-poppins transition-colors ${
                    isLinkActive(href) || mobileActiveCategory === href
                      ? "text-[#B8860B]"
                      : "text-[#FFFFFF]"
                  }`}
                >
                  <span>{label}</span>
                  <motion.span
                    animate={{ rotate: mobileActiveCategory === href ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-4 h-4 opacity-30" />
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {mobileActiveCategory === href && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 space-y-8 pl-4 border-l border-[#B8860B]/20 ml-2">
                        {MEGA_MENU[href].columns.map(col => (
                          <div key={col.title}>
                            <h5 className="text-[11px] font-bold tracking-normal text-[#B8860B] mb-3 font-poppins truncate">
                              {col.title}
                            </h5>
                            <ul className="space-y-3">
                              {col.items.map(item => (
                                <li key={item}>
                                  <Link
                                    href={href}
                                    onClick={() => setOpen(false)}
                                     className="text-[12px] font-medium text-[#FFFFFF]/50 hover:text-[#FFFFFF] block font-poppins"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        
                        {/* Mobile Category Action */}
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                           className="inline-block pt-4 text-[10px] font-bold tracking-widest text-[#B8860B] border-b border-[#B8860B]/30 pb-1 font-poppins"
                        >
                          View Full Collection
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Secondary */}
          <div className="pt-2 mb-8 space-y-5">
            <Link
              href="/plans"
              className="block text-[14px] sm:text-[16px] font-bold tracking-widest font-poppins text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Start My Legacy
            </Link>
            <Link
              href="/company"
              className="block text-[14px] sm:text-[16px] font-bold tracking-widest font-poppins text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              About Konik
            </Link>
            <Link
              href="/feedback"
              className="block text-[14px] sm:text-[16px] font-bold tracking-widest font-poppins text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Feedback
            </Link>
            <Link
              href="/help"
              className="block text-[14px] sm:text-[16px] font-bold tracking-widest font-poppins text-[#FFFFFF] hover:text-[#FFFFFF]/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              Help
            </Link>
          </div>

          {/* CTA copy */}
           <p className="text-[#FFFFFF]/50 text-[14px] font-poppins leading-relaxed mb-8 pr-4">
             Unlock premium systems, elite performance gear, and 
             the framework for your relentless pursuit.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            {!session && (
              <>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                   className="w-full bg-[#FFFFFF] text-[#121212] py-4 rounded-full text-center text-[10px] sm:text-[11px] font-bold tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors font-poppins"
                >
                  Join the Legacy
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="w-full border border-[#FFFFFF] text-[#FFFFFF] py-4 rounded-full text-center text-[10px] sm:text-[11px] font-bold tracking-[0.2em] hover:bg-[#FFFFFF]/10 transition-colors font-poppins"
                >
                  Log In
                </Link>
              </>
            )}
            {session && (
               <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full border border-[#EF4444] text-[#EF4444] py-4 rounded-full text-center text-[10px] sm:text-[11px] font-bold tracking-[0.2em] hover:bg-red-500/10 transition-colors font-poppins"
              >
                Log Out
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
