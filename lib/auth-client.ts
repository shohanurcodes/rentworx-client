"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

import { setAccessToken } from "@/lib/token";

const clientUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: clientUrl,
  plugins: [jwtClient()],
});

type TokenResponse =
  | {
      data?: { token?: string } | string;
      token?: string;
      error?: { status?: number; message?: string };
    }
  | null
  | undefined;

/** Returns the BetterAuth JWT, supporting both client method names and shapes. */
export async function getJwtToken(): Promise<string> {
  const client = authClient as unknown as {
    getToken?: () => Promise<TokenResponse>;
    token?: () => Promise<TokenResponse>;
  };

  const methods = [client.token, client.getToken].filter(
    (method): method is () => Promise<TokenResponse> => typeof method === "function",
  );

  let lastResponse: TokenResponse = undefined;

  for (const method of methods) {
    const response = await method.call(client);
    lastResponse = response;
    const data = response?.data;

    const token =
      typeof data === "string"
        ? data
        : data?.token ?? response?.token;

    if (token) return token;
  }

  const error = lastResponse?.error;

  if (error?.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (error?.status === 429) {
    throw new Error("Too many requests. Please try again shortly.");
  }

  throw new Error(error?.message ?? "Unable to retrieve an access token");
}

/** Refreshes and stores the JWT before authenticated dashboard requests. */
export async function refreshAccessToken(): Promise<string> {
  const token = await getJwtToken();
  setAccessToken(token);
  return token;
}
