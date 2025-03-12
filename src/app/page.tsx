"use client";

import DreamList from "@/app/components/DreamList";
import AuthForm from "@/app/components/AuthForm";
import RegisterForm from "@/app/components/RegisterForm";
import { useSession } from "next-auth/react";

export default function Home() {
  const  { data: session } = useSession()
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Dreamology 🌙</h1>

      {session ? (
        <>
          <p className="text-xl mb-6">Connecté en tant que {session.user?.email}</p>
          <DreamList />
        </>
      ) : (
        <>
          <h2 className="text-2xl mb-4">Connexion</h2>
          <AuthForm />
          <p className="mt-4">Pas encore de compte ?</p>
          <RegisterForm />
        </>
      )}
    </div>
    </>
  );
}

