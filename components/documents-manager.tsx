"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FileItem = {
  name: string;
  id: string;
  updated_at: string | null;
  metadata: { size?: number } | null;
};

export function DocumentsManager({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("documents")
      .list(userId, { sortBy: { column: "updated_at", order: "desc" } });
    if (error) {
      setError("Impossible de charger tes documents.");
    } else {
      setFiles((data ?? []) as FileItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (error) {
      setError("L'envoi a échoué. Réessaie.");
    } else {
      await loadFiles();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (name: string) => {
    const path = `${userId}/${name}`;
    const { error } = await supabase.storage.from("documents").remove([path]);
    if (error) {
      setError("La suppression a échoué.");
    } else {
      setFiles((prev) => prev.filter((f) => f.name !== name));
    }
  };

  const handleDownload = async (name: string) => {
    const path = `${userId}/${name}`;
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(path, 60);
    if (!error && data) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const displayName = (name: string) => name.replace(/^\d+_/, "");

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Mes documents</h1>
        </div>

        {/* Upload button */}
        <div className="px-5 mb-5">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Ajouter un document
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            PDF, image ou Word — envoyé de façon sécurisée
          </p>
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Files list */}
        <div className="px-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              Aucun document pour l&apos;instant.
              <br />
              Ajoute ton premier fichier ci-dessus.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {files.map((file) => (
                <div
                  key={file.id ?? file.name}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">
                      {displayName(file.name)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatSize(file.metadata?.size)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="p-2 text-slate-400"
                    aria-label="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="p-2 text-red-400"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
