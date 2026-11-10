export type CreateCampaignPartner = {
  partnerId: string;
  partnerTypeId?: string;
  contractType?: "PAID" | "UNPAID";
  activationIntentionIds?: string[];
};

export type CreateCampaignBody = {
  status: "DRAFT" | "UNDER_REVIEW";
  name: string;
  brandId?: string;
  megaplatformId?: string;
  marketIds?: string[];
  platformIds?: string[];
  keywords?: string[];
  dtStart?: string;
  dtEnd?: string;
  objective?: string;
  promotionalPartnerCampaignRole?: string;
  budget?: string | null;
  partners?: CreateCampaignPartner[];
};

export type CreateCampaignResponse = {
  id: string;
};

export class CampaignCreateApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Campaign create API error: ${status}`);
    this.name = "CampaignCreateApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => ({}));
  }
  return res.text();
}

export async function createCampaign(
  baseUrl: string,
  token: string,
  body: CreateCampaignBody,
): Promise<CreateCampaignResponse> {
  const origin = baseUrl.replace(/\/$/, "");

  const res = await fetch(`${origin}/v1/campaigns`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const responseBody = await parseResponseBody(res);
  if (!res.ok) {
    throw new CampaignCreateApiError(res.status, responseBody);
  }

  return responseBody as CreateCampaignResponse;
}

export async function createCampaignUnauthenticated(
  baseUrl: string,
  body: CreateCampaignBody,
): Promise<CreateCampaignResponse> {
  const origin = baseUrl.replace(/\/$/, "");

  const res = await fetch(`${origin}/v1/campaigns`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await parseResponseBody(res);
  if (!res.ok) {
    throw new CampaignCreateApiError(res.status, responseBody);
  }

  return responseBody as CreateCampaignResponse;
}
