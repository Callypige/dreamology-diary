"use client";
import React from 'react';
import DreamList from './DreamList';

export default function DreamFilterUI() {
    const [type, setType] = React.useState('');
    const [mood, setMood] = React.useState('');
    const [tag, setTag] = React.useState('');
    const [recurring, setRecurring] = React.useState(false);
    const [dreamScore, setDreamScore] = React.useState(0);

    return (
    <div className="w-full max-w-3xl space-y-4">
      <form className="flex flex-col gap-4 mb-8">
        <div>
          <label>Type de rêve :</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous</option>
            <option value="lucide">Lucide</option>
            <option value="rêve">Rêve</option>
            <option value="cauchemar">Cauchemar</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
            />
            Rêves récurrents uniquement
          </label>
        </div>
        <div>
          <label>Score minimum du rêve : {dreamScore}</label>
          <input
            type="range"
            min="0"
            max="10"
            value={dreamScore}
            onChange={(e) => setDreamScore(Number(e.target.value))}
          />
        </div>
      </form>
      <DreamList type={type} recurring={recurring} dreamScore={dreamScore} />
    </div>
  );
}
