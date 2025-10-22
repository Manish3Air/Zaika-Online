"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black text-center px-6">
      
      {/* Animated Heading */}
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-8xl font-extrabold drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-semibold mt-4"
      >
        Oops! Page not found.
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg mt-2 mb-8 max-w-md"
      >
        The page you’re looking for doesn’t exist or has been moved.  
        Let’s get you back home safely.
      </motion.p>

      {/* Go Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/"
          className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          🏠 Go Back Home
        </Link>
      </motion.div>

    </div>
  );
}
