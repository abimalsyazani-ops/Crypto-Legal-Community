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
