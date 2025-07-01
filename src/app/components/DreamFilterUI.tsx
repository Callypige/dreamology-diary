"use client";

import React, { useState } from "react";
import DreamList from "./DreamList";

export default function DreamFilterUI() {
  const [type, setType] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [dreamScore, setDreamScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 px-4">
      {/* Filtres (visible sur desktop ou via toggle mobile) */}
      <div className="lg:w-1/4 w-full">
        {/* Bouton toggle visible uniquement sur mobile */}
        <button
          className="lg:hidden mb-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </button>

        {/* Formulaire de filtres */}
        <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
          <form className="bg-slate-800 rounded-xl p-6 shadow-md border border-slate-700 space-y-6">
            <h2 className="text-2xl text-white font-semibold">Filtres</h2>

            {/* Type de rêve */}
            <div className="flex flex-col">
              <label htmlFor="type" className="text-white mb-1 font-medium">
                Type de rêve :
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-700 text-white rounded px-3 py-2 focus:outline-none border border-slate-600"
              >
                <option value="">Tous</option>
                <option value="lucide">Lucide</option>
                <option value="rêve">Rêve</option>
                <option value="cauchemar">Cauchemar</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Récurrence */}
            <div className="flex items-center gap-2">
              <input
                id="recurring"
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="accent-pink-600 w-5 h-5"
              />
              <label htmlFor="recurring" className="text-white font-medium">
                Rêves récurrents uniquement
              </label>
            </div>

            {/* Score */}
            <div className="flex flex-col">
              <label htmlFor="score" className="text-white mb-1 font-medium">
                Score minimum du rêve : {dreamScore}
              </label>
              <input
                id="score"
                type="range"
                min="0"
                max="10"
                value={dreamScore}
                onChange={(e) => setDreamScore(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Liste des rêves */}
      <div className="lg:w-3/4 w-full">
        <DreamList type={type} recurring={recurring} dreamScore={dreamScore} />
      </div>
    </div>
  );
}
