"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
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

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone.trim(),
          },
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

  const inputClass =
    "w-full bg-[#0A0A12] border border-[#2E2E3D] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
  const labelClass = "text-[13px] font-medium text-slate-200 mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#0A0A12] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between max-w-sm w-full mx-auto">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Boza" className="w-10 h-10 rounded-xl object-cover" />
        </Link>
        <Link href="/auth/login" className="text-[13px] font-semibold text-violet-400">
          J&apos;ai déjà un compte
        </Link>
      </div>

      <div className="px-6 pt-2 pb-10">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-[#15151F] rounded-3xl shadow-none p-6">
          <h1 className="text-xl font-bold text-white">Créer un compte</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Commence tes démarches en quelques minutes.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input
                  type="text"
                  required
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Téléphone <span className="text-slate-500 font-normal">(facultatif)</span>
              </label>
              <input
                type="tel"
                placeholder="+237 6XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="6 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
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
              <label className={labelClass}>Confirmer le mot de passe</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Retape ton mot de passe"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className={inputClass}
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
              className="w-full bg-violet-600 text-white text-sm font-semibold rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
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
            <Link href="/auth/login" className="text-violet-400 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
