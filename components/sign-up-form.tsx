"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cfaCountries } from "@/lib/cfa-countries";

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
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
            nationality: nationality.trim(),
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
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const labelClass = "text-[13px] font-medium text-slate-700 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-10">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Boza" className="w-14 h-14 rounded-2xl mb-2 object-cover" />
          <div className="font-extrabold text-slate-900 text-xl tracking-tight">BOZA</div>
          <div className="text-[11px] text-slate-400">Votre passeport pour le monde</div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-slate-900">Créer un compte</h1>
          <p className="text-sm text-slate-400 mt-1 mb-6">
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
              <label className={labelClass}>Nationalité</label>
              <select
                required
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionne ton pays</option>
                {cfaCountries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Téléphone <span className="text-slate-400 font-normal">(facultatif)</span>
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
