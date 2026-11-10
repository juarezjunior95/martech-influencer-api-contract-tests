export type SearchPartnersParams = {
  search: string;
  page?: number;
  pageSize?: number;
};

export type PaginatedPartnersResponse = {
  items: Array<{ id: string; name: string } & Record<string, unknown>>;
  page: number;
  pageSize: number;
  total: number;
};

export class PartnersApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Partners API error: ${status}`);
    this.name = "PartnersApiError";
    this.status = status;
    this.body = body;
  }
}

function buildQuery(params: SearchPartnersParams): Record<string, string> {
  const query: Record<string, string> = { search: params.search };
  if (params.page !== undefined) query.page = String(params.page);
  if (params.pageSize !== undefined) query.pageSize = String(params.pageSize);
  return query;
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => ({}));
  }
  return res.text();
}

export async function searchPartners(
  baseUrl: string,
  token: string,
  params: SearchPartnersParams,
): Promise<PaginatedPartnersResponse> {
  const origin = baseUrl.replace(/\/$/, "");
  const search = new URLSearchParams(buildQuery(params));

  const res = await fetch(`${origin}/v1/partners/search?${search}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new PartnersApiError(res.status, body);
  }

  return body as PaginatedPartnersResponse;
}

export async function searchPartnersUnauthenticated(
  baseUrl: string,
  params: SearchPartnersParams,
): Promise<PaginatedPartnersResponse> {
  const origin = baseUrl.replace(/\/$/, "");
  const search = new URLSearchParams(buildQuery(params));

  const res = await fetch(`${origin}/v1/partners/search?${search}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const body = await parseResponseBody(res);
  if (!res.ok) {
    throw new PartnersApiError(res.status, body);
  }

  return body as PaginatedPartnersResponse;
}
