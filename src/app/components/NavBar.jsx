"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserButton from "@/app/components/UserButton";

export default function Navbar() {
  const { data: session, status } = useSession();
  console.log("Session dans Navbar:", session);

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

        <div className="flex items-center gap-4">
          {session && (
              <div className="flex items-center gap-4">
                <Link
                  href="/addDream"
                  className="bg-pink-500 text-white px-6 py-2 rounded-full shadow-md
                            hover:scale-105 transition-transform duration-300"
                >
                  + Add Dream
                </Link>

                <Link
                  href="/profile"                     
                  className="bg-indigo-500 text-white px-6 py-2 rounded-full shadow-md
                            hover:scale-105 transition-transform duration-300"
                >
                  Profile
                </Link>
              </div>
            )}

          <UserButton />
        </div>
      </div>
    </nav>
  );
}
