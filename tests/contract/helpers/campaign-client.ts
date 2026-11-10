export type ListCampaignsParams = {
  group: string;
  page: number;
  pageSize: number;
  marketId?: string;
  brandId?: string;
  /** Ex.: `byStage` — inclui `partnerBreakdowns` na listagem submitter (UAT). */
  partnerBreakdown?: string;
};

export type PaginatedCampaignsResponse = {
  items: Array<Record<string, unknown>>;
  page: number;
  pageSize: number;
  total: number;
};

export class CampaignApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Campaign API error: ${status}`);
    this.name = "CampaignApiError";
    this.status = status;
    this.body = body;
  }
}

function buildQuery(params: ListCampaignsParams): Record<string, string> {
  const query: Record<string, string> = {
    group: params.group,
    page: String(params.page),
    pageSize: String(params.pageSize),
  };
  if (params.marketId) query.marketId = params.marketId;
  if (params.brandId) query.brandId = params.brandId;
  if (params.partnerBreakdown) query.partnerBreakdown = params.partnerBreakdown;
  return query;
}

async function listCampaigns(
  baseUrl: string,
  path: string,
  params: ListCampaignsParams,
  token?: string,
): Promise<PaginatedCampaignsResponse> {
  const origin = baseUrl.replace(/\/$/, "");
  const search = new URLSearchParams(buildQuery(params));
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${origin}${path}?${search}`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    throw new CampaignApiError(res.status, body);
  }

  return body as PaginatedCampaignsResponse;
}

export function listSubmitterCampaigns(
  baseUrl: string,
  token: string,
  params: ListCampaignsParams,
) {
  return listCampaigns(baseUrl, "/v1/campaigns/submitter", params, token);
}

export function listSubmitterCampaignsUnauthenticated(
  baseUrl: string,
  params: ListCampaignsParams,
) {
  return listCampaigns(baseUrl, "/v1/campaigns/submitter", params);
}

export function listBrandLeadCampaigns(
  baseUrl: string,
  token: string,
  params: ListCampaignsParams,
) {
  return listCampaigns(baseUrl, "/v1/campaigns/brand-lead", params, token);
}

export function listBrandLeadCampaignsUnauthenticated(
  baseUrl: string,
  params: ListCampaignsParams,
) {
  return listCampaigns(baseUrl, "/v1/campaigns/brand-lead", params);
}
