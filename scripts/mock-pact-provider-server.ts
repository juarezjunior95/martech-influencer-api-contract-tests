/**
 * Provider HTTP mock que responde conforme o pact publicado pelo consumer.
 * Usado com `npm run pact:verify-provider:mock` (sem UAT nem JWT).
 */
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { URL } from "node:url";
import { DEFAULT_PACT_FILE } from "./verify-provider-config";

type PactBody = {
  content?: unknown;
  contentType?: string;
  encoded?: boolean | string;
};

type PactInteraction = {
  description: string;
  providerStates?: { name: string }[];
  request: {
    method: string;
    path: string;
    query?: Record<string, string[]>;
    body?: PactBody;
    headers?: Record<string, string[]>;
  };
  response: {
    status: number;
    headers?: Record<string, string[]>;
    body?: PactBody;
  };
};

type PactDoc = { interactions: PactInteraction[] };

const PORT = Number(process.env.PACT_MOCK_PROVIDER_PORT ?? 3765);
const PACT_FILE = process.env.PACT_FILE ?? DEFAULT_PACT_FILE;

let activeProviderState: string | null = null;

function loadPact(): PactDoc {
  if (!existsSync(PACT_FILE)) {
    throw new Error(`Pact não encontrado: ${PACT_FILE}`);
  }
  return JSON.parse(readFileSync(PACT_FILE, "utf8")) as PactDoc;
}

const pact = loadPact();

function parseQuery(searchParams: URLSearchParams): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const key of new Set(searchParams.keys())) {
    out[key] = searchParams.getAll(key);
  }
  return out;
}

function queryMatches(
  pactQuery: Record<string, string[]> | undefined,
  actual: Record<string, string[]>,
): boolean {
  if (!pactQuery || Object.keys(pactQuery).length === 0) return true;
  for (const [key, values] of Object.entries(pactQuery)) {
    const actualValues = actual[key];
    if (!actualValues || actualValues.join(",") !== values.join(",")) {
      return false;
    }
  }
  return true;
}

function requestBodyContent(body: PactBody | undefined): unknown {
  if (!body?.content) return undefined;
  return body.content;
}

function incomingBodySignature(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    return trimmed;
  }
}

function pactBodySignature(body: PactBody | undefined): string {
  const content = requestBodyContent(body);
  if (content === undefined) return "";
  if (typeof content === "object" && content !== null) {
    return JSON.stringify(content);
  }
  return String(content);
}

function stateMatches(
  providerStates: { name: string }[] | undefined,
  active: string | null,
): boolean {
  const expected = providerStates?.[0]?.name;
  if (!expected) return active === null;
  return expected === active;
}

function hasAuthorization(
  headers: Record<string, string[] | undefined> | undefined,
): boolean {
  return Boolean(headers?.Authorization?.[0] ?? headers?.authorization?.[0]);
}

function authExpectationMatches(
  interaction: PactInteraction,
  reqHeaders: http.IncomingHttpHeaders,
): boolean {
  const pactAuth = hasAuthorization(interaction.request.headers);
  const incomingAuth = Boolean(reqHeaders.authorization);
  return pactAuth === incomingAuth;
}

function findInteraction(
  method: string,
  pathname: string,
  query: Record<string, string[]>,
  bodyRaw: string,
  reqHeaders: http.IncomingHttpHeaders,
): PactInteraction | undefined {
  const bodySig = incomingBodySignature(bodyRaw);

  const candidates = pact.interactions.filter((interaction) => {
    if (interaction.request.method !== method) return false;
    if (interaction.request.path !== pathname) return false;
    if (!queryMatches(interaction.request.query, query)) return false;
    if (!stateMatches(interaction.providerStates, activeProviderState)) {
      return false;
    }
    if (!authExpectationMatches(interaction, reqHeaders)) return false;
    return true;
  });

  if (candidates.length === 1) return candidates[0];

  const withBody = candidates.filter(
    (interaction) => pactBodySignature(interaction.request.body) === bodySig,
  );
  if (withBody.length === 1) return withBody[0];
  if (withBody.length > 1) return withBody[0];

  const withPartialBody = candidates.filter((interaction) => {
    const expected = requestBodyContent(interaction.request.body);
    if (expected === undefined || bodySig === "") return true;
    try {
      const incoming = JSON.parse(bodySig) as Record<string, unknown>;
      if (typeof expected !== "object" || expected === null) return false;
      return Object.entries(expected as Record<string, unknown>).every(
        ([key, value]) => JSON.stringify(incoming[key]) === JSON.stringify(value),
      );
    } catch {
      return false;
    }
  });
  if (withPartialBody.length >= 1) return withPartialBody[0];

  return candidates[0];
}

function buildResponseBody(body: PactBody | undefined): {
  payload: string | Buffer;
  contentType: string;
} {
  if (!body) {
    return { payload: "", contentType: "text/plain" };
  }

  const headerType = body.contentType ?? "application/json";
  if (body.encoded === "base64" || body.encoded === true) {
    const buf = Buffer.from(String(body.content), "base64");
    return { payload: buf, contentType: headerType };
  }

  if (typeof body.content === "object" && body.content !== null) {
    return {
      payload: JSON.stringify(body.content),
      contentType: headerType.split(";")[0]?.trim() || "application/json",
    };
  }

  return {
    payload: String(body.content ?? ""),
    contentType: headerType.split(";")[0]?.trim() || "text/plain",
  };
}

function readRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleProviderState(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const raw = await readRequestBody(req);
  let state: string | undefined;
  try {
    const payload = JSON.parse(raw) as { state?: string; action?: string };
    if (payload.action === "teardown") {
      activeProviderState = null;
    } else if (payload.state) {
      state = payload.state;
      activeProviderState = state;
    }
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("invalid provider state body");
    return;
  }

  console.log(`[mock-provider] state → ${activeProviderState ?? "(cleared)"}`);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, state: activeProviderState }));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);

    if (req.method === "POST" && url.pathname === "/_pact/provider-states") {
      await handleProviderState(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === "/_pact/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          interactions: pact.interactions.length,
          activeProviderState,
        }),
      );
      return;
    }

    const method = req.method ?? "GET";
    const bodyRaw =
      method === "GET" || method === "HEAD" ? "" : await readRequestBody(req);
    const query = parseQuery(url.searchParams);

    const interaction = findInteraction(
      method,
      url.pathname,
      query,
      bodyRaw,
      req.headers,
    );

    if (!interaction) {
      console.warn(
        `[mock-provider] sem match ${method} ${url.pathname} state=${activeProviderState}`,
      );
      res.writeHead(501, { "Content-Type": "text/plain" });
      res.end("mock provider: interaction not found");
      return;
    }

    const { payload, contentType } = buildResponseBody(
      interaction.response.body,
    );
    const headers: Record<string, string> = {
      "Content-Type":
        interaction.response.headers?.["Content-Type"]?.[0] ?? contentType,
    };

    console.log(
      `[mock-provider] ${method} ${url.pathname} → ${interaction.response.status} (${interaction.description})`,
    );
    res.writeHead(interaction.response.status, headers);
    res.end(payload);
  } catch (err) {
    console.error("[mock-provider]", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("mock provider error");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `[mock-provider] listening on http://127.0.0.1:${PORT} (${pact.interactions.length} interactions, pact: ${path.basename(PACT_FILE)})`,
  );
});
