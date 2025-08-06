import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import DreamFilterUI from "./components/DreamFilterUI";
import { Moon } from "lucide-react"

import { Session } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions) as Session | null;

  if (session?.user?.id) {
    const connectMongoDB = (await import("@/lib/mongodb")).default;
    await connectMongoDB();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-centertext-white">
      {session ? (
        <>
          <DreamFilterUI />
        </>
      ) : (
        <>
            <figure className="flex justify-center">
              <Moon 
                size={120} 
                className="mb-6 text-blue-400 mx-auto" 
              />
              <figcaption className="sr-only">
                Illustration by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>
              </figcaption>
            </figure>

            <h1 className="text-4xl font-bold mb-4 text-center">
              Dreamology&nbsp;– Connecte-toi
            </h1>

            <p className="text-lg mb-6 text-center">
              Connecte-toi ou crée un compte pour gérer tes rêves
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                  href="/auth/sign-in"
                  className="px-3 py-3 bg-pink-700 text-white text-sm rounded hover:bg-pink-400 transition"
                >
                  Se connecter
                </Link>

                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-orange-600 rounded-md hover:bg-orange-400 transition"
                >
                  S'inscrire
              </Link>
            </div>
          </>
      )}
    </div>
  );
}
