import { createClient } from "@/lib/supabase/server";
import { SearchResults } from "@/components/search-results";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const supabase = await createClient();

  let countries: { id: string; name: string; flag_url: string | null }[] = [];
  let visas: { id: string; name: string; type: string }[] = [];
  let programs: { id: string; name: string; level: string | null }[] = [];
  let universities: { id: string; name: string; city: string | null }[] = [];

  if (query.length > 0) {
    const [c, v, p, u] = await Promise.all([
      supabase.from("countries").select("id, name, flag_url").ilike("name", `%${query}%`).limit(10),
      supabase.from("visas").select("id, name, type").ilike("name", `%${query}%`).limit(10),
      supabase.from("programs").select("id, name, level").ilike("name", `%${query}%`).limit(10),
      supabase.from("universities").select("id, name, city").ilike("name", `%${query}%`).limit(10),
    ]);
    countries = c.data ?? [];
    visas = v.data ?? [];
    programs = p.data ?? [];
    universities = u.data ?? [];
  }

  return (
    <SearchResults
      query={query}
      countries={countries}
      visas={visas}
      programs={programs}
      universities={universities}
    />
  );
}
