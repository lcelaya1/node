import { supabase } from "./supabase";

export type PlanMemoryImage = {
  createdAt: string;
  id: string;
  note?: string;
  name: string;
  planId: string;
  url: string;
};

type SavePlanMemoriesInput = {
  images: PlanMemoryImage[];
  note?: string;
  planId: string;
  /**
   * `false` (default): replaces all memories for this plan — post-plan flow uploads a fresh set.
   * `true`: appends new photos — “Add memory” from Diary without wiping existing shots.
   */
  mergeWithExisting?: boolean;
};

const PLAN_MEMORIES_BUCKET = "plan-memories";

/** Fila mínima de `plan_memories` (extras opcionales para migraciones incompletas). */
type PlanMemoryDbRow = {
  id: string;
  created_at: string;
  file_name?: string | null;
  memory_note?: string | null;
  plan_id: string;
  public_url: string;
  sort_order?: number;
};

function isAuthLockAcquireTimeout(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAcquireTimeout" in error &&
    (error as { isAcquireTimeout?: boolean }).isAcquireTimeout === true
  );
}

async function getCurrentUserId() {
  if (!supabase) return null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return null;
      return user.id;
    } catch (error) {
      if (!isAuthLockAcquireTimeout(error) || attempt === 2) {
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 80 * (attempt + 1)));
    }
  }

  return null;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  const [, contentType, base64] = match;
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return {
    blob: new Blob([bytes], { type: contentType }),
    contentType,
  };
}

function extensionFromContentType(contentType: string) {
  const subtype = contentType.split("/")[1] ?? "jpg";
  return subtype.replace("jpeg", "jpg");
}

/** Clave segura para Storage: el `image.id` suele incluir el nombre del fichero con `()` o tildes y provoca "Invalid key". */
function newStorageObjectName(extension: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${crypto.randomUUID()}.${extension}`;
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}.${extension}`;
}

export type SavePlanMemoriesResult = {
  error: string | null;
  /** Inserted rows (empty when nothing was saved). */
  rows: Array<Record<string, unknown>>;
};

export async function savePlanMemories({
  images,
  note,
  planId,
  mergeWithExisting = false,
}: SavePlanMemoriesInput): Promise<SavePlanMemoriesResult> {
  const userId = await getCurrentUserId();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured (check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)." };
  }

  if (!userId) {
    return {
      rows: [],
      error: "You must be signed in to save memories.",
    };
  }

  if (images.length === 0) {
    return { rows: [], error: null };
  }

  let sortOrderBase = 0;

  if (mergeWithExisting) {
    const { data: lastRow } = await supabase
      .from("plan_memories")
      .select("sort_order")
      .eq("user_id", userId)
      .eq("plan_id", planId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    sortOrderBase =
      typeof lastRow?.sort_order === "number" ? lastRow.sort_order + 1 : 0;
  }

  let firstUploadError: string | null = null;

  const uploadedRows = await Promise.all(
    images.map(async (image, index) => {
      const parsed = parseDataUrl(image.url);
      if (!parsed) return null;

      const extension = extensionFromContentType(parsed.contentType);
      const storagePath = `${userId}/${planId}/${newStorageObjectName(extension)}`;

      const { error: uploadError } = await supabase.storage
        .from(PLAN_MEMORIES_BUCKET)
        .upload(storagePath, parsed.blob, {
          contentType: parsed.contentType,
          upsert: true,
        });

      if (uploadError) {
        if (!firstUploadError) {
          const hint = /invalid\s*key/i.test(uploadError.message)
            ? " Los nombres de objeto no pueden llevar ciertos caracteres en la clave (p. ej. paréntesis en el nombre del archivo)."
            : ' Revisa políticas del bucket "plan-memories" (la ruta debe empezar por tu user id).';
          firstUploadError = `${uploadError.message}${hint}`;
        }
        return null;
      }

      const { data } = supabase.storage
        .from(PLAN_MEMORIES_BUCKET)
        .getPublicUrl(storagePath);

      return {
        file_name: image.name,
        memory_note: note?.trim() || null,
        plan_id: planId,
        public_url: data.publicUrl,
        sort_order: sortOrderBase + index,
        storage_path: storagePath,
        user_id: userId,
      };
    }),
  );

  const rows = uploadedRows.filter(
    (row): row is NonNullable<(typeof uploadedRows)[number]> => row !== null,
  );

  if (rows.length === 0) {
    return {
      rows: [],
      error:
        firstUploadError ??
        "Upload failed for all images. Run supabase/plan_memories_schema.sql (bucket + RLS).",
    };
  }

  if (!mergeWithExisting) {
    await supabase.from("plan_memories").delete().eq("user_id", userId).eq("plan_id", planId);
  }

  const { data, error } = await supabase
    .from("plan_memories")
    .insert(rows)
    .select("id, file_name, memory_note, plan_id, public_url, sort_order, storage_path");

  if (error) {
    return {
      rows: [],
      error: `${error.message} (Ensure table public.plan_memories exists and RLS policy allows insert.)`,
    };
  }

  if (!data?.length) {
    return {
      rows: [],
      error: "Insert returned no rows. Check RLS SELECT after insert.",
    };
  }

  return { rows: data as Array<Record<string, unknown>>, error: null };
}

export async function loadPlanMemories(): Promise<PlanMemoryImage[]> {
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return [];

  // Una sola clave `order=` en PostgREST: varias `.order()` encadenadas a veces devuelven 400.
  // Segundo criterio (sort_order) se aplica en cliente.
  const { data, error } = await supabase
    .from("plan_memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];

  const rows = [...data] as PlanMemoryDbRow[];
  rows.sort((a, b) => {
    const byTime =
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (byTime !== 0) return byTime;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return rows.map((row) => ({
    createdAt: row.created_at,
    id: row.id,
    note: typeof row.memory_note === "string" ? row.memory_note : "",
    name: row.file_name ?? "Plan memory",
    planId: row.plan_id,
    url: row.public_url,
  }));
}

export async function deletePlanMemory(memoryId: string): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!supabase) {
    return { error: "Supabase is not configured (check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)." };
  }
  if (!userId) {
    return { error: "You must be signed in to delete memories." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("plan_memories")
    .select("storage_path")
    .eq("id", memoryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }
  if (!row) {
    return { error: "Memory not found." };
  }

  const path = typeof row.storage_path === "string" ? row.storage_path : null;
  if (path) {
    const { error: storageError } = await supabase.storage.from(PLAN_MEMORIES_BUCKET).remove([path]);
    if (storageError && !storageError.message.toLowerCase().includes("not found")) {
      return { error: storageError.message };
    }
  }

  const { error: deleteError } = await supabase
    .from("plan_memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", userId);

  return { error: deleteError?.message ?? null };
}

/** Unifica la descripción (`memory_note`) en todas las filas de un plan para el usuario actual. */
export async function updatePlanMemoryNotesForPlan(
  planId: string,
  note: string | null,
): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!supabase) {
    return { error: "Supabase is not configured (check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)." };
  }
  if (!userId) {
    return { error: "You must be signed in to update memories." };
  }

  const trimmed = typeof note === "string" ? note.trim() : "";
  const payload = trimmed.length > 0 ? trimmed : null;

  const { error } = await supabase
    .from("plan_memories")
    .update({ memory_note: payload })
    .eq("user_id", userId)
    .eq("plan_id", planId);

  return { error: error?.message ?? null };
}
