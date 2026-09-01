"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const goSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2 border border-slate-200">
        <Search className="w-4 h-4 text-slate-400" strokeWidth={2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goSearch()}
          placeholder="Rechercher un pays, un visa ou un programme..."
          className="flex-1 text-[13px] text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
        />
        <button onClick={goSearch}>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
