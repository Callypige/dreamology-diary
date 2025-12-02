"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailNotVerified(false);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res.error) {
      if (res.error === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true);
        setError("⚠️ Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte mail ou renvoyer l'email de vérification.");
      } else {
        setError("❌ Email ou mot de passe incorrect !");
      }
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage("✅ Email de récupération envoyé ! Vérifiez votre boîte mail.");
        setForgotPasswordEmail("");
        setTimeout(() => setShowForgotPassword(false), 3000);
      } else {
        setForgotPasswordMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setForgotPasswordMessage("❌ Erreur lors de l'envoi de l'email");
    }

    setForgotPasswordLoading(false);
  };

  const resendVerificationEmail = async () => {
    setResendLoading(true);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("✅ Email de vérification renvoyé ! Vérifiez votre boîte mail.");
        setEmailNotVerified(false);
      } else {
        setError(`❌ ${data.message}`);
      }
    } catch (error) {
      setError("❌ Erreur lors du renvoi de l'email");
    }

    setResendLoading(false);
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-center text-2xl font-bold text-white mb-6">Mot de passe oublié</h2>
          
          {forgotPasswordMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm text-center ${
              forgotPasswordMessage.includes('✅') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {forgotPasswordMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={forgotPasswordLoading}
            />
            
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition-all duration-200"
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? "Envoi en cours..." : "Envoyer l'email de récupération"}
            </button>
          </form>

          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
        <figure className="flex justify-center mb-4">
          <figcaption className="sr-only">
            Illustration by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>
          </figcaption>
        </figure>
        
        <h2 className="text-center text-2xl font-bold text-white">Se connecter</h2>

        {error && (
          <div className={`p-3 rounded-md mt-4 text-sm text-center ${
            error.includes('✅') 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {error}
            {emailNotVerified && (
              <button
                onClick={resendVerificationEmail}
                className="block w-full mt-3 p-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-all duration-200"
                disabled={resendLoading}
              >
                {resendLoading ? "Renvoi en cours..." : "Renvoyer l'email de vérification"}
              </button>
            )}
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

        <div className="text-center mt-4">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-indigo-400 hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="text-indigo-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;