import { supabase } from "./supabase";

export async function loadInterestCatalogMap() {
  if (!supabase) {
    return new Map<string, string>();
  }

  const { data, error } = await supabase
    .from("interest_catalog")
    .select("name, photo_url");

  if (error || !data) {
    return new Map<string, string>();
  }

  return new Map(
    data
      .filter(
        (item): item is { name: string; photo_url: string } =>
          typeof item?.name === "string" && typeof item?.photo_url === "string",
      )
      .map((item) => [item.name.trim().toLowerCase(), item.photo_url]),
  );
}
