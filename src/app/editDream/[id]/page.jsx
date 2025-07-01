import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import EditDreamForm from "@/app/components/EditDreamForm";

const getDreamById = async (id) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const request = await fetch(`${baseUrl}/api/dreams/${id}`, { cache: "no-store", credentials: "include" });

            if (!request.ok) {
                throw new Error(`HTTP error! Status: ${request.status}`);
            }
            return request.json();

        } catch (error) {
            console.error("Error fetching dream:", error);
            return null;
        }
        
    }
    
export default async function EditDream({ params }) {
    const { id } = await params
    const { dream } = await getDreamById(id);
    console.log("📌 Données du rêve sélectionné :", dream);
    const { title, description } = dream;

    console.log("Edit dream with id:", id);
    return (
        <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white text-center mb-8">🌙 Modifier</h1>
            
            <div className="p-8 rounded-2xl shadow-lg border border-slate-700">
                <EditDreamForm id={id} title={title} description={description} />
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
