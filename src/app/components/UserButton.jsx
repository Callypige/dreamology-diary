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
            👤 {session.user?.name || session.user?.email}
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
            href="/signin"
            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
          >
            S'inscrire
          </Link>
        </>
      )}
    </div>
  );
};

export default UserButton;
