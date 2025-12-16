// src/api/http.ts
let ACCESS_TOKEN: string | null = null; // stocké en mémoire (sécurité)

export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

// Base URL de ton backend
// tu peux quand même définir VITE_API_URL, sinon ça prend localhost:3000 par défaut
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type Options = RequestInit & { auth?: boolean };

async function refreshAccessToken(): Promise<boolean> {
  // appelle /auth/refresh sur ton backend pour obtenir un nouveau accessToken
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // pour envoyer le cookie refresh HttpOnly
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { accessToken?: string };
  if (!data.accessToken) return false;

  setAccessToken(data.accessToken);
  return true;
}

async function parse(res: Response) {
  if (res.status === 204) return null;
  const ct = res.headers.get("Content-Type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

async function toError(res: Response) {
  const body = (await parse(res)) as any;
  const message = (body && (body.message || body.error)) || res.statusText;
  return Object.assign(new Error(message), { status: res.status, body });
}

export async function http(path: string, options: Options = {}) {
  const headers = new Headers(options.headers ?? {});
  if (options.auth && ACCESS_TOKEN) {
    headers.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${BASE_URL}${path}`;
  console.log("HTTP →", url); // pour vérifier que ça appelle bien http://localhost:3000/auth/register

  const exec = async () => {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // cookies (refresh, session...)
    });

    if (!res.ok) {
      // Tentative de refresh si 401 sur une route protégée
      if (res.status === 401 && options.auth) {
        const ok = await refreshAccessToken();
        if (ok) {
          const h2 = new Headers(headers);
          if (ACCESS_TOKEN) h2.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
          const res2 = await fetch(url, {
            ...options,
            headers: h2,
            credentials: "include",
          });
          if (!res2.ok) throw await toError(res2);
          return parse(res2);
        }
      }
      throw await toError(res);
    }

    return parse(res);
  };

  return exec();
}
