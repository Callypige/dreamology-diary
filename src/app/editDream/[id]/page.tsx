// src/app/editDream/[id]/page.tsx
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import EditDreamForm from "@/app/components/EditDreamForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDream({ params }: PageProps) {
  const { id } = await params;

  return (
    <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen flex flex-col justify-center relative z-10">
      <div className="p-8 rounded-2xl shadow-lg border border-slate-700 relative">
        <EditDreamForm id={id} />
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