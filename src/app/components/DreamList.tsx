"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "./RemoveBtn";
import { Dream } from "../../types/Dream";
import Pagination from "./pagination/pagination";

interface DreamListProps {
  type?: string;
  recurring?: boolean;
  dreamScore?: number;
  mood?: string;
  tags?: string[]; 
  hasAudio?: boolean;
  selectedDate?: Date | null;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalDreams: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

interface DreamWithMongoId extends Omit<Dream, 'id'> {
  _id: string;
  id?: string; // Optionnel pour compatibilité
}

export default function DreamList({ type, recurring, dreamScore, mood, tags, hasAudio, selectedDate }: DreamListProps) {
  const [dreams, setDreams] = useState<DreamWithMongoId[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalDreams: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 10, // Default limit
  });

    const fetchDreams = useCallback(
      async (page: number = 1) => {
        try {
          setLoading(true);
          const params = new URLSearchParams();

          // pagination params
          params.append("page", String(page));
          params.append("limit", "10"); // Default limit

          // filter params
          if (type) params.append("type", type);
          if (recurring !== undefined) params.append("recurring", String(recurring));
          if (dreamScore !== undefined && dreamScore > 0) {
            params.append("dreamScore", String(dreamScore));
          }
          if (mood) params.append("mood", mood);
          if (tags && tags.length > 0 && tags[0]) { 
            params.append("tag", tags[0]); 
          }
          if (hasAudio !== undefined) params.append("hasAudio", String(hasAudio));
          // date filter
          if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`; // "2025-07-15"
            
            params.append('date', dateStr);
          }

          const res = await fetch(`/api/dreams?${params.toString()}`, {
            cache: "no-cache",
            credentials: "include",
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
            setDreams(data.body || data.dreams || []);
            setPagination(data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalDreams: 0,
              hasNextPage: false,
              hasPreviousPage: false,
              limit: 10
          });
        } catch (err) {
          console.error("Error fetching dreams:", err);
        } finally {
          setLoading(false);
        }
      },
      [type, recurring, dreamScore, mood, tags, hasAudio, selectedDate]
    );

  useEffect(() => {
    fetchDreams(1); // Reset to page 1 on new filters
  }, [fetchDreams]);

  const handlePageChange = (page: number) => {
    fetchDreams(page);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleDreamDeleted = () => {
    // Re-fetch dreams after deletion
    fetchDreams(pagination.currentPage);
  }

  if (loading) {
    return (
      <>
        <figure className="flex justify-center mb-8">

        </figure>
        <p className="text-center text-white mt-12">Chargement des rêves…</p>
      </>
    );
  }

  return (
    <section className="w-full px-8 py-12 min-h-screen">
      {/* Results summary */}
      {pagination.totalDreams > 0 && (
        <div className="text-center mb-6">
          <p className="text-gray-300">
            {pagination.totalDreams} rêve{pagination.totalDreams > 1 ? 's' : ''} trouvé{pagination.totalDreams > 1 ? 's' : ''}
          </p>
          {(type || recurring || dreamScore || mood || tags?.[0]) && (
            <p className="text-sm text-gray-400 mt-1">
              Filtres actifs - 
              {type && ` Type: ${type}`}
              {recurring && ` Récurrents`}
              {dreamScore && ` Score ≥ ${dreamScore}`}
              {mood && ` Humeur: ${mood}`}
              {tags?.[0] && ` Tag: ${tags[0]}`}
              {hasAudio && ` Audio disponible`}
            </p>
          )}
        </div>
      )}

      {dreams.length > 0 ? (
        <>
          {/* Dreams grid */}
          <div className="flex flex-col gap-6 w-full items-center">
            {dreams.map((dream) => (
              <div
                key={dream._id}
                className="bg-slate-800 border border-slate-600 rounded-2xl p-6 shadow-lg
                           hover:shadow-2xl hover:scale-[1.02] hover:ring-1 hover:ring-indigo-500/40
                           transition-all duration-300 flex flex-col
                           h-auto max-w-3xl w-full overflow-hidden"
              >
                <h4>Rêve du {new Date(dream.date).toLocaleDateString("fr-FR")}</h4>
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
                  {dream.audioNote && (
                    <p><span className="font-semibold">Audio :</span> 🎤</p>
                  )}
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
                    <RemoveBtn id={dream._id} onDeleted={handleDreamDeleted} />
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

          {/* Pagination component */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPreviousPage}
            totalDreams={pagination.totalDreams}
            limit={pagination.limit}
          />
        </>
      ) : (
        <p className="text-gray-400 text-center text-2xl font-light mt-12">
          🛌 Aucun rêve correspondant à la recherche
        </p>
      )}
    </section>
  );
}