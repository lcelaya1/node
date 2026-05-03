import type { SupabaseClient } from "@supabase/supabase-js";

export const AVATARS_BUCKET = "avatars";

const MAX_EDGE_PX = 2048;

/** Ruta en Storage: coincide con la migración (`{user-uuid}.jpg`). */
export function avatarObjectPath(userId: string) {
  return `${userId}.jpg`;
}

/** Variante común para policies con `storage.foldername(name)[1] = auth.uid()`. */
function avatarObjectPathInUserFolder(userId: string) {
  return `${userId}/avatar.jpg`;
}

/** URL usable en `<img src>` (HTTPS Storage u origen relativo para demos). No admite `data:` para evitar payloads enormes en BD. */
export function isProfileAvatarDisplayUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  );
}

export function dataUrlToBlob(dataUrl: string): Blob | null {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  const [, mime, base64] = match;
  try {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime || "image/jpeg" });
  } catch {
    return null;
  }
}

/** Convierte cualquier imagen soportada por `createImageBitmap` a JPEG para `{userId}.jpg`. */
export async function normalizeImageBlobToJpeg(blob: Blob, quality = 0.88): Promise<Blob> {
  if (blob.type === "image/jpeg") {
    return resizeBlobIfNeeded(blob, quality);
  }

  const bitmap = await createImageBitmap(blob);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    if (width > MAX_EDGE_PX || height > MAX_EDGE_PX) {
      const scale = MAX_EDGE_PX / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("JPEG encoding failed."))),
        "image/jpeg",
        quality,
      );
    });
    return jpegBlob;
  } finally {
    bitmap.close();
  }
}

async function resizeBlobIfNeeded(jpegBlob: Blob, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(jpegBlob);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    if (width <= MAX_EDGE_PX && height <= MAX_EDGE_PX) {
      return jpegBlob;
    }

    const scale = MAX_EDGE_PX / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");
    ctx.drawImage(bitmap, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("JPEG resize failed."))),
        "image/jpeg",
        quality,
      );
    });
  } finally {
    bitmap.close();
  }
}

export async function uploadProfileAvatarToStorage(
  supabase: SupabaseClient,
  userId: string,
  imageBlob: Blob,
): Promise<{ publicUrl: string } | { error: string }> {
  let jpegBlob: Blob;
  try {
    jpegBlob = await normalizeImageBlobToJpeg(imageBlob);
  } catch {
    return { error: "Could not process that image. Try JPG or PNG." };
  }

  const candidatePaths = [avatarObjectPathInUserFolder(userId), avatarObjectPath(userId)];
  let lastError: string | null = null;

  for (const path of candidatePaths) {
    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(path, jpegBlob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
      return { publicUrl: data.publicUrl };
    }

    lastError = uploadError.message;
    const isRlsIssue = /row-level security policy/i.test(uploadError.message);
    if (!isRlsIssue) break;
  }

  return { error: `${lastError ?? "Upload failed"} (bucket "${AVATARS_BUCKET}")` };
}
