const recoverableAuthSessionMarkers = [
  "jwedecryptionfailed",
  "jweinvalid",
  "decryption operation failed",
  "invalid compact jwe",
];

function collectErrorStrings(value: unknown, seen = new Set<unknown>()): string[] {
  if (value == null) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value !== "object") {
    return [];
  }

  if (seen.has(value)) {
    return [];
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectErrorStrings(item, seen));
  }

  if (value instanceof Error) {
    return [
      value.name,
      value.message,
      ...collectErrorStrings(value.cause, seen),
    ].filter(Boolean);
  }

  return Object.values(value).flatMap((item) => collectErrorStrings(item, seen));
}

export function isRecoverableAuthSessionError(error: unknown) {
  const normalizedValues = collectErrorStrings(error).map((value) => value.toLowerCase());

  return normalizedValues.some((value) =>
    recoverableAuthSessionMarkers.some((marker) => value.includes(marker)),
  );
}

export async function resolveSessionSafely<T>(
  loadSession: () => Promise<T | null>,
): Promise<T | null> {
  try {
    return await loadSession();
  } catch (error) {
    if (isRecoverableAuthSessionError(error)) {
      return null;
    }

    throw error;
  }
}

export function shouldIgnoreAuthLoggerError(code: string, metadata: unknown) {
  return code === "JWT_SESSION_ERROR" && isRecoverableAuthSessionError(metadata);
}
