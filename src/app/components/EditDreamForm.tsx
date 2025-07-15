"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VoiceRecorder from "./audio/VoiceRecorder";

interface EditDreamFormProps {
  id: string;
  title: string;
  description?: string;
  mood?: string;
  lucidity?: boolean;
  tags?: string[];
  location?: string;
  intensity?: number;
  recurring?: boolean;
  characters?: string[];
  interpretation?: string;
  type?: string;
  beforeSleepMood?: string;
  sleepTime?: string;
  wokeUpTime?: string;
  dreamClarity?: number;
  dreamScore?: number;
  audioNote?: string;
  private?: boolean;
}

export default function EditDreamForm({
  id,
  title,
  description,
  mood,
  lucidity,
  tags,
  location,
  intensity,
  recurring,
  characters,
  interpretation,
  type,
  beforeSleepMood,
  sleepTime,
  wokeUpTime,
  dreamClarity,
  dreamScore,
  audioNote,
  private: isPrivate,
}: EditDreamFormProps) {
  const router = useRouter();

  const [newTitle, setNewTitle] = useState(title || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newMood, setNewMood] = useState(mood || "");
  const [newLucidity, setNewLucidity] = useState(!!lucidity);
  const [newTags, setNewTags] = useState(tags?.join(", ") || "");
  const [newLocation, setNewLocation] = useState(location || "");
  const [newIntensity, setNewIntensity] = useState(intensity || 5);
  const [newRecurring, setNewRecurring] = useState(!!recurring);
  const [newCharacters, setNewCharacters] = useState(characters?.join(", ") || "");
  const [newInterpretation, setNewInterpretation] = useState(interpretation || "");
  const [newType, setNewType] = useState(type || "rêve");
  const [newBeforeSleepMood, setNewBeforeSleepMood] = useState(beforeSleepMood || "");
  const [newSleepTime, setNewSleepTime] = useState(sleepTime || "");
  const [newWokeUpTime, setNewWokeUpTime] = useState(wokeUpTime || "");
  const [newDreamClarity, setNewDreamClarity] = useState(dreamClarity || 5);
  const [newDreamScore, setNewDreamScore] = useState(dreamScore || 5);
  const [newAudioNote, setNewAudioNote] = useState(audioNote || "");
  const [newPrivate, setNewPrivate] = useState(!!isPrivate);

  // Loading state for better UX
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          tags: newTags.split(",").map((t) => t.trim()),
          location: newLocation,
          intensity: newIntensity,
          recurring: newRecurring,
          characters: newCharacters.split(",").map((c) => c.trim()),
          interpretation: newInterpretation,
          type: newType,
          beforeSleepMood: newBeforeSleepMood,
          ...(newSleepTime && { sleepTime: newSleepTime }),
          ...(newWokeUpTime && { wokeUpTime: newWokeUpTime }),
          dreamClarity: newDreamClarity,
          dreamScore: newDreamScore,
          audioNote: newAudioNote, // ✅ FIXED: Added missing audioNote
          private: newPrivate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ✅ FIXED: Show success message
      alert("Rêve mis à jour avec succès ! 🎉");
      router.push("/");

    } catch (error) {
      console.error("Error updating dream:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700"
    >
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Titre du rêve"
        required
      />
      <textarea
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Description"
      />
      <input
        value={newMood}
        onChange={(e) => setNewMood(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Humeur du rêve"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newLucidity}
          onChange={(e) => setNewLucidity(e.target.checked)}
        />
        Rêve lucide ?
      </label>
      <input
        value={newTags}
        onChange={(e) => setNewTags(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Tags (séparés par des virgules)"
      />
      <input
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Lieu du rêve"
      />
      <input
        value={newCharacters}
        onChange={(e) => setNewCharacters(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Personnages (séparés par des virgules)"
      />
      <input
        value={newInterpretation}
        onChange={(e) => setNewInterpretation(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Interprétation"
      />
      <select
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
      >
        <option value="rêve">Rêve</option>
        <option value="cauchemar">Cauchemar</option>
        <option value="lucide">Lucide</option>
        <option value="autre">Autre</option>
      </select>
      <input
        type="text"
        value={newBeforeSleepMood}
        onChange={(e) => setNewBeforeSleepMood(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
        placeholder="Humeur avant de dormir"
      />
      <input
        type="datetime-local"
        value={newSleepTime}
        onChange={(e) => setNewSleepTime(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
      />
      <input
        type="datetime-local"
        value={newWokeUpTime}
        onChange={(e) => setNewWokeUpTime(e.target.value)}
        className="rounded px-4 py-2 bg-slate-700 border border-slate-600"
      />
      <label>Clarté du rêve : {newDreamClarity}</label>
      <input
        type="range"
        min="1"
        max="10"
        value={newDreamClarity}
        onChange={(e) => setNewDreamClarity(Number(e.target.value))}
        className="accent-indigo-500"
      />
      <label>Satisfaction : {newDreamScore}</label>
      <input
        type="range"
        min="1"
        max="10"
        value={newDreamScore}
        onChange={(e) => setNewDreamScore(Number(e.target.value))}
        className="accent-pink-500"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newRecurring}
          onChange={(e) => setNewRecurring(e.target.checked)}
        />
        Rêve récurrent ?
      </label>

      {/* Audio note section */}
      <hr className="my-4 border-t border-slate-600" />
      <VoiceRecorder
        existingAudioUrl={newAudioNote}
        onAudioChange={(url) => setNewAudioNote(url)}
        dreamId={id} // ✅ FIXED: Added missing dreamId prop
      />
      <hr className="my-4 border-t border-slate-600" />

      {/* Private toggle */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newPrivate}
          onChange={(e) => setNewPrivate(e.target.checked)}
        />
        Rêve privé ?
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour ✨"}
      </button>
    </form>
  );
}