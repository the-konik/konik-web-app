"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export function LegacyTransitionSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section 
      className="relative h-[75vh] sm:h-[85vh] lg:h-[100vh] w-full overflow-hidden bg-[#121212]"
      onClick={() => {
        // Toggle on click for mobile
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          setIsHovered(!isHovered);
        }
      }}
    >
      {/* Background Image - Seamless Rolling Loop */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 flex h-full w-[400%] sm:w-[300%] lg:w-[200%]"
        >
          {/* First Copy */}
          <div className="relative h-full w-1/2 flex-shrink-0">
            <Image
              src="/images/sections/generated-bg-3.png"
              alt="The Legacy Path"
              fill
              className={`object-cover transition-transform duration-[5000ms] ease-out ${
                isHovered ? "scale-103 brightness-[0.4]" : "scale-100 brightness-[0.7]"
              } block object-center`}
              priority
            />
          </div>
          {/* Second Copy for Seamless Loop */}
          <div className="relative h-full w-1/2 flex-shrink-0">
            <Image
              src="/images/sections/generated-bg-3.png"
              alt="The Legacy Path"
              fill
              className={`object-cover transition-transform duration-[5000ms] ease-out ${
                isHovered ? "scale-103 brightness-[0.4]" : "scale-100 brightness-[0.7]"
              } block object-center`}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Center Text - Appears on Button Click/Hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.05 : 0.95,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-atmospheric text-xl sm:text-4xl lg:text-6xl text-white tracking-[0.2em] sm:tracking-[0.25em] text-center px-6 sm:px-12 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          AVERAGE IS<br />A CHOICE
        </motion.h2>
      </div>

      {/* Bottom Center Button */}
      <div className="absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-40px)] sm:w-auto">
        <motion.div
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="w-full flex justify-center"
        >
          <Link
            href="/tools"
            className="flex items-center justify-center bg-white text-[#121212] px-8 sm:px-12 py-4 sm:py-5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-full sm:w-auto text-center"
          >
            Shop Legacy Life
          </Link>
        </motion.div>
      </div>


      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#121212] to-transparent opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#121212] to-transparent opacity-60" />
    </section>
  );
}
