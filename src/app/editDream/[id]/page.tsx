"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import EditDreamForm from "@/app/components/EditDreamForm";
import React from "react";

interface Dream {
  _id: string;
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
  private?: boolean;
}

export default function EditDream({ params }: { params: { id: string } }) {
  const { id } = params;
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/dreams/${id}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data || !data.dream) {
          console.error("Données manquantes");
          return;
        }

        setDream(data.dream);
      } catch (error) {
        console.error("Erreur lors du chargement du rêve :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center mt-20">Chargement du rêve...</p>;
  }

  if (!dream) {
    return <p className="text-red-500 text-center mt-20">Rêve introuvable ou accès refusé.</p>;
  }

  return (
    <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-white text-center mb-8">🌙 Modifier</h1>

      <div className="p-8 rounded-2xl shadow-lg border border-slate-700">
        <EditDreamForm {...dream} id={dream._id} />
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/" className="flex items-center text-white hover:text-blue-400 transition">
          <TbArrowBackUp size={28} className="mr-2" />
          Retour à la liste
        </Link>
      </div>
    </section>
  );
}
