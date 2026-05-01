type ApiFetchOptions = Omit<RequestInit, "body"> & {
  readonly body?: unknown;
  readonly query?: Record<string, string | number | undefined>;
};

const DEFAULT_API_BASE_URL = "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export class ApiNetworkError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
  }
}

export function isApiNetworkError(error: unknown): error is ApiNetworkError {
  return error instanceof ApiNetworkError;
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

function buildUrl(path: string, query?: ApiFetchOptions["query"]) {
  const url = new URL(`${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, query, ...init } = options;
  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    });
  } catch (error) {
    throw new ApiNetworkError("Backend API is unavailable", error);
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : Array.isArray(payload?.message)
          ? payload.message.join("; ")
          : `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}
