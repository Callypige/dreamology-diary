"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TbChevronDown, TbChevronUp } from "react-icons/tb";
import VoiceRecorder from "@/app/components/audio/VoiceRecorder";

interface EditDreamFormProps {
  id: string;
}

export default function EditDreamForm({ id }: EditDreamFormProps) {
  const router = useRouter();

  // Loading state
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMood, setNewMood] = useState("");
  const [newLucidity, setNewLucidity] = useState(false);
  const [newTags, setNewTags] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newIntensity, setNewIntensity] = useState(5);
  const [newRecurring, setNewRecurring] = useState(false);
  const [newCharacters, setNewCharacters] = useState("");
  const [newInterpretation, setNewInterpretation] = useState("");
  const [newType, setNewType] = useState("rêve");
  const [newBeforeSleepMood, setNewBeforeSleepMood] = useState("");
  const [newSleepTime, setNewSleepTime] = useState("");
  const [newWokeUpTime, setNewWokeUpTime] = useState("");
  const [newDreamClarity, setNewDreamClarity] = useState(5);
  const [newDreamScore, setNewDreamScore] = useState(5);
  const [newAudioNote, setNewAudioNote] = useState("");
  const [newPrivate, setNewPrivate] = useState(false);
  const [newDate, setNewDate] = useState("");

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    details: false,
    organization: false,
    sleep: false,
    audio: false,
    other: false
  });

  // Fetch dream data on component mount
  useEffect(() => {
    const fetchDream = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/dreams/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Dream not found');
        }

        const data = await response.json();
        const dream = data.dream;

        // Populate form fields
        setNewTitle(dream.title || "");
        setNewDescription(dream.description || "");
        setNewMood(dream.mood || "");
        setNewLucidity(!!dream.lucidity);
        setNewTags(dream.tags?.join(", ") || "");
        setNewLocation(dream.location || "");
        setNewIntensity(dream.intensity || 5);
        setNewRecurring(!!dream.recurring);
        setNewCharacters(dream.characters?.join(", ") || "");
        setNewInterpretation(dream.interpretation || "");
        setNewType(dream.type || "rêve");
        setNewBeforeSleepMood(dream.beforeSleepMood || "");
        setNewDreamClarity(dream.dreamClarity || 5);
        setNewDreamScore(dream.dreamScore || 5);
        setNewAudioNote(dream.audioNote || "");
        setNewPrivate(!!dream.private);

        // Handle dates
        if (dream.date) {
          const dreamDate = new Date(dream.date);
          const dateStr = dreamDate.toISOString().split('T')[0];
          setNewDate(dateStr);
        }

        if (dream.sleepTime) {
          const sleepTime = new Date(dream.sleepTime);
          const sleepTimeStr = `${sleepTime.getHours().toString().padStart(2, '0')}:${sleepTime.getMinutes().toString().padStart(2, '0')}`;
          setNewSleepTime(sleepTimeStr);
        }

        if (dream.wokeUpTime) {
          const wokeUpTime = new Date(dream.wokeUpTime);
          const wokeUpTimeStr = `${wokeUpTime.getHours().toString().padStart(2, '0')}:${wokeUpTime.getMinutes().toString().padStart(2, '0')}`;
          setNewWokeUpTime(wokeUpTimeStr);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dream:", error);
        alert("Erreur lors du chargement du rêve");
        router.push("/");
      }
    };

    if (id) {
      fetchDream();
    }
  }, [id, router]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/dreams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          mood: newMood,
          lucidity: newLucidity,
          tags: newTags.split(",").map((t: string) => t.trim()).filter(t => t),
          location: newLocation,
          intensity: newIntensity,
          recurring: newRecurring,
          characters: newCharacters.split(",").map((c: string) => c.trim()).filter(c => c),
          interpretation: newInterpretation,
          type: newType,
          beforeSleepMood: newBeforeSleepMood,
          ...(newSleepTime && { sleepTime: newSleepTime }),
          ...(newWokeUpTime && { wokeUpTime: newWokeUpTime }),
          dreamClarity: newDreamClarity,
          dreamScore: newDreamScore,
          audioNote: newAudioNote,
          private: newPrivate,
          ...(newDate && { date: newDate }),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Rêve mis à jour avec succès ! 🎉");
      router.push("/");

    } catch (error) {
      console.error("Error updating dream:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "font-semibold text-white mb-2 block";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white text-lg">Chargement du rêve...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">✏️ Modifier le rêve</h2>
        <p className="text-gray-400 mt-2">Modifiez les détails de votre rêve</p>
      </div>

      {/* Essential Fields - Always Visible */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Titre du rêve *</label>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={inputClass}
            placeholder="Titre du rêve"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className={`${inputClass} h-32 resize-none`}
            placeholder="Description du rêve"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type de rêve</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className={inputClass}
            >
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
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={inputClass}
            />
          </div>
          {/* Sleep Time Section */}
          <div>
              <label className={labelClass}>Heure de coucher</label>
              <input
                type="time"
                value={newSleepTime}
                onChange={(e) => setNewSleepTime(e.target.value)}
                className={inputClass}
              />
          </div>
          <div>
              <label className={labelClass}>Heure de réveil</label>
              <input
                type="time"
                value={newWokeUpTime}
                onChange={(e) => setNewWokeUpTime(e.target.value)}
                className={inputClass}
              />
          </div>
        </div>
      </div>

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
                  value={newMood}
                  onChange={(e) => setNewMood(e.target.value)}
                  className={inputClass}
                  placeholder="Humeur du rêve"
                />
              </div>
              <div>
                <label className={labelClass}>Intensité (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newIntensity}
                  onChange={(e) => setNewIntensity(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Lieu du rêve</label>
                <input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className={inputClass}
                  placeholder="Lieu du rêve"
                />
              </div>
              <div>
                <label className={labelClass}>Clarté du souvenir (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newDreamClarity}
                  onChange={(e) => setNewDreamClarity(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Personnages présents</label>
              <input
                value={newCharacters}
                onChange={(e) => setNewCharacters(e.target.value)}
                className={inputClass}
                placeholder="Personnages (séparés par des virgules)"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newLucidity}
                onChange={(e) => setNewLucidity(e.target.checked)}
                className="w-5 h-5 accent-indigo-500"
              />
              <label className="text-white font-medium">Rêve lucide ?</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newRecurring}
                onChange={(e) => setNewRecurring(e.target.checked)}
                className="w-5 h-5 accent-indigo-500"
              />
              <label className="text-white font-medium">Rêve récurrent ?</label>
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
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className={inputClass}
                placeholder="Tags (séparés par des virgules)"
              />
              <p className="text-xs text-gray-400 mt-1">Séparés par des virgules</p>
            </div>
            <div>
              <label className={labelClass}>Interprétation personnelle</label>
              <textarea
                value={newInterpretation}
                onChange={(e) => setNewInterpretation(e.target.value)}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Interprétation"
              />
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
              existingAudioUrl={newAudioNote}
              onAudioChange={(url) => setNewAudioNote(url)}
              dreamId={id}
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
              <label className={labelClass}>Note personnelle : {newDreamScore}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newDreamScore}
                onChange={(e) => setNewDreamScore(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newPrivate}
                onChange={(e) => setNewPrivate(e.target.checked)}
                className="w-5 h-5 accent-indigo-500"
              />
              <label className="text-white font-medium">Rêve privé ?</label>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 p-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition disabled:opacity-50"
      >
        {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le rêve ✨"}
      </button>
    </form>
  );
}