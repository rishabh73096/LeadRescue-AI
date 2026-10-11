import axios, { isAxiosError, type AxiosRequestConfig } from "axios";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
export const API_KEY = process.env.NEXT_PUBLIC_APP_KEY || "";
export const TOKEN_KEY = "token";
export const AUTH_EVENT = "auth:changed";

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  data?: unknown;

  constructor(message: string, status = 0, fields?: Record<string, string>, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
    this.data = data;
  }
}

const hasWindow = () => typeof window !== "undefined";

export const tokenStore = {
  get(): string {
    if (!hasWindow()) return "";
    try {
      return window.localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  },
  set(token: string) {
    if (!hasWindow()) return;
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch { }
    window.dispatchEvent(new Event(AUTH_EVENT));
  },
  clear() {
    if (!hasWindow()) return;
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch { }
    window.dispatchEvent(new Event(AUTH_EVENT));
  },
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid. Please check your details.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our side. Please try again.",
};

function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) return new ApiError(error instanceof Error ? error.message : "Something went wrong");
  if (!error.response && error.code === "ECONNABORTED") return new ApiError("The server took too long to respond. Please try again.");
  if (!error.response) return new ApiError("Cannot reach the server. Check your connection and try again.");

  const { status, data } = error.response;
  const body = (data ?? {}) as Record<string, unknown>;
  const list = Array.isArray(body.errors) ? (body.errors as Array<Record<string, unknown>>) : [];
  const fields: Record<string, string> = {};
  list.forEach((item) => {
    const key = String(item.path ?? item.param ?? item.field ?? "");
    const msg = String(item.msg ?? item.message ?? "");
    if (key && msg) fields[key] = msg;
  });

  const message =
    (typeof body.message === "string" && body.message) ||
    (typeof body.error === "string" && body.error) ||
    (list[0] && String(list[0].msg ?? list[0].message ?? "")) ||
    STATUS_MESSAGES[status] ||
    "Something went wrong. Please try again.";

  return new ApiError(message, status, Object.keys(fields).length ? fields : undefined, data);
}

const SESSION_CHECK_URLS = ["/auth/profile"];

export function handle401() {
  tokenStore.clear();
}

type Method = "get" | "post" | "put" | "patch" | "delete";

interface ApiOptions {
  silent?: boolean;
  token?: string | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

let pendingRequests = 0;
const activityListeners = new Set<() => void>();

const trackRequest = (delta: number) => {
  pendingRequests += delta;
  activityListeners.forEach((fn) => fn());
};

export const apiActivity = {
  subscribe(fn: () => void) {
    activityListeners.add(fn);
    return () => {
      activityListeners.delete(fn);
    };
  },
  getSnapshot: () => pendingRequests,
};

let warnedMissingKey = false;

export async function Api<T = unknown>(method: Method, url: string, data?: unknown, options: ApiOptions = {}): Promise<T> {
  if (!API_KEY && !warnedMissingKey && process.env.NODE_ENV !== "production") {
    warnedMissingKey = true;
    console.warn("NEXT_PUBLIC_APP_KEY is not set — the backend will reject requests with “API key is required”.");
  }

  const token = options.token === undefined ? tokenStore.get() : options.token;
  if (token && process.env.NODE_ENV === "production" && !API_URL.startsWith("https://")) {
    throw new ApiError("Refusing to send your session over an insecure connection. The API URL must use https.");
  }
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
    authHeaders["authorization"] = `Bearer ${token}`;
    authHeaders["x-auth-token"] = token;
    authHeaders["token"] = token;
    authHeaders["auth-token"] = token;
  }

  const config: AxiosRequestConfig = {
    method,
    url: `${API_URL}${url.startsWith("/") ? url : `/${url}`}`,
    headers: {
      ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
      "x-api-key": API_KEY,
      ...authHeaders,
      ...options.headers,
    },
    signal: options.signal,
    timeout: 30_000,
    ...(method === "get" ? { params: data } : { data }),
  };

  if (!options.silent) trackRequest(1);
  try {
    const response = await axios.request<T>(config);
    return response.data;
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 401 && token && options.token === undefined && SESSION_CHECK_URLS.some((path) => url.includes(path))) handle401();
    throw apiError;
  } finally {
    if (!options.silent) trackRequest(-1);
  }
}

export async function ApiFirst<T = unknown>(method: Method, paths: string[], data?: unknown, options: ApiOptions = {}): Promise<T> {
  let last: unknown;
  for (const path of paths) {
    try {
      return await Api<T>(method, path, data, options);
    } catch (error) {
      last = error;
      if (!(error instanceof ApiError) || error.status !== 404) throw error;
    }
  }
  throw last;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function unwrapList<T = Record<string, unknown>>(res: unknown, ...keys: string[]): T[] {
  const body = isRecord(res) ? res : {};
  const data = body.data;
  const found: unknown[] = [res, data, ...keys.flatMap((k) => [isRecord(data) ? data[k] : undefined, body[k]]), isRecord(data) ? data.data : undefined];
  return (found.find(Array.isArray) as T[] | undefined) ?? [];
}

export function unwrapObject<T = Record<string, unknown>>(res: unknown, ...keys: string[]): T | null {
  const body = isRecord(res) ? res : null;
  if (!body) return null;
  const data = body.data;
  const found = [...keys.flatMap((k) => [isRecord(data) ? data[k] : undefined, body[k]]), data, body];
  return (found.find(isRecord) as T | undefined) ?? null;
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof Error && error.message) return error.message;
  return typeof error === "string" && error ? error : fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiPayload = Record<string, any>;
