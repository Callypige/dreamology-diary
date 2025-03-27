import DreamList from "@/app/components/DreamList";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      {session ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue, {session.user?.name || session.user?.email || "Utilisateur"} !
          </h1>
          <DreamList />
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Dreamology - Connecte-toi</h1>
          <p className="text-lg mb-6">Tu dois être connecté pour voir tes rêves.</p>
          <div className="flex gap-4">
            <Link href="/sign-in" className="px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
              Se connecter
            </Link>
            <Link href="/signup" className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition">
              S'inscrire
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
