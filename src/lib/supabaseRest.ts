const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

export const supabaseConfig = {
  url: supabaseUrl,
  hasKey: Boolean(supabaseKey),
  isConfigured: Boolean(supabaseUrl && supabaseKey),
};

type RequestOptions = {
  signal?: AbortSignal;
};

export async function fetchFromSupabase<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!supabaseConfig.isConfigured || !supabaseUrl || !supabaseKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    signal: options.signal,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request gagal: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function writeToSupabase<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  session: SupabaseSession,
  body?: unknown
): Promise<T> {
  if (!supabaseConfig.isConfigured || !supabaseUrl || !supabaseKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase write gagal: ${response.status}`);
  }

  if (method === "DELETE") return null as T;
  return response.json() as Promise<T>;
}

export async function fetchFromSupabaseAsUser<T>(
  path: string,
  session: SupabaseSession,
  options: RequestOptions = {}
): Promise<T> {
  if (!supabaseConfig.isConfigured || !supabaseUrl || !supabaseKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    signal: options.signal,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request gagal: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type SupabaseSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  email?: string;
};

export function readSessionFromHash(): SupabaseSession | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const errorDescription = hash.get("error_description") || hash.get("error");
  if (errorDescription) {
    window.history.replaceState({}, "", window.location.pathname);
    throw new Error(errorDescription);
  }
  const accessToken = hash.get("access_token");
  if (!accessToken) return null;

  const session = {
    accessToken,
    refreshToken: hash.get("refresh_token") || undefined,
    expiresAt: Number(hash.get("expires_at")) || undefined,
  };

  window.history.replaceState({}, "", window.location.pathname);
  saveSession(session);
  return session;
}

export function getSavedSession(): SupabaseSession | null {
  const raw = localStorage.getItem("clc-supabase-session");
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as SupabaseSession;
    if (session.expiresAt && session.expiresAt * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: SupabaseSession) {
  localStorage.setItem("clc-supabase-session", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("clc-supabase-session");
}

function parseSupabaseAuthError(detail: string, fallback: string) {
  if (!detail) return fallback;
  try {
    const parsed = JSON.parse(detail) as { error_code?: string; msg?: string; error_description?: string };
    if (parsed.error_code === "invalid_credentials") {
      return "Email atau password salah, akun belum terdaftar, atau email belum dikonfirmasi.";
    }
    return parsed.msg || parsed.error_description || fallback;
  } catch {
    return detail || fallback;
  }
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  if (!supabaseConfig.isConfigured || !supabaseUrl || !supabaseKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(parseSupabaseAuthError(detail, "Email atau password Supabase tidak valid."));
  }

  const data = await response.json();
  const session: SupabaseSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    email: data.user?.email,
  };
  saveSession(session);
  return session;
}

export async function signUpWithPassword(email: string, password: string): Promise<{ needsConfirmation: boolean }> {
  if (!supabaseConfig.isConfigured || !supabaseUrl || !supabaseKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        display_name: email.split("@")[0],
      },
      gotrue_meta_security: {},
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(parseSupabaseAuthError(detail, "Pendaftaran gagal. Pastikan email valid dan password memenuhi aturan Supabase."));
  }

  const data = await response.json();
  if (data.access_token) {
    const session: SupabaseSession = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      email: data.user?.email,
    };
    saveSession(session);
    return { needsConfirmation: false };
  }

  return { needsConfirmation: true };
}

export async function fetchProfile(session: SupabaseSession) {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase belum dikonfigurasi.");

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,display_name,role&limit=1`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Profil admin tidak bisa dibaca.");
  const rows = (await response.json()) as Array<{ id: string; display_name: string; role: string }>;
  return rows[0] || null;
}

export async function uploadToStorage(session: SupabaseSession, bucket: string, path: string, file: File) {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase belum dikonfigurasi.");

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!response.ok) throw new Error("Upload gambar gagal.");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
