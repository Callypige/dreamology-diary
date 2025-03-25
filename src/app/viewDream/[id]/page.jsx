import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";

const getDreamById = async (id) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
        const response = await fetch(`${baseUrl}/api/dreams/${id}`, { cache: "no-cache" });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching dream:", error);
        return null;
    }
};

export default async function DreamDetails({ params }) {
    const { id } = await params
    const { dream } = await getDreamById(id);

    if (!dream) {
        return (
            <section className="w-full min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-gray-300 text-xl">Ce rêve est introuvable...</p>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen bg-gradient-to-r from-indigo-950 to-slate-950 flex flex-col items-center justify-center px-6">
            <div className="bg-slate-800 shadow-2xl rounded-3xl p-12 md:p-16 lg:p-20 w-full max-w-[90%] mx-auto border border-slate-700">
                <h1 className="text-5xl font-bold text-white mb-8 border-b border-indigo-500 pb-4">
                    🌠 {dream.title}
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed whitespace-pre-line">
                    {dream.description}
                </p>
                <div className="mt-10 flex justify-end">
                    <Link href="/" className="inline-flex items-center text-gray-300 hover:text-indigo-400 transition">
                        <TbArrowBackUp size={28} className="mr-2" />
                        Retour à la liste
                    </Link>
                </div>
            </div>
        </section>
    );
}