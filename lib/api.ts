export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Options {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
}

// Browser requests go to this website's own /api path. Next.js passes them to Express, so the
// HTTP-only JWT cookie is sent along automatically.
export async function api<T>(path: string, { method = "GET", body, signal }: Options = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const send = () =>
    fetch(path, {
      method,
      signal,
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      cache: "no-store",
    });

  let res: Response;
  try {
    res = await send();
    // The JWT can be missing or expired while the Better Auth login is still valid: renew it once
    if (res.status === 401 && (await refreshToken())) res = await send();
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("Could not reach the server. Please check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message ?? `Request failed (${res.status}). Please try again.`, res.status);
  }
  return data as T;
}

let refreshing: Promise<boolean> | null = null;

// Several requests can fail at once on page load, so they share one refresh
export function refreshToken() {
  refreshing ??= fetch("/api/session-token", { method: "POST", cache: "no-store" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      setTimeout(() => (refreshing = null), 0);
    });
  return refreshing;
}

export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again.") {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new ApiError("Please choose an image file.", 400);
  if (file.size > 4 * 1024 * 1024) throw new ApiError("Image must be 4 MB or smaller.", 400);
  const form = new FormData();
  form.append("image", file);
  const { url } = await api<{ url: string }>("/api/upload", { method: "POST", body: form });
  return url;
}
