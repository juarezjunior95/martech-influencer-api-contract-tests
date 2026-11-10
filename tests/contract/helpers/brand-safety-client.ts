export type ListQueuedJobsParams = {
  page?: number;
  pageSize?: number;
  since?: string;
  until?: string;
};

export type QueuedBrandSafetyJob = {
  id: string;
  fullName: string;
  analysisType: string;
  createdAt: string;
  platforms: unknown[];
};

export type PaginatedQueuedJobsResponse = {
  items: QueuedBrandSafetyJob[];
  page: number;
  pageSize: number;
  total: number;
};

export class BrandSafetyApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Brand Safety API error: ${status}`);
    this.name = "BrandSafetyApiError";
    this.status = status;
    this.body = body;
  }
}

function buildQuery(params: ListQueuedJobsParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.page !== undefined) query.page = String(params.page);
  if (params.pageSize !== undefined) query.pageSize = String(params.pageSize);
  if (params.since) query.since = params.since;
  if (params.until) query.until = params.until;
  return query;
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => ({}));
  }
  return res.text();
}

async function listQueuedJobsAtPath(
  baseUrl: string,
  path: string,
  params: ListQueuedJobsParams,
  token?: string,
): Promise<PaginatedQueuedJobsResponse> {
  const origin = baseUrl.replace(/\/$/, "");
  const search = new URLSearchParams(buildQuery(params));
  const querySuffix = search.toString() ? `?${search}` : "";

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${origin}${path}${querySuffix}`, {
    method: "GET",
    headers,
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new BrandSafetyApiError(res.status, body);
  }

  return body as PaginatedQueuedJobsResponse;
}

export function listQueuedBrandSafetyJobs(
  baseUrl: string,
  token: string,
  params: ListQueuedJobsParams = {},
) {
  return listQueuedJobsAtPath(
    baseUrl,
    "/v1/partners/brand-safety/jobs/queued",
    params,
    token,
  );
}

export function listQueuedBrandSafetyJobsUnauthenticated(
  baseUrl: string,
  params: ListQueuedJobsParams = {},
) {
  return listQueuedJobsAtPath(
    baseUrl,
    "/v1/partners/brand-safety/jobs/queued",
    params,
  );
}

export function listBrandSafetyJobsWrongPath(
  baseUrl: string,
  token: string,
  params: ListQueuedJobsParams = {},
): Promise<PaginatedQueuedJobsResponse> {
  return listQueuedJobsAtPath(
    baseUrl,
    "/v1/partners/brand-safety/jobs",
    params,
    token,
  );
}

export type EnqueueDeckBrandSafetyBody = {
  variant: "public" | "restricted";
};

export type CompleteBrandSafetyJobBody = {
  completedAt: string;
  summary: string;
  score: number;
  contents: unknown[];
  shortSummary?: string;
};

export type IdResponse = { id: string };
export type ExpireJobsResponse = { expiredCount: number };

async function mutateJson<T>(
  baseUrl: string,
  method: "POST",
  path: string,
  token?: string,
  body?: unknown,
): Promise<T> {
  const origin = baseUrl.replace(/\/$/, "");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${origin}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = await parseResponseBody(res);
  if (!res.ok) {
    throw new BrandSafetyApiError(res.status, parsed);
  }
  return parsed as T;
}

export function enqueuePartnerDeckBrandSafety(
  baseUrl: string,
  partnerId: string,
  token: string,
  body: EnqueueDeckBrandSafetyBody,
) {
  return mutateJson<IdResponse>(
    baseUrl,
    "POST",
    `/v1/partners/${partnerId}/deck/brand-safety`,
    token,
    body,
  );
}

export function enqueuePartnerDeckBrandSafetyUnauthenticated(
  baseUrl: string,
  partnerId: string,
  body: EnqueueDeckBrandSafetyBody,
) {
  return mutateJson<IdResponse>(
    baseUrl,
    "POST",
    `/v1/partners/${partnerId}/deck/brand-safety`,
    undefined,
    body,
  );
}

export function completeBrandSafetyJob(
  baseUrl: string,
  jobId: string,
  token: string,
  body: CompleteBrandSafetyJobBody,
) {
  return mutateJson<IdResponse>(
    baseUrl,
    "POST",
    `/v1/partners/brand-safety/jobs/${jobId}/complete`,
    token,
    body,
  );
}

export function completeBrandSafetyJobUnauthenticated(
  baseUrl: string,
  jobId: string,
  body: CompleteBrandSafetyJobBody,
) {
  return mutateJson<IdResponse>(
    baseUrl,
    "POST",
    `/v1/partners/brand-safety/jobs/${jobId}/complete`,
    undefined,
    body,
  );
}

export function expireBrandSafetyJobs(baseUrl: string, token: string) {
  return mutateJson<ExpireJobsResponse>(
    baseUrl,
    "POST",
    "/v1/partners/brand-safety/jobs/expire",
    token,
  );
}

export function expireBrandSafetyJobsUnauthenticated(baseUrl: string) {
  return mutateJson<ExpireJobsResponse>(
    baseUrl,
    "POST",
    "/v1/partners/brand-safety/jobs/expire",
  );
}
