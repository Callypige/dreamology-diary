"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";

export default function AddDream() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "rêve",
    date: "",
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

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
      const res = await fetch(`${baseUrl}/api/dreams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Erreur lors de la création du rêve");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const inputClass =
    "w-full p-3 rounded-xl bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "font-semibold text-white";

  return (
    <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        🌙 Ajouter un Nouveau Rêve
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-700">
        {/* 1. Informations principales */}
        <div>
          <label className={labelClass}>Titre du rêve *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Titre"
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
            placeholder="Décris ton rêve en détail..."
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
            <p className="text-sm text-gray-400">Choisis le type général du rêve</p>
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* 2. Détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Intensité du rêve (1–10)</label>
            <input type="number" name="intensity" value={formData.intensity} onChange={handleChange} className={inputClass} min={1} max={10} />
          </div>
          <div>
            <label className={labelClass}>Humeur dans le rêve</label>
            <input type="text" name="mood" value={formData.mood} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Clarté du souvenir (1–10)</label>
            <input type="number" name="dreamClarity" value={formData.dreamClarity} onChange={handleChange} className={inputClass} min={1} max={10} />
          </div>
          <div>
            <label className={labelClass}>Lieu</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Personnages</label>
            <input type="text" name="characters" value={formData.characters} onChange={handleChange} className={inputClass} placeholder="Séparés par des virgules" />
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="vol, chute, animal..." />
          </div>
          <div className="col-span-full">
            <label className={labelClass}>Interprétation personnelle</label>
            <textarea name="interpretation" value={formData.interpretation} onChange={handleChange} className={`${inputClass} h-24 resize-none`} placeholder="Sens ou réflexion sur le rêve" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="lucidity" checked={formData.lucidity} onChange={handleChange} />
            <label className={labelClass}>C'était un rêve lucide</label>
          </div>
        </div>

        {/* 3. Sommeil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Humeur avant le coucher</label>
            <input type="text" name="beforeSleepMood" value={formData.beforeSleepMood} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Heure de coucher</label>
            <input type="time" name="sleepTime" value={formData.sleepTime} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Heure de réveil</label>
            <input type="time" name="wokeUpTime" value={formData.wokeUpTime} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* 4. Notes & médias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Note personnelle (1–10)</label>
            <input type="number" name="dreamScore" value={formData.dreamScore} onChange={handleChange} className={inputClass} min={1} max={10} />
            <p className="text-sm text-gray-400">Note subjective sur la beauté/intérêt du rêve</p>
          </div>
          <div>
            <label className={labelClass}>Lien audio (optionnel)</label>
            <input type="url" name="audioNote" value={formData.audioNote} onChange={handleChange} className={inputClass} />
            <p className="text-sm text-gray-400">Lien vers une note vocale enregistrée</p>
          </div>
          <div className="col-span-full">
            <label className={labelClass}>Images / illustrations</label>
            <input type="url" name="images" value={formData.images} onChange={handleChange} className={inputClass} placeholder="Lien vers des images (séparées par des virgules)" />
          </div>
        </div>

        {/* 5. Confidentialité */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-bold text-white mb-2">🔒 Confidentialité</h3>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="private" checked={formData.private} onChange={handleChange} />
            <label className={labelClass}>Rêve privé (non visible publiquement)</label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200"
        >
          Ajouter le rêve ✨
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
