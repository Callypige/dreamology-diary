"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "@/app/components/RemoveBtn";
import Image from "next/image";

export default function DreamList() {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/dreams`, {
          cache: "no-cache",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDreams(data.body || []);
      } catch (err) {
        console.error("Error fetching dreams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDreams();
  }, []);

  if (loading) {
    return (
      <>
        <figure className="flex justify-center mb-8">
            <Image
              src="/images/doggy.jpg"
              alt="Chien qui dort paisiblement"
              width={220}
              height={220}
              className="rounded-full object-cover shadow-lg"
              priority
            />
          </figure>
        <p className="text-center text-white mt-12">
          Chargement des rêves…
        </p>
      </>
    );
  }

  /* ---------------------------------------------------------------------- */
  return (
    <section className="w-full px-8 py-12 bg-gradient-to-b from-slate-800 to-slate-950 min-h-screen">
      <h1 className="text-5xl font-extrabold text-white text-center tracking-wide mb-12 drop-shadow-lg">
        ✨ Mes Rêves ✨
      </h1>

      {dreams.length > 0 ? (
        /* liste verticale -------------------------------------------------- */
        <div className="flex flex-col gap-6 w-full items-center">
          {dreams.map((dream) => (
            <div
              key={dream._id}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-700
                         shadow-xl hover:shadow-2xl hover:scale-[1.02]
                         transition-all duration-300 flex flex-col
                         h-60 max-w-3xl w-full overflow-hidden"
            >
              <Link href={`/viewDream/${dream._id}`}>
                <h2 className="text-2xl font-bold text-white mb-2
                               hover:text-blue-400 transition cursor-pointer
                               line-clamp-1">
                  {dream.title}
                </h2>
              </Link>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-4 flex-1 overflow-hidden">
                {dream.description}
              </p>

              {/* barre inférieure */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="text-xs text-gray-500 leading-tight">
                  <p>
                    Créé&nbsp;:{" "}
                    {new Date(dream.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <p>
                    Modifié&nbsp;:{" "}
                    {new Date(dream.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <RemoveBtn id={dream._id} />
                  <Link
                    href={`/editDream/${dream._id}`}
                    className="text-blue-400 hover:text-blue-500 transition"
                  >
                    <HiPencilAlt size={28} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-2xl font-light mt-12">
          😴 Aucun rêve enregistré. Rêve encore plus fort !
        </p>
      )}
    </section>
  );
}
