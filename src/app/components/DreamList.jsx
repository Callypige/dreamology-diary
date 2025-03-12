import RemoveBtn from "@/app/components/RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";

const getDreams = async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
        const request = await fetch(`${baseUrl}/api/dreams`, { cache: "no-cache" });

        if (!request.ok) {
            throw new Error(`HTTP error, failed to fetch dreams. Status: ${request.status}`);
        }

        return request.json();
    } catch (error) {
        console.error("Error fetching dreams:", error);
        return [];
    }
};

export default async function DreamList() {
    const { body: dreams } = await getDreams();

    return (
        <section className="w-full px-8 py-12 bg-gradient-to-b from-slate-800 to-slate-950 min-h-screen">
            <h1 className="text-5xl font-extrabold text-white text-center tracking-wide mb-12 drop-shadow-lg">
                ✨ Mes Rêves ✨
            </h1>

            {dreams.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-center">
                    {dreams.map((dream) => (
                        <div
                            key={dream._id}
                            className="bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 md:w-[30%] lg:w-[30%] w-full"
                        >
                            <Link href={`/viewDream/${dream._id}`}>
                                <h2 className="text-3xl font-bold text-white mb-4 hover:text-blue-400 transition cursor-pointer">
                                    {dream.title}
                                </h2>
                            </Link>
                            <p className="text-gray-300 text-lg leading-relaxed">{dream.description}</p>
                            <div className="flex justify-end gap-6 mt-6">
                                <RemoveBtn id={dream._id} />
                                <Link
                                    href={`/editDream/${dream._id}`}
                                    className="text-blue-400 hover:text-blue-500 transition"
                                >
                                    <HiPencilAlt size={32} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center text-2xl font-light mt-12">
                    😴 Aucun rêve enregistré. Rêve encore plus fort !
                </p>
            )}
        </section>
    );
}