"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import { useParams } from "next/navigation";

export default function DreamDetails() {
  const { id } = useParams();
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/dreams/${id}`, {
          cache: "no-cache",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setDream(data.dream);
      } catch (err) {
        console.error("Error fetching dream:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDream();
  }, [id]);

  if (loading) {
    return <p className="text-center text-white mt-12">Chargement...</p>;
  }

  if (error || !dream) {
    return <p className="text-center text-white mt-12">Ce rêve est introuvable...</p>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="bg-gradient-to-r from-indigo-950 to-slate-950 min-h-screen flex justify-center py-12 px-4">
      <div className="bg-slate-800 rounded-3xl shadow-xl border border-indigo-900 p-8 md:p-12 lg:p-16 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 border-b-2 border-indigo-500 pb-2">
          🌠 {dream.title}
        </h1>
        <p className="text-gray-200 whitespace-pre-line mb-8">{dream.description}</p>

        {/* Immersion */}
        <div className="mb-6">
          <h2 className="text-xl text-indigo-400 font-semibold border-b border-indigo-500 mb-3">🌙 Immersion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p>📅 <strong>Date :</strong> {formatDate(dream.date)}</p>
            <p>😊 <strong>Humeur :</strong> {dream.mood || "N/A"}</p>
            <p>🔮 <strong>Lucide :</strong> {dream.lucidity ? "Oui" : "Non"}</p>
            <p>🔥 <strong>Intensité :</strong> {dream.intensity}/10</p>
            <p>🔄 <strong>Récurrent :</strong> {dream.recurring ? "Oui" : "Non"}</p>
            <p>📍 <strong>Lieu :</strong> {dream.location || "N/A"}</p>
            <p>🧑‍🤝‍🧑 <strong>Personnages :</strong> {dream.characters?.join(", ") || "N/A"}</p>
            <p>🔖 <strong>Tags :</strong> {dream.tags?.join(", ") || "N/A"}</p>
            <p>💭 <strong>Interprétation :</strong> {dream.interpretation || "N/A"}</p>
            <p>📌 <strong>Type :</strong> {dream.type}</p>
          </div>
        </div>

        {/* Sommeil & Bien-être */}
        <div className="mb-6">
          <h2 className="text-xl text-indigo-400 font-semibold border-b border-indigo-500 mb-3">🧘 Sommeil & Bien-être</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p>😴 <strong>Clarté :</strong> {dream.dreamClarity}/10</p>
            <p>🌙 <strong>Humeur avant sommeil :</strong> {dream.beforeSleepMood || "N/A"}</p>
            <p>🛌 <strong>Heure coucher :</strong> {dream.sleepTime ? formatDate(dream.sleepTime) : "N/A"}</p>
            <p>⏰ <strong>Heure réveil :</strong> {dream.wokeUpTime ? formatDate(dream.wokeUpTime) : "N/A"}</p>
          </div>
        </div>

        {/* Audio */}
        <div className="mb-6">
          <h2 className="text-xl text-indigo-400 font-semibold border-b border-indigo-500 mb-3">🎤 Note vocale</h2>
          {dream.audioNote ? (
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-gray-300 mb-3 text-sm">
                Écoutez la note vocale enregistrée pour ce rêve :
              </p>
              <audio controls className="w-full mb-2">
                <source src={dream.audioNote} type="audio/webm" />
                <source src={dream.audioNote} type="audio/mp4" />
                <source src={dream.audioNote} type="audio/mpeg" />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
              <p className="text-xs text-gray-400">
                💡 Si l'audio ne se charge pas, vérifiez que le fichier existe encore sur le serveur.
              </p>
            </div>
          ) : (
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-gray-400">Aucune note vocale disponible pour ce rêve.</p>
            </div>
          )}
        </div>

        <hr className="my-6 border-t border-slate-600" />

        {/* Extras */}
        <div className="mb-6">
          <h2 className="text-xl text-indigo-400 font-semibold border-b border-indigo-500 mb-3">🎙️ Extras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p>⭐️ <strong>Note personnelle :</strong> {dream.dreamScore}/10</p>
            <p>🔒 <strong>Privé :</strong> {dream.private ? "Oui" : "Non"}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href={`/editDream/${dream._id}`} className="inline-flex items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">
            Modifier ce rêve
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/dreams" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition">
            <TbArrowBackUp className="mr-2" />
            Retour à la liste des rêves
          </Link>
        </div>
      </div>
    </section>
  );
}
