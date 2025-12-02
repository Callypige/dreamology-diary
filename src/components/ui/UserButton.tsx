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
    <div className="flex items-center gap-4">
      {session ? (
        <>
          <span className="text-sm text-white">
            👤 {session.user?.email}
          </span>
          <button
            onClick={() =>
              signOut({ redirect: false }).then(() => router.push("/"))
            }
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link
            href="/auth/sign-in"
            className="px-3 py-1 bg-pink-700 text-white text-sm rounded hover:bg-pink-400 transition"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-400 transition"
          >
            S'inscrire
          </Link>
        </>
      )}
    </div>
  );
};

export default UserButton;
