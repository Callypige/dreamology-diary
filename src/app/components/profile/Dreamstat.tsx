"use client";

import React, { useState, useEffect } from "react";
import { TbMoon, TbBrain, TbRepeat, TbGhost, TbChartBar, TbClock, TbMicrophone } from "react-icons/tb";

interface DreamStats {
    totalDreams: number;
    recurringDreams: number;
    dreamScore: number;
    dreamScoreCount: number;
    moods: Record<string, number>;
    tags: Record<string, number>;
    lucidDreams: number;
    nightmares: number;
    normalDreams: number;
    dreamsWithAudio: number;
    averageSleepTime: string;    
    averageWakeTime: string;
    dreamsWithSleepTime: number;
    dreamsWithWakeTime: number;
}

export default function DreamStat() {
    const [stats, setStats] = useState<DreamStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/profile/stats");
                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }
                const data = await response.json();
                console.log('📊 Données reçues:', data);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-white text-center">Chargement des statistiques...</div>;
    }
    
    if (!stats) {
        return <div className="text-white text-center">Aucune donnée disponible</div>;
    }

    const getPercentage = (value: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Statistiques de Rêves</h2>
            
            {/* Grille des statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbMoon size={24} className="text-purple-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">{stats.totalDreams}</h3>
                        <p className="text-gray-300">Rêves Totaux</p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbRepeat size={24} className="text-blue-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.recurringDreams} ({getPercentage(stats.recurringDreams, stats.totalDreams)}%)
                        </h3>
                        <p className="text-gray-300">Rêves Récurrents</p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbBrain size={24} className="text-green-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.lucidDreams} ({getPercentage(stats.lucidDreams, stats.totalDreams)}%)
                        </h3>
                        <p className="text-gray-300">Rêves Lucides</p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbGhost size={24} className="text-red-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.nightmares} ({getPercentage(stats.nightmares, stats.totalDreams)}%)
                        </h3>
                        <p className="text-gray-300">Cauchemars</p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbChartBar size={24} className="text-yellow-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.dreamScore > 0 ? `${stats.dreamScore}/10` : 'Pas de score'}
                        </h3>
                        <p className="text-gray-300">
                            Score Moyen {stats.dreamScoreCount > 0 && `(${stats.dreamScoreCount} rêves)`}
                        </p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbMicrophone size={24} className="text-pink-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.dreamsWithAudio} ({getPercentage(stats.dreamsWithAudio, stats.totalDreams)}%)
                        </h3>
                        <p className="text-gray-300">Rêves avec Audio</p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbClock size={24} className="text-orange-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">{stats.averageSleepTime}</h3>
                        <p className="text-gray-300">
                            Heure de Coucher Moyenne
                            {stats.dreamsWithSleepTime > 0 && (
                                <span className="text-xs block">({stats.dreamsWithSleepTime} rêves)</span>
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbClock size={24} className="text-cyan-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">{stats.averageWakeTime}</h3>
                        <p className="text-gray-300">
                            Heure de Réveil Moyenne
                            {stats.dreamsWithWakeTime > 0 && (
                                <span className="text-xs block">({stats.dreamsWithWakeTime} rêves)</span>
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                    <TbMoon size={24} className="text-indigo-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {stats.normalDreams} ({getPercentage(stats.normalDreams, stats.totalDreams)}%)
                        </h3>
                        <p className="text-gray-300">Autres Rêves</p>
                    </div>
                </div>
            </div>
            
            <hr className="my-6 border-gray-600" />

            {/* Détails supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CORRECTION: Humeurs */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        😊 Humeurs les plus fréquentes
                    </h3>
                    {Object.keys(stats.moods).length === 0 ? (
                        <p className="text-gray-400 italic">Aucune humeur renseignée pour l'instant</p>
                    ) : (
                        <ul className="space-y-2">
                            {Object.entries(stats.moods).map(([mood, count]) => (
                                <li key={mood} className="flex justify-between items-center text-gray-300">
                                    <span className="capitalize">{mood}</span>
                                    <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                                        {count} ({getPercentage(count, stats.totalDreams)}%)
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* CORRECTION: Tags */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        🏷️ Tags les plus utilisés
                    </h3>
                    {Object.keys(stats.tags).length === 0 ? (
                        <p className="text-gray-400 italic">Pas de tags pour l'instant</p>
                    ) : (
                        <ul className="space-y-2">
                            {Object.entries(stats.tags).map(([tag, count]) => (
                                <li key={tag} className="flex justify-between items-center text-gray-300">
                                    <span>#{tag}</span>
                                    <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                                        {count} ({getPercentage(count, stats.totalDreams)}%)
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}