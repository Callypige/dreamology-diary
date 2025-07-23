import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    try {
        const userId = new mongoose.Types.ObjectId(session?.user?.id);

        // 1. Total dreams
        const totalDreams = await Dream.countDocuments({ user: userId });

        // 2. Recurring dreams
        const recurringDreams = await Dream.countDocuments({
            user: userId,
            recurring: true
        });

        // 3. Lucid dreams
        const lucidDreams = await Dream.countDocuments({
            user: userId,
            type: "lucide"
        });

        // 4. Nightmares
        const nightmares = await Dream.countDocuments({
            user: userId,
            type: "cauchemar"
        });

        // 5. Score moyen
        const dreamScoreResult = await Dream.aggregate([
            { $match: { 
                user: userId,
                dreamScore: { $exists: true, $ne: null, $ne: "null" }
            }},
            { $group: { 
                _id: null, 
                averageScore: { $avg: "$dreamScore" },
                count: { $sum: 1 }
            }}
        ]);

        // 6. Audio dreams
        const dreamsWithAudio = await Dream.countDocuments({
            user: userId,
            audioNote: { 
                $exists: true, 
                $ne: "", 
                $ne: null,
                $regex: /\.(webm|mp3|wav|m4a)$/i // Regex to match common audio file extensions
            }
        });

            // 7. Bedtime average - CORRIGÉ avec fuseau horaire
        const averageSleepTime = await Dream.aggregate([
        { $match: { 
            user: userId,
            sleepTime: { $exists: true, $ne: null }
        }},
        { $addFields: {
            // Convertir en heure locale (UTC+2 pour la France en été)
            localSleepTime: { $add: ["$sleepTime", 2 * 60 * 60 * 1000] } // +2h en millisecondes
        }},
        { $group: { 
            _id: null, 
            averageHour: { $avg: { $hour: "$localSleepTime" }},
            averageMinute: { $avg: { $minute: "$localSleepTime" }},
            count: { $sum: 1 }
        }}
        ]);

        // 8. Woke up time average - CORRIGÉ avec fuseau horaire
        const averageWakeTime = await Dream.aggregate([
        { $match: { 
            user: userId,
            wokeUpTime: { $exists: true, $ne: null }
        }},
        { $addFields: {
            // Convertir en heure locale (UTC+2 pour la France en été)
            localWakeTime: { $add: ["$wokeUpTime", 2 * 60 * 60 * 1000] } // +2h en millisecondes
        }},
        { $group: { 
            _id: null, 
            averageHour: { $avg: { $hour: "$localWakeTime" }},
            averageMinute: { $avg: { $minute: "$localWakeTime" }},
            count: { $sum: 1 }
        }}
        ]);

        // 9. Moods top 5
        const topMoods = await Dream.aggregate([
            { $match: { 
                user: userId,
                mood: { $exists: true, $ne: "", $ne: null }
            }},
            { $group: { _id: "$mood", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 10. Tags top 5
        const topTags = await Dream.aggregate([
            { $match: { 
                user: userId,
                tags: { $exists: true, $ne: [], $ne: null }
            }},
            { $unwind: "$tags" },
            { $match: { 
                tags: { $ne: "", $ne: null }
            }},
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const result = {
            // main stats
            totalDreams,
            recurringDreams,
            lucidDreams,
            nightmares,
            
            // Score moyen
            dreamScore: dreamScoreResult[0]?.averageScore 
                ? Math.round(dreamScoreResult[0].averageScore * 10) / 10 
                : 0,
            dreamScoreCount: dreamScoreResult[0]?.count || 0,
            
            // Audio
            dreamsWithAudio,
            
            // Time averages
            averageSleepTime: averageSleepTime[0] && averageSleepTime[0].count > 0
                ? {
                    time: `${Math.round(averageSleepTime[0].averageHour)}:${Math.round(averageSleepTime[0].averageMinute).toString().padStart(2, '0')}`,
                    count: averageSleepTime[0].count
                }
                : {
                    time: "Pas d'heure de coucher",
                    count: 0
                },
                
            averageWakeTime: averageWakeTime[0] && averageWakeTime[0].count > 0
                ? {
                    time: `${Math.round(averageWakeTime[0].averageHour)}:${Math.round(averageWakeTime[0].averageMinute).toString().padStart(2, '0')}`,
                    count: averageWakeTime[0].count
                }
                : {
                    time: "Pas d'heure de réveil",
                    count: 0
                },
            
            // Moods and tags
            topMoods: topMoods.length > 0 
                ? topMoods.map(mood => ({
                    name: mood._id,
                    count: mood.count
                }))
                : [],
                
            topTags: topTags.length > 0 
                ? topTags.map(tag => ({
                    name: tag._id,
                    count: tag.count
                }))
                : []
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des statistiques" },
            { status: 500 }
        );
    }
}