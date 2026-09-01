import { useEffect, useState } from "react";
import { properties as fallbackProperties, type Property } from "./properties";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export interface PropertyInput {
  id: string;
  title: string;
  type: Property["type"];
  operation: Property["operation"];
  price: string;
  location: string;
  image: string;
  surface: string;
  rooms: string;
  baths: string;
  extras: string[];
  tag: string;
  description: string;
  featured: boolean;
  published: boolean;
}

type PropertyRow = Omit<PropertyInput, "image"> & { image_url: string };
type PublicProperty = Property & { featured: boolean; published: boolean };

let publicPropertiesCache: PublicProperty[] | null = null;
let publicPropertiesCachedAt = 0;
const PUBLIC_CACHE_MS = 60_000;

const clearPublicPropertiesCache = () => {
  publicPropertiesCache = null;
  publicPropertiesCachedAt = 0;
};

const fromRow = (row: PropertyRow): Property & { featured: boolean; published: boolean } => ({
  id: row.id,
  title: row.title,
  type: row.type,
  operation: row.operation,
  price: row.price,
  location: row.location,
  image: row.image_url,
  ...(row.surface ? { surface: row.surface } : {}),
  ...(row.rooms ? { rooms: row.rooms } : {}),
  ...(row.baths ? { baths: row.baths } : {}),
  extras: row.extras ?? [],
  tag: row.tag,
  description: row.description,
  featured: row.featured,
  published: row.published,
});

export async function fetchProperties(includeUnpublished = false) {
  if (!isSupabaseConfigured) {
    return fallbackProperties.map((property) => ({ ...property, featured: true, published: true }));
  }

  if (includeUnpublished) {
    const { supabase } = await import("./supabase");
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as PropertyRow[]).map(fromRow);
  }

  if (publicPropertiesCache && Date.now() - publicPropertiesCachedAt < PUBLIC_CACHE_MS) {
    return publicPropertiesCache;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/properties?select=*&published=eq.true&order=created_at.desc`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    },
  );
  if (!response.ok) throw new Error("No se pudo consultar el catálogo.");
  const remoteProperties = ((await response.json()) as PropertyRow[]).map(fromRow);
  if (remoteProperties.length === 0) {
    return fallbackProperties.map((property) => ({ ...property, featured: true, published: true }));
  }
  publicPropertiesCache = remoteProperties;
  publicPropertiesCachedAt = Date.now();
  return remoteProperties;
}

export function useProperties(includeUnpublished = false) {
  const [properties, setProperties] = useState(() =>
    isSupabaseConfigured
      ? []
      : fallbackProperties.map((property) => ({ ...property, featured: true, published: true })),
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setProperties(await fetchProperties(includeUnpublished));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, [includeUnpublished]);

  return { properties, loading, error, reload };
}

export async function saveProperty(input: PropertyInput, originalId?: string) {
  const { supabase } = await import("./supabase");
  if (!supabase) throw new Error("Supabase todavía no está configurado.");
  const row: PropertyRow = {
    id: input.id,
    title: input.title,
    type: input.type,
    operation: input.operation,
    price: input.price,
    location: input.location,
    image_url: input.image,
    surface: input.surface,
    rooms: input.rooms,
    baths: input.baths,
    extras: input.extras,
    tag: input.tag,
    description: input.description,
    featured: input.featured,
    published: input.published,
  };

  const query = originalId
    ? supabase.from("properties").update(row).eq("id", originalId)
    : supabase.from("properties").insert(row);
  const { error } = await query;
  if (error) throw error;
  clearPublicPropertiesCache();
}

export async function deleteProperty(id: string) {
  const { supabase } = await import("./supabase");
  if (!supabase) throw new Error("Supabase todavía no está configurado.");
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
  clearPublicPropertiesCache();
}

export async function importFallbackProperties() {
  const { supabase } = await import("./supabase");
  if (!supabase) throw new Error("Supabase todavía no está configurado.");
  const rows: PropertyRow[] = fallbackProperties.map((property, index) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    operation: property.operation,
    price: property.price,
    location: property.location,
    image_url: new URL(property.image, window.location.href).href,
    surface: property.surface ?? "",
    rooms: property.rooms ?? "",
    baths: property.baths ?? "",
    extras: property.extras,
    tag: property.tag,
    description: property.description,
    featured: index < 3,
    published: true,
  }));
  const { error } = await supabase.from("properties").upsert(rows);
  if (error) throw error;
  clearPublicPropertiesCache();
}

export async function uploadPropertyImage(file: File) {
  const { supabase } = await import("./supabase");
  if (!supabase) throw new Error("Supabase todavía no está configurado.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("property-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
}
