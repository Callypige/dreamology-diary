"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "@/app/components/RemoveBtn";
import Image from "next/image";
import { Dream } from "../../../types/Dream";

interface DreamListProps {
  type?: string;
  recurring?: boolean;
  dreamScore?: number;
  mood?: string;
  tags?: string[]; // Changé de 'tag' à 'tags' pour correspondre à DreamFilterUI
}

export default function DreamList({ type, recurring, dreamScore, mood, tags }: DreamListProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const params = new URLSearchParams();

        if (type) params.append("type", type);
        if (recurring !== undefined) params.append("recurring", String(recurring));
        if (dreamScore !== undefined && dreamScore > 0) {
          params.append("dreamScore", String(dreamScore));
        }
        if (mood) params.append("mood", mood);
        if (tags && tags.length > 0 && tags[0]) { // Changé de 'tag' à 'tags' et ajouté vérification que tags[0] n'est pas vide
          params.append("tag", tags[0]); // un seul tag, comme ton API l'attend
        }

        const res = await fetch(`${baseUrl}/api/dreams?${params.toString()}`, {
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
  }, [type, recurring, dreamScore, mood, tags]); // Changé de 'tag' à 'tags'

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
        <p className="text-center text-white mt-12">Chargement des rêves…</p>
      </>
    );
  }

  return (
    <section className="w-full px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-white text-center tracking-wide mb-8 drop-shadow-lg">
        ✨ Mes Rêves ✨
      </h1>

      {dreams.length > 0 ? (
        <div className="flex flex-col gap-6 w-full items-center">
          {dreams.map((dream) => (
            <div
              key={dream._id}
              className="bg-slate-800 border border-slate-600 rounded-2xl p-6 shadow-lg
                         hover:shadow-2xl hover:scale-[1.02] hover:ring-1 hover:ring-indigo-500/40
                         transition-all duration-300 flex flex-col
                         h-auto max-w-3xl w-full overflow-hidden"
            >
              <Link href={`/viewDream/${dream._id}`}>
                <h2 className="text-2xl font-bold text-white mb-2 hover:text-indigo-400 transition cursor-pointer line-clamp-1">
                  {dream.title}
                </h2>
              </Link>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-4 line-clamp-3">
                {dream.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-400 mb-4">
                <p><span className="font-semibold">Type :</span> {dream.type || "Normal"}</p>
                <p><span className="font-semibold">Score :</span> {dream.dreamScore || 0}</p>
                <p><span className="font-semibold">Récurrent :</span> {dream.recurring ? "Oui" : "Non"}</p>
                <p><span className="font-semibold">Humeur :</span> {dream.mood || "—"}</p>
              </div>

              {dream.tags && dream.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dream.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-indigo-700 text-white text-xs px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="text-xs text-gray-400 leading-tight">
                  <p>Créé : {new Date(dream.createdAt).toLocaleDateString("fr-FR")}</p>
                  <p>Modifié : {new Date(dream.updatedAt).toLocaleDateString("fr-FR")}</p>
                </div>

                <div className="flex gap-4 items-center">
                  <RemoveBtn id={dream._id} />
                  <Link
                    href={`/editDream/${dream._id}`}
                    className="text-indigo-400 hover:text-indigo-500 transition"
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
          🛌 Rêve correspondant à la recherche non trouvé
        </p>
      )}
    </section>
  );
}