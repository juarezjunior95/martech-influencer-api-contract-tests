/**
 * Cliente HTTP mínimo para a Martech Connect Influencer API (caminhos sob a base URL do serviço).
 * Nos testes de consumer Pact, `baseUrl` aponta para o mock (ex.: http://127.0.0.1:PORT).
 */
export type CampaignOverview = {
  id: string;
  status: string;
  name: string;
  brand: { id: string; name: string };
  megaplatform: { id: string; name: string };
  markets: Array<{ id: string; name: string }>;
  platforms: Array<{ id: string; name: string }>;
  keywords: string[];
  dtStart: string;
  dtEnd: string;
  objective: string;
  promotionalPartnerCampaignRole: string;
  budget: Record<string, unknown>;
};

export async function getCampaignOverview(
  baseUrl: string,
  campaignId: string,
  bearerToken: string,
): Promise<CampaignOverview> {
  const origin = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${origin}/v1/campaigns/${campaignId}/overview`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`getCampaignOverview failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as CampaignOverview;
}

/** Campos obrigatórios e opcionais alinhados ao `CreateCampaignRequestDto` do OpenAPI (Swagger UI export). */
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
  partners?: unknown[];
};

export async function createCampaign(
  baseUrl: string,
  bearerToken: string,
  body: CreateCampaignBody,
): Promise<{ id: string }> {
  const origin = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${origin}/v1/campaigns`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`createCampaign failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as { id: string };
}
