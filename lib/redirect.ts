/**
 * Only allow internal, single-slash paths in `?next=` style redirects.
 * Blocks protocol-relative URLs (//evil.com), backslash tricks, control
 * characters, and redirects back into auth/API routes that could loop.
 */
const BLOCKED_PREFIXES = ["/login", "/register", "/api/"];

export function safeNextPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;

  const pathname = value.split(/[?#]/)[0] ?? "";

  if (pathname.startsWith("/api/")) return fallback;
  if (BLOCKED_PREFIXES.some((prefix) => isSameOrChild(pathname, prefix))) {
    return fallback;
  }

  return value;
}

function isSameOrChild(pathname: string, prefix: string) {
  return (
    pathname === prefix ||
    (prefix.endsWith("/")
      ? pathname.startsWith(prefix)
      : pathname.startsWith(`${prefix}/`))
  );
}
