"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded text-black"
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border rounded text-black"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Connexion
      </button>
    </form>
  );
}
