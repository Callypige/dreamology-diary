"use client";
import { useState, useEffect } from "react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import DreamStats from "@/components/profile/DreamStats";

interface Profile {
  id: string;
  name: string;
  email: string;
  [key: string]: string | number | boolean | undefined;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInfoProfile, setShowInfoProfile] = useState(false);

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
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-500 text-lg">Chargement...</div>
          </div>
        );
    }
    
    if (!profile) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 text-lg">Erreur lors de la récupération du profil.</div>
          </div>
        );
    } 
    
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"> {/* ← Conteneur plus large et responsive */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">🌙 Mon Profil</h1>
        
        {/* Statistiques */}
        <div className="mb-8">
          <DreamStats /> 
        </div>
        
        <hr className="my-8 border-gray-700" />
        
        {/* Section informations personnelles */}
        <div className="max-w-2xl mx-auto"> {/* ← Conteneur plus étroit pour cette section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Informations personnelles</h2>
            <button
              onClick={() => setShowInfoProfile(!showInfoProfile)}
              className="text-blue-500 hover:underline text-sm sm:text-base self-start sm:self-center"
            >
              {showInfoProfile ? "Masquer les informations" : "Afficher les informations"}
            </button>
          </div>
          
          {showInfoProfile && (
            <>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Gérez vos informations personnelles et vos préférences.
              </p>
              <div className="bg-slate-800 shadow rounded-lg p-4 sm:p-6 border border-slate-700">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Informations personnelles</h3>
                <ProfileEditForm profile={profile} />
              </div>
            </>
          )}
        </div>
      </div>
    );
}