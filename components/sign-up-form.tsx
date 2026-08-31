"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Send, Loader2, Eye, EyeOff } from "lucide-react";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : "Une erreur est survenue. Réessaie."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-10">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Send className="w-10 h-10 text-blue-600 -rotate-45 mb-2" fill="currentColor" strokeWidth={0} />
          <div className="font-extrabold text-slate-900 text-xl tracking-tight">BOZA</div>
          <div className="text-[11px] text-slate-400">Votre passeport pour le monde</div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-slate-900">Créer un compte</h1>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Commence tes démarches en quelques minutes.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Nom complet
              </label>
              <input
                type="text"
                required
                placeholder="Ton nom et prénom"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="6 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Retape ton mot de passe"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <p className="text-[13px] text-red-500 bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-500 mt-5">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
