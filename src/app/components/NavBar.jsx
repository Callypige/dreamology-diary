"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserButton from "@/app/components/UserButton";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 bg-black shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300">
            DreamologyTools
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white lg:hidden focus:outline-none"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-4">
          {session && (
            <>
              <Link
                href="/addDream"
                className="bg-pink-500 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
              >
                + Add Dream
              </Link>
              <Link
                href="/profile"
                className="bg-indigo-500 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Profile
              </Link>
            </>
          )}
          <UserButton />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-700 py-4 px-6 space-y-3">
          {session && (
            <>
              <Link
                href="/addDream"
                className="block text-white bg-pink-500 py-2 px-4 rounded-md text-center"
                onClick={() => setMenuOpen(false)}
              >
                + Add Dream
              </Link>
              <Link
                href="/profile"
                className="block text-white bg-indigo-500 py-2 px-4 rounded-md text-center"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
          <div className="pt-2">
            <UserButton />
          </div>
        </div>
      )}
    </nav>
  );
}
