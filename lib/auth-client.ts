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

type TokenResponse = { data?: { token?: string } } | null | undefined;

/** Works with both getToken() and token() across BetterAuth client versions. */
export async function getJwtToken(): Promise<string> {
  const client = authClient as unknown as {
    getToken?: () => Promise<TokenResponse>;
    token?: () => Promise<TokenResponse>;
  };

  const response = client.getToken
    ? await client.getToken()
    : await client.token?.();

  const token = response?.data?.token;

  if (!token) {
    throw new Error("Unable to retrieve an access token");
  }

  return token;
}

/** Refreshes and stores the JWT before authenticated dashboard requests. */
export async function refreshAccessToken(): Promise<string> {
  const token = await getJwtToken();
  setAccessToken(token);
  return token;
}
