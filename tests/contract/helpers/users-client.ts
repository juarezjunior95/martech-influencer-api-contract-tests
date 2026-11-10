export type CreateUserBody = {
  email?: string;
  roleTitleId?: string;
  marketIds?: string[];
  brandIds?: string[];
  zoneIds?: string[];
};

export type CreateUserResponse = {
  id: string;
};

export class UsersApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Users API error: ${status}`);
    this.name = "UsersApiError";
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

export async function createUser(
  baseUrl: string,
  token: string,
  body: CreateUserBody,
): Promise<CreateUserResponse> {
  const origin = baseUrl.replace(/\/$/, "");

  const res = await fetch(`${origin}/v1/users`, {
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
    throw new UsersApiError(res.status, responseBody);
  }

  return responseBody as CreateUserResponse;
}

export async function createUserUnauthenticated(
  baseUrl: string,
  body: CreateUserBody,
): Promise<CreateUserResponse> {
  const origin = baseUrl.replace(/\/$/, "");

  const res = await fetch(`${origin}/v1/users`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await parseResponseBody(res);
  if (!res.ok) {
    throw new UsersApiError(res.status, responseBody);
  }

  return responseBody as CreateUserResponse;
}
