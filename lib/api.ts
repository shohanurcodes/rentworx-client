import { refreshAccessToken } from "@/lib/auth-client";
import { clearAccessToken, getAccessToken } from "@/lib/token";
import type { ApiMeta } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

function isTokenExpired(token: string) {
  const payload = token.split(".")[1];

  if (!payload) return false;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as { exp?: number };

    return (
      typeof decoded.exp === "number" &&
      decoded.exp * 1000 <= Date.now() + 30_000
    );
  } catch {
    return false;
  }
}

async function ensureAccessToken() {
  const current = getAccessToken();

  if (current && !isTokenExpired(current)) {
    return current;
  }

  if (current) {
    clearAccessToken();
  }

  try {
    return await refreshAccessToken();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
  attempt = 1,
): Promise<ApiEnvelope<T>> {
  const { auth = true, headers, body, ...rest } = options;

  const finalHeaders = new Headers(headers);

  if (body && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await ensureAccessToken();

    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body,
      credentials: "omit",
    });
  } catch {
    throw new ApiRequestError(
      "Cannot reach the server. Please try again shortly.",
      0,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { success?: false; message?: string; errors?: unknown }
    | null;

  if (!payload) {
    throw new ApiRequestError(
      response.ok ? "Invalid server response" : "Request failed",
      response.status,
    );
  }

  if (!response.ok || payload.success === false) {
    if (response.status === 401 && auth && attempt === 1) {
      clearAccessToken();

      try {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          finalHeaders.set("Authorization", `Bearer ${refreshed}`);
          return apiFetch<T>(path, options, attempt + 1);
        }
      } catch {
        // Fall through to the original error below.
      }
    }

    if (response.status === 401) {
      clearAccessToken();
    }

    throw new ApiRequestError(
      payload.message ?? "Request failed",
      response.status,
      "errors" in payload ? payload.errors : undefined,
    );
  }

  return payload as ApiEnvelope<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
