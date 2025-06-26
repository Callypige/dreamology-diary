"use client";
import { useState, useEffect } from "react";
import EditNameForm from "./EditNameForm"; 

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchProfile() {
          try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            setProfile(data);
          } catch (error) {
            console.error("Erreur lors de la récupération du profil :", error);
          } finally {
            setLoading(false);
          }
      }
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">Chargement...</div>;
    }
    if (!profile) {
        return <div className="text-center text-red-500">Erreur lors de la récupération du profil.</div>;
    } 

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      <p className="text-gray-500 mb-4">
        Gérez vos informations personnelles et vos préférences.
      </p>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <EditNameForm profile={profile} />
      </div>
    </div>
  );
}