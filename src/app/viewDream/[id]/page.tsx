"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbArrowBackUp, TbChevronDown, TbChevronUp } from "react-icons/tb";
import { useParams } from "next/navigation";

// Interface pour le rêve avec _id MongoDB
interface DreamData {
  _id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  intensity?: number;
  mood?: string;
  lucidity?: boolean;
  dreamClarity?: number;
  characters?: string[];
  location?: string;
  tags?: string[];
  interpretation?: string;
  beforeSleepMood?: string;
  sleepTime?: string;
  wokeUpTime?: string;
  dreamScore?: number;
  audioNote?: string;
  private: boolean;
  recurring?: boolean;
}

// Type pour les clés des sections
type SectionKey = 'immersion' | 'sleep' | 'extras';

export default function DreamDetails() {
  const { id } = useParams();
  const [dream, setDream] = useState<DreamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Collapsible sections state avec type strict
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    immersion: false,
    sleep: false,
    extras: false
  });

  useEffect(() => {
    const fetchDream = async (): Promise<void> => {
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
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDream();
  }, [id]);

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return <p className="text-center text-white mt-12">Chargement...</p>;
  }

  if (error || !dream) {
    return <p className="text-center text-white mt-12">Ce rêve est introuvable...</p>;
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to check if section has content
  const hasImmersionContent = dream.mood || dream.lucidity || dream.intensity || 
                              dream.recurring || dream.location || dream.characters?.length || 
                              dream.tags?.length || dream.interpretation;

  const hasSleepContent = dream.dreamClarity || dream.beforeSleepMood || 
                         dream.sleepTime || dream.wokeUpTime;

  const hasExtrasContent = dream.dreamScore || dream.private;

  return (
    <section className="bg-gradient-to-r from-indigo-950 to-slate-950 min-h-screen flex justify-center py-12 px-4">
      <div className="bg-slate-800 rounded-3xl shadow-xl border border-indigo-900 p-4 md:p-8 lg:p-12 w-full max-w-3xl">
        
        {/* Header - Always visible */}
        <div className="mb-6">
          <p className="text-gray-400 mb-4 text-sm">
            📅 <strong>Date :</strong> {formatDate(dream.date)}
          </p>
          <h1 className="text-xl md:text-3xl font-bold text-white mb-4 border-b-2 border-indigo-500 pb-2">
            🌠 {dream.title}
          </h1>
          <div className="text-gray-300 mb-4 leading-relaxed">
            {dream.description}
          </div>
          
          {/* Basic info - Always visible */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300 bg-slate-700 p-4 rounded-lg">
            <p><strong>Type :</strong> {dream.type}</p>
            {dream.intensity && <p><strong>Intensité :</strong> {dream.intensity}/10</p>}
            {dream.dreamScore && <p><strong>Score :</strong> {dream.dreamScore}/10</p>}
          </div>
        </div>

        {/* Audio Section - Always visible if exists */}
        {dream.audioNote && (
          <div className="mb-6">
            <h2 className="text-lg text-indigo-400 font-semibold border-b border-indigo-500 mb-3">🎤 Note vocale</h2>
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
              <p className="text-xs text-gray-400">clear
                💡 Si lC&#39;audio ne se charge pas, vérifiez que le fichier existe encore sur le serveur.
              </p>
            </div>
          </div>
        )}

        {/* Collapsible Sections */}
        
        {/* Immersion Section */}
        {hasImmersionContent && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection('immersion')}
              className="w-full flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <h2 className="text-lg text-indigo-400 font-semibold">🌙 Détails du rêve</h2>
              {expandedSections.immersion ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
            </button>
            
            {expandedSections.immersion && (
              <div className="mt-3 p-4 bg-slate-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  {dream.mood && <p>😊 <strong>Humeur :</strong> {dream.mood}</p>}
                  {dream.lucidity && <p>🔮 <strong>Lucide :</strong> {dream.lucidity ? "Oui" : "Non"}</p>}
                  {dream.recurring && <p>🔄 <strong>Récurrent :</strong> {dream.recurring ? "Oui" : "Non"}</p>}
                  {dream.location && <p>📍 <strong>Lieu :</strong> {dream.location}</p>}
                  {dream.characters?.length && dream.characters.length > 0 && (
                    <p className="md:col-span-2">🧑‍🤝‍🧑 <strong>Personnages :</strong> {dream.characters.join(", ")}</p>
                  )}
                  {dream.tags?.length && dream.tags.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="mb-2">🔖 <strong>Tags :</strong></p>
                      <div className="flex flex-wrap gap-1">
                        {dream.tags.map((tag, i) => (
                          <span key={i} className="bg-indigo-700 text-white text-xs px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {dream.interpretation && (
                    <p className="md:col-span-2">💭 <strong>Interprétation :</strong> {dream.interpretation}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sleep & Wellness Section */}
        {hasSleepContent && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection('sleep')}
              className="w-full flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <h2 className="text-lg text-indigo-400 font-semibold">🧘 Sommeil & Bien-être</h2>
              {expandedSections.sleep ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
            </button>
            
            {expandedSections.sleep && (
              <div className="mt-3 p-4 bg-slate-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  {dream.dreamClarity && <p>😴 <strong>Clarté :</strong> {dream.dreamClarity}/10</p>}
                  {dream.beforeSleepMood && <p>🌙 <strong>Humeur avant sommeil :</strong> {dream.beforeSleepMood}</p>}
                  {dream.sleepTime && <p>🛌 <strong>Heure coucher :</strong> {formatDate(dream.sleepTime)}</p>}
                  {dream.wokeUpTime && <p>⏰ <strong>Heure réveil :</strong> {formatDate(dream.wokeUpTime)}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extras Section */}
        {hasExtrasContent && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('extras')}
              className="w-full flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <h2 className="text-lg text-indigo-400 font-semibold">⚙️ Autres informations</h2>
              {expandedSections.extras ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
            </button>
            
            {expandedSections.extras && (
              <div className="mt-3 p-4 bg-slate-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  {dream.dreamScore && <p>⭐️ <strong>Note personnelle :</strong> {dream.dreamScore}/10</p>}
                  <p>🔒 <strong>Privé :</strong> {dream.private ? "Oui" : "Non"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <Link 
              href={`/editDream/${dream._id}`} 
              className="inline-flex items-center bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              ✏️ Modifier ce rêve
            </Link>
          </div>
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition"
            >
              <TbArrowBackUp className="mr-2" />
              Retour à la liste des rêves
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}