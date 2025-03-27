"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";

export default function AddDream() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            alert("Veuillez remplir tous les champs");
            return;    
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
            const request = await fetch(`${baseUrl}/api/dreams`, {
                cache: "no-cache",
                credentials: "include", 
              });
            await fetch(`${baseUrl}/api/dreams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (request.ok) {
                router.push("/");
            } else {
                throw new Error("HTTP error, failed to add dream. Status: ${request.status}");
            }

        } catch (error) {
            console.error("Error adding dream:", error);
            alert("Une erreur s'est produite lors de l'ajout du rêve");
        }
    }

    return (
        <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white text-center mb-8">🌙 Ajouter un Nouveau Rêve</h1>

            <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-700">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input 
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="border border-slate-600 bg-slate-800 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        type="text" 
                        placeholder="Titre du rêve" 
                    />
                    
                    <textarea 
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="border border-slate-600 bg-slate-800 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none" 
                        placeholder="Décris ton rêve..." 
                    />

                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-500 font-bold text-white py-3 px-6 rounded-lg transition w-full"
                    >
                        Ajouter le rêve ✨
                    </button>
                </form>
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
