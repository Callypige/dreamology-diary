import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    try {
        const userId = session?.user?.id;

        // Count total number of dreams for the user
        const totalDreams = await Dream.countDocuments({ user: userId });
        
        // Count total number of lucid dreams for the user
        const totalLucidDreams = await Dream.countDocuments({
            user: userId,
            type: "lucide"
        });
        
        // Count total number of nightmares for the user
        const totalNightmares = await Dream.countDocuments({
            user: userId,
            type: "cauchemar"
        });
        
        // Count total number of normal dreams for the user
        const totalNormalDreams = await Dream.countDocuments({
            user: userId,
            type: "autre"
        });
        
        // Count total number of recurring dreams for the user
        const totalRecurringDreams = await Dream.countDocuments({
            user: userId,
            recurring: true
        });
        
        // CORRECTION: Count dreams with audio - plus strict
        const totalDreamsWithAudio = await Dream.countDocuments({
            user: userId,
            audioNote: { 
                $exists: true, 
                $ne: "", 
                $ne: null,
                $regex: /^\/.*\.(webm|mp3|wav|m4a)$/i // Vérifie que c'est un vrai fichier audio
            }
        });

        // CORRECTION: Calculate average dream score avec debug
        console.log('🎯 Debug dreamScore - Recherche des rêves avec score...');
        const dreamsWithScore = await Dream.find({ 
            user: userId,
            dreamScore: { $exists: true, $ne: null }
        }, { dreamScore: 1, title: 1 }).limit(3);
        console.log('Exemples de rêves avec score:', dreamsWithScore);

        const averageDreamScore = await Dream.aggregate([
            { $match: { 
                user: userId,
                dreamScore: { $exists: true, $ne: null, $type: "number" }
            }},
            { $group: { 
                _id: null, 
                averageScore: { $avg: "$dreamScore" },
                count: { $sum: 1 }
            }}
        ]);
        console.log('Résultat agrégation score:', averageDreamScore);

        // CORRECTION: Get common tags avec debug
        console.log('🏷️ Debug tags...');
        const dreamsWithTags = await Dream.find({ 
            user: userId,
            tags: { $exists: true, $ne: [] }
        }, { tags: 1, title: 1 }).limit(3);
        console.log('Exemples de rêves avec tags:', dreamsWithTags);

        const commonTags = await Dream.aggregate([
            { $match: { 
                user: userId,
                tags: { $exists: true, $ne: [], $ne: null, $type: "array" }
            }},
            { $unwind: "$tags" },
            { $match: { 
                tags: { $ne: "", $ne: null, $type: "string" }
            }},
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('Tags trouvés:', commonTags);

        // CORRECTION: Get common moods avec debug
        console.log('😊 Debug moods...');
        const dreamsWithMoods = await Dream.find({ 
            user: userId,
            mood: { $exists: true, $ne: "" }
        }, { mood: 1, title: 1 }).limit(3);
        console.log('Exemples de rêves avec mood:', dreamsWithMoods);

        const commonMoods = await Dream.aggregate([
            { $match: { 
                user: userId,
                mood: { $exists: true, $ne: "", $ne: null, $type: "string" }
            }},
            { $group: { _id: "$mood", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('Moods trouvés:', commonMoods);

        // CORRECTION: Debug sleep times
        console.log('🕐 Debug sleep times...');
        const dreamsWithSleepData = await Dream.find({ 
            user: userId,
            $or: [
                { sleepTime: { $exists: true, $ne: null } },
                { wokeUpTime: { $exists: true, $ne: null } }
            ]
        }, { sleepTime: 1, wokeUpTime: 1, title: 1 }).limit(3);
        console.log('Exemples de rêves avec heures:', dreamsWithSleepData);

        // Count dreams with sleep time and wake time
        const dreamsWithSleepTime = await Dream.countDocuments({
            user: userId,
            sleepTime: { $exists: true, $ne: null, $type: "date" }
        });
        
        const dreamsWithWakeTime = await Dream.countDocuments({
            user: userId,
            wokeUpTime: { $exists: true, $ne: null, $type: "date" }
        });

        // Calculate average sleep and wake times
        const averageSleepTimes = await Dream.aggregate([
            { $match: { 
                user: userId,
                sleepTime: { $exists: true, $ne: null, $type: "date" }
            }},
            { $group: { 
                _id: null, 
                averageHour: { $avg: { $hour: "$sleepTime" }},
                averageMinute: { $avg: { $minute: "$sleepTime" }},
                count: { $sum: 1 }
            }}
        ]);

        const averageWakeTimes = await Dream.aggregate([
            { $match: { 
                user: userId,
                wokeUpTime: { $exists: true, $ne: null, $type: "date" }
            }},
            { $group: { 
                _id: null, 
                averageHour: { $avg: { $hour: "$wokeUpTime" }},
                averageMinute: { $avg: { $minute: "$wokeUpTime" }},
                count: { $sum: 1 }
            }}
        ]);

        // Prepare the result object
        const result = {
            totalDreams,
            recurringDreams: totalRecurringDreams,
            dreamScore: averageDreamScore[0]?.averageScore ? Math.round(averageDreamScore[0].averageScore * 10) / 10 : 0,
            dreamScoreCount: averageDreamScore[0]?.count || 0,
            
            // CORRECTION: Gestion plus propre des cas vides
            moods: commonMoods.length > 0 
                ? Object.fromEntries(commonMoods.map(mood => [mood._id, mood.count]))
                : {},
                
            tags: commonTags.length > 0 
                ? Object.fromEntries(commonTags.map(tag => [tag._id, tag.count]))
                : {},
                
            lucidDreams: totalLucidDreams,
            nightmares: totalNightmares,
            dreamsWithAudio: totalDreamsWithAudio,
            normalDreams: totalNormalDreams,

            averageSleepTime: averageSleepTimes[0] && averageSleepTimes[0].count > 0
                ? `${Math.round(averageSleepTimes[0].averageHour)}:${Math.round(averageSleepTimes[0].averageMinute).toString().padStart(2, '0')}`
                : "Pas d'heure de coucher",
                
            averageWakeTime: averageWakeTimes[0] && averageWakeTimes[0].count > 0
                ? `${Math.round(averageWakeTimes[0].averageHour)}:${Math.round(averageWakeTimes[0].averageMinute).toString().padStart(2, '0')}`
                : "Pas d'heure de réveil",
                
            dreamsWithSleepTime,
            dreamsWithWakeTime
        };  

        console.log('📊 Stats générées:', result); 

        return NextResponse.json(result);

    } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des statistiques" },
            { status: 500 }
        );
    }
}