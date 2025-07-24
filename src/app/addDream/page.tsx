"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbArrowBackUp, TbChevronDown, TbChevronUp } from "react-icons/tb";
import VoiceRecorder from "../components/audio/VoiceRecorder";

interface DreamFormData {
  title: string;
  description: string;
  type: "rêve" | "cauchemar" | "lucide" | "autre";
  date: string;
  intensity: string;
  mood: string;
  lucidity: boolean;
  dreamClarity: string;
  characters: string;
  location: string;
  tags: string;
  interpretation: string;
  beforeSleepMood: string;
  sleepTime: string;
  wokeUpTime: string;
  dreamScore: string;
  audioNote: string;
  images: string;
  private: boolean;
}

// Type pour les clés des sections
type SectionKey = 'details' | 'organization' | 'sleep' | 'audio' | 'other';

// Types React natifs pour les événements
import { ChangeEvent, FormEvent } from "react";

export default function AddDream() {
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<DreamFormData>({
    title: "",
    description: "",
    type: "rêve",
    date: getTodayDate(),
    intensity: "",
    mood: "",
    lucidity: false,
    dreamClarity: "",
    characters: "",
    location: "",
    tags: "",
    interpretation: "",
    beforeSleepMood: "",
    sleepTime: "",
    wokeUpTime: "",
    dreamScore: "",
    audioNote: "",
    images: "",
    private: false,
  });

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    details: false,
    organization: false,
    sleep: false,
    audio: false,
    other: false
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
      const res = await fetch(`${baseUrl}/api/dreams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert("Rêve créé avec succès ! 🎉");
        router.push("/");
      } else {
        throw new Error("Erreur lors de la création du rêve");
      }
    } catch (error) {
      console.error("Error creating dream:", error);
      alert("Une erreur est survenue lors de la création du rêve.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour gérer le changement d'audio
  const handleAudioChange = (url: string): void => {
    setFormData({ ...formData, audioNote: url });
  };

  const inputClass = "w-full p-3 rounded-xl bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "font-semibold text-white mb-2 block";

  return (
    <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        🌙 Ajouter un Nouveau Rêve
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700">
        
        {/* Essential Fields - Always Visible */}
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Titre du rêve *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Donnez un titre à votre rêve..."
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} h-32 resize-none`}
              placeholder="Décrivez votre rêve en détail..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Type de rêve</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                <option value="rêve">Rêve</option>
                <option value="cauchemar">Cauchemar</option>
                <option value="lucide">Lucide</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Date du rêve</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className={inputClass} 
              />
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        
        {/* Dream Details Section */}
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <h3 className="text-lg text-indigo-400 font-semibold">🌙 Détails du rêve</h3>
            {expandedSections.details ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
          
          {expandedSections.details && (
            <div className="p-4 bg-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Humeur dans le rêve</label>
                  <input 
                    type="text" 
                    name="mood" 
                    value={formData.mood} 
                    onChange={handleChange} 
                    className={inputClass}
                    placeholder="Ex: heureux, anxieux, paisible..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Intensité (1-10)</label>
                  <input 
                    type="number" 
                    name="intensity" 
                    value={formData.intensity} 
                    onChange={handleChange} 
                    className={inputClass} 
                    min={1} 
                    max={10}
                    placeholder="1-10"
                  />
                </div>
                <div>
                  <label className={labelClass}>Lieu du rêve</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    className={inputClass}
                    placeholder="Ex: maison, école, forêt..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Clarté du souvenir (1-10)</label>
                  <input 
                    type="number" 
                    name="dreamClarity" 
                    value={formData.dreamClarity} 
                    onChange={handleChange} 
                    className={inputClass} 
                    min={1} 
                    max={10}
                    placeholder="1-10"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Personnages présents</label>
                <input 
                  type="text" 
                  name="characters" 
                  value={formData.characters} 
                  onChange={handleChange} 
                  className={inputClass}
                  placeholder="Séparés par des virgules"
                />
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="lucidity" 
                  checked={formData.lucidity} 
                  onChange={handleChange}
                  className="w-5 h-5 accent-indigo-500"
                />
                <label className="text-white font-medium">C&#39;était un rêve lucide</label>
              </div>
            </div>
          )}
        </div>

        {/* Organization Section */}
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('organization')}
            className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <h3 className="text-lg text-indigo-400 font-semibold">🏷️ Organisation</h3>
            {expandedSections.organization ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
          
          {expandedSections.organization && (
            <div className="p-4 bg-slate-800 space-y-4">
              <div>
                <label className={labelClass}>Tags</label>
                <input 
                  type="text" 
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleChange} 
                  className={inputClass}
                  placeholder="vol, chute, animal, famille..."
                />
                <p className="text-xs text-gray-400 mt-1">Séparés par des virgules</p>
              </div>
              <div>
                <label className={labelClass}>Interprétation personnelle</label>
                <textarea 
                  name="interpretation" 
                  value={formData.interpretation} 
                  onChange={handleChange} 
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="Que pensez-vous que ce rêve signifie ?"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sleep Section */}
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('sleep')}
            className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <h3 className="text-lg text-indigo-400 font-semibold">🧘 Informations sur le sommeil</h3>
            {expandedSections.sleep ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
          
          {expandedSections.sleep && (
            <div className="p-4 bg-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Humeur avant le coucher</label>
                  <input 
                    type="text" 
                    name="beforeSleepMood" 
                    value={formData.beforeSleepMood} 
                    onChange={handleChange} 
                    className={inputClass}
                    placeholder="Ex: détendu, stressé..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Heure de coucher</label>
                  <input 
                    type="time" 
                    name="sleepTime" 
                    value={formData.sleepTime} 
                    onChange={handleChange} 
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Heure de réveil</label>
                  <input 
                    type="time" 
                    name="wokeUpTime" 
                    value={formData.wokeUpTime} 
                    onChange={handleChange} 
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Section */}
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('audio')}
            className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <h3 className="text-lg text-indigo-400 font-semibold">🎤 Note vocale</h3>
            {expandedSections.audio ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
          
          {expandedSections.audio && (
            <div className="p-4 bg-slate-800">
              <VoiceRecorder
                existingAudioUrl={formData.audioNote}
                onAudioChange={handleAudioChange}
                dreamId={undefined}
              />
            </div>
          )}
        </div>

        {/* Other Settings Section */}
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('other')}
            className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <h3 className="text-lg text-indigo-400 font-semibold">⚙️ Autres paramètres</h3>
            {expandedSections.other ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
          
          {expandedSections.other && (
            <div className="p-4 bg-slate-800 space-y-4">
              <div>
                <label className={labelClass}>Note personnelle (1-10)</label>
                <input 
                  type="number" 
                  name="dreamScore" 
                  value={formData.dreamScore} 
                  onChange={handleChange} 
                  className={inputClass} 
                  min={1} 
                  max={10}
                  placeholder="1-10"
                />
                <p className="text-xs text-gray-400 mt-1">Votre appréciation personnelle du rêve</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="private" 
                  checked={formData.private} 
                  onChange={handleChange}
                  className="w-5 h-5 accent-indigo-500"
                />
                <label className="text-white font-medium">Rêve privé (non visible publiquement)</label>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Création en cours..." : "Créer le rêve ✨"}
        </button>
      </form>

      <div className="mt-8 flex justify-center">
        <Link href="/" className="flex items-center text-white hover:text-blue-400 transition">
          <TbArrowBackUp size={24} className="mr-2" /> Retour à la liste
        </Link>
      </div>
    </section>
  );
}