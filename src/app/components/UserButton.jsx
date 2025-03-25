"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-white text-sm">Chargement...</p>;
  }

  return (
    <nav className="p-4 flex justify-end">
      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-white">👤 {session.user?.name || session.user?.email}</span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => signOut({ redirect: false }).then(() => router.push("/"))}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/sign-in" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Se connecter
          </Link>
          <Link href="/sign-up" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            S'inscrire
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserButton;
