"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res.error) {
      setError("❌ Email ou mot de passe incorrect !");
      setLoading(false);
    } else {
      router.push("/");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">

          <figure className="flex justify-center mb-4">
            <Image
              src="/images/cat_sleeping_sign.jpg"     
              alt="Chat qui signe un document"
              width={140}                    
              height={140}
              className="rounded-full object-cover shadow-md"
              priority
            />
            <figcaption className="sr-only">
              Illustration by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>
            </figcaption>
          </figure>
        <h2 className="text-center text-2xl font-bold text-white">Se connecter</h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mt-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <input
            type="email"
            placeholder="Email"
            disabled={loading}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            disabled={loading}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-indigo-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
