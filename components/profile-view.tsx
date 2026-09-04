"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Flag,
  LogOut,
  Loader2,
  Pencil,
  Camera,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cfaCountries } from "@/lib/cfa-countries";

export function ProfileView({
  userId,
  fullName,
  email,
  phone,
  nationality,
  avatarUrl,
}: {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  avatarUrl: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [nameValue, setNameValue] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [nationalityValue, setNationalityValue] = useState(nationality);
  const [avatar, setAvatar] = useState(avatarUrl);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("L'envoi de la photo a échoué.");
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (!updateError) {
      setAvatar(publicUrl);
    } else {
      setError("Impossible d'enregistrer la photo.");
    }
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: nameValue.trim(),
        phone: phoneValue.trim() || null,
        nationality: nationalityValue.trim() || null,
      })
      .eq("id", userId);

    if (updateError) {
      setError("La sauvegarde a échoué. Réessaie.");
    } else {
      setSuccess(true);
      setEditing(false);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Mon profil</h1>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-blue-600 text-[13px] font-semibold"
            >
              <Pencil className="w-3.5 h-3.5" /> Modifier
            </button>
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (nameValue || email || "?").charAt(0).toUpperCase()
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-blue-600" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          {!editing && (
            <div className="mt-3 font-bold text-slate-900 text-base">
              {nameValue || "Bienvenue"}
            </div>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-5 mb-4 bg-emerald-50 text-emerald-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <Check className="w-4 h-4" /> Profil mis à jour.
          </div>
        )}

        {editing ? (
          /* Formulaire d'édition */
          <div className="px-5">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
              <div>
                <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                  Nationalité
                </label>
                <select
                  value={nationalityValue}
                  onChange={(e) => setNationalityValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Sélectionne ton pays</option>
                  {cfaCountries.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => {
                    setEditing(false);
                    setNameValue(fullName);
                    setPhoneValue(phone);
                    setNationalityValue(nationality);
                  }}
                  className="flex-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl py-3"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white text-sm font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Vue lecture seule */
          <div className="px-5">
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-400">Email</div>
                  <div className="text-[13.5px] font-medium text-slate-900 truncate">
                    {email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-400">Téléphone</div>
                  <div className="text-[13.5px] font-medium text-slate-900 truncate">
                    {phoneValue || "Non renseigné"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-400">Nationalité</div>
                  <div className="text-[13.5px] font-medium text-slate-900 truncate">
                    {nationalityValue || "Non renseignée"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        {!editing && (
          <div className="px-5 mt-6">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full bg-white border border-red-200 text-red-500 text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
