import { FormEvent, useState } from "react";

export default function EditNameForm({
  profile,
}: {
  profile: { name: string; bio?: string; location?: string; avatarUrl?: string };
}) {
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, location, avatarUrl }),
    });

    if (!res.ok) {
      setError("Erreur lors de la mise à jour.");
    } else {
      setSuccess(true);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-black">Nom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <div>
        <label className="text-black">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <div>
        <label className="text-black">Localisation</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <div>
        <label className="text-black">Avatar URL</label>
        <input
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">Profil mis à jour !</p>}
    </form>
  );
}
