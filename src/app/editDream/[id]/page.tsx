"use client";

import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import EditDreamForm from "@/app/components/EditDreamForm";
import React from "react";

export default function EditDream({ params }: { params: { id: string } }) {
  const { id } = React.use(params);

  return (
    <section className="w-full max-w-4xl mx-auto pt-24 px-6 min-h-screen flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-white text-center mb-8">🌙 Modifier</h1>

      <div className="p-8 rounded-2xl shadow-lg border border-slate-700">
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