"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link"; 
import { Toast, useToast } from "../../components/Toast";
import { Moon } from "lucide-react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "", 
    password: "",
    confirmPassword: ""
  });

  const { toast, success: showSuccess, error: showError, hideToast } = useToast();

  const checkAvailability = async (field, value) => {
    if (!value || (field === 'name' && value.length < 3) || (field === 'email' && !value.includes('@'))) return;
    
    setCheckingAvailability(true);
    
    try {
      const response = await fetch("/api/auth/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      
      const data = await response.json();
      
      setValidationErrors(prev => ({
        ...prev,
        [field]: data.available ? "" : data.message
      }));
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.name && form.name.length >= 3) {
        checkAvailability("name", form.name);
      } else if (form.name && form.name.length > 0 && form.name.length < 3) {
        setValidationErrors(prev => ({ ...prev, name: "Le pseudo doit contenir au moins 3 caractères" }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.name]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.email && form.email.includes("@")) {
        checkAvailability("email", form.email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email]);

  // Validation email
  useEffect(() => {
    let passwordError = "";
    
    if (form.password && form.password.length > 0) {
      if (form.password.length < 6) {
        passwordError = "Le mot de passe doit contenir au moins 6 caractères";
      } else if (!/(?=.*[a-z])/.test(form.password)) {
        passwordError = "Le mot de passe doit contenir au moins une minuscule";
      } else if (!/(?=.*[A-Z])/.test(form.password)) {
        passwordError = "Le mot de passe doit contenir au moins une majuscule";
      } else if (!/(?=.*\d)/.test(form.password)) {
        passwordError = "Le mot de passe doit contenir au moins un chiffre";
      }
    }
    
    setValidationErrors(prev => ({ ...prev, password: passwordError }));
  }, [form.password]);

  // confirm password validation
  useEffect(() => {
    let confirmError = "";
    
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      confirmError = "Les mots de passe ne correspondent pas";
    }
    
    setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError }));
  }, [form.password, form.confirmPassword]);

  // verify user name
  useEffect(() => {
    let nameError = "";
    
    if (form.name && form.name.length > 0) {
      if (form.name.length < 3) {
        nameError = "Le pseudo doit contenir au moins 3 caractères";
      } else if (form.name.length > 20) {
        nameError = "Le pseudo ne peut pas dépasser 20 caractères";
      } else if (!/^[a-zA-Z0-9_-]+$/.test(form.name)) {
        nameError = "Le pseudo ne peut contenir que des lettres, chiffres, - et _";
      }
    }
    
    if (!validationErrors.name || !validationErrors.name.includes("déjà")) {
      setValidationErrors(prev => ({ ...prev, name: nameError }));
    }
  }, [form.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hasValidationErrors = Object.values(validationErrors).some(error => error !== "");
    
    if (hasValidationErrors) {
      showError("Veuillez corriger les erreurs avant de continuer");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
          confirmPassword: form.confirmPassword, 
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(true);
        showSuccess("✅ Compte créé ! Vérifiez votre email 📧");
        
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message);
        showError(data.message);
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
      showError("Erreur de connexion. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  // Helper function to get input styles based on validation
  const getInputStyle = (fieldName) => {
    const baseStyle = "w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border focus:outline-none focus:ring-2 transition-all";
    
    if (validationErrors[fieldName]) {
      return `${baseStyle} border-red-500 focus:ring-red-500`;
    } else if (form[fieldName] && !validationErrors[fieldName] && fieldName !== 'password' && fieldName !== 'confirmPassword') {
      return `${baseStyle} border-green-500 focus:ring-green-500`;
    } else {
      return `${baseStyle} border-slate-600 focus:ring-indigo-500`;
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = form.password;
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const labels = ["", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-green-500"];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  // Display after successful signup
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 text-center">
          <figure className="flex justify-center mb-4">
            <Moon size={120} className="mb-6 text-blue-400 mx-auto" />
          </figure>

          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Vérifiez votre email !
          </h2>
          
          <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-6">
            <p className="text-green-400 mb-2">
              ✅ Compte créé avec succès !
            </p>
            <p className="text-gray-300 text-sm">
              Un email de vérification a été envoyé à votre adresse
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-2">📋 Prochaines étapes :</h3>
            <ul className="text-sm text-gray-400 space-y-1 text-left">
              <li>• Vérifiez votre boîte de réception</li>
              <li>• Regardez aussi dans les spams</li>
              <li>• Cliquez sur le lien de vérification</li>
              <li>• Revenez vous connecter</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link 
              href="sign-in"
              className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
            >
              Aller à la connexion
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="block w-full py-2 px-4 text-gray-400 hover:text-gray-300 transition"
            >
              ← Retour au formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">

        <figure className="flex justify-center mb-4">
          <Moon size={120} className="mb-6 text-blue-400 mx-auto" />
          <figcaption className="sr-only">
            Illustration by&nbsp;
            <a
              href="https://www.freepik.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Freepik
            </a>
          </figcaption>
        </figure>

        <h2 className="text-center text-2xl font-bold text-white mb-6">Créer un compte</h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm text-center border border-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pseudo */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Pseudo (3-20 caractères)"
                disabled={loading}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={getInputStyle('name')}
                required
              />
              {checkingAvailability && form.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {!checkingAvailability && form.name && !validationErrors.name && form.name.length >= 3 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                  ✓
                </div>
              )}
            </div>
            {validationErrors.name && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                ❌ {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                disabled={loading}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={getInputStyle('email')}
                required
              />
              {checkingAvailability && form.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {!checkingAvailability && form.email && !validationErrors.email && form.email.includes("@") && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                  ✓
                </div>
              )}
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                ❌ {validationErrors.email}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              disabled={loading}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={getInputStyle('password')}
              required
            />
            {form.password && (
              <div className="mt-1 flex items-center justify-between">
                <p className={`text-xs ${passwordStrength.color}`}>
                  Force : {passwordStrength.label}
                </p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-1 rounded ${
                        level <= passwordStrength.strength
                          ? level <= 2 ? 'bg-red-400' : level <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">
                ❌ {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              disabled={loading}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={getInputStyle('confirmPassword')}
              required
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                ❌ {validationErrors.confirmPassword}
              </p>
            )}
            {form.confirmPassword && !validationErrors.confirmPassword && form.password === form.confirmPassword && (
              <p className="text-green-400 text-xs mt-1 flex items-center">
                ✓ Les mots de passe correspondent
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-all duration-200"
            disabled={loading || Object.values(validationErrors).some(error => error !== "")}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Inscription en cours...
              </span>
            ) : (
              "🚀 S'inscrire"
            )}
          </button>
        </form>

        {/* Option Google */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-gray-400">ou</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition duration-200 flex items-center justify-center border border-gray-300"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <Link href="/auth/sign-in" className="text-indigo-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default SignUp;