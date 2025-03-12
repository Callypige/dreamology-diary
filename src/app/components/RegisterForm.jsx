"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ✅ Check if passwords match before sending request
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setMessage(`🎉 Welcome ${email}! Redirecting...`);
      
      // ✅ Automatically sign in the user after registration
      await signIn("credentials", { email, password, redirect: false });

      // ✅ Redirect to the home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMessage(data.error || "An error occurred!");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 p-6 bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>

      {message && <p className="text-center text-lg text-green-400">{message}</p>}

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
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border rounded text-black"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="px-4 py-2 border rounded text-black"
        required
      />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded w-full" disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
}
