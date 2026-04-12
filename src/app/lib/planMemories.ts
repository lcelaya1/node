import { supabase } from "./supabase";

export type PlanMemoryImage = {
  createdAt: string;
  id: string;
  name: string;
  planId: string;
  url: string;
};

type SavePlanMemoriesInput = {
  images: PlanMemoryImage[];
  planId: string;
};

const PLAN_MEMORIES_BUCKET = "plan-memories";

async function getCurrentUserId() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
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

export async function savePlanMemories({
  images,
  planId,
}: SavePlanMemoriesInput) {
  const userId = await getCurrentUserId();
  if (!supabase || !userId || images.length === 0) return [];

  const uploadedRows = await Promise.all(
    images.map(async (image, index) => {
      const parsed = parseDataUrl(image.url);
      if (!parsed) return null;

      const extension = extensionFromContentType(parsed.contentType);
      const storagePath = `${userId}/${planId}/${image.id}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(PLAN_MEMORIES_BUCKET)
        .upload(storagePath, parsed.blob, {
          contentType: parsed.contentType,
          upsert: true,
        });

      if (uploadError) return null;

      const { data } = supabase.storage
        .from(PLAN_MEMORIES_BUCKET)
        .getPublicUrl(storagePath);

      return {
        file_name: image.name,
        plan_id: planId,
        public_url: data.publicUrl,
        sort_order: index,
        storage_path: storagePath,
        user_id: userId,
      };
    }),
  );

  const rows = uploadedRows.filter(
    (row): row is NonNullable<(typeof uploadedRows)[number]> => row !== null,
  );

  if (rows.length === 0) return [];

  await supabase.from("plan_memories").delete().eq("user_id", userId).eq("plan_id", planId);

  const { data, error } = await supabase
    .from("plan_memories")
    .insert(rows)
    .select("id, file_name, plan_id, public_url, sort_order, storage_path");

  if (error || !data) return [];
  return data;
}

export async function loadPlanMemories(): Promise<PlanMemoryImage[]> {
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("plan_memories")
    .select("id, file_name, public_url, plan_id, created_at, sort_order")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    createdAt: row.created_at,
    id: row.id,
    name: row.file_name ?? "Plan memory",
    planId: row.plan_id,
    url: row.public_url,
  }));
}
