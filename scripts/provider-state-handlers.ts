type StateHandler = () => Promise<undefined>;
type StateHandlers = Record<string, StateHandler>;

const PROVIDER_STATE_NAMES = [
  "campaigns exist for submitter group draft",
  "campaigns exist for submitter group in_progress with partner breakdown by stage",
  "campaigns exist for brand-lead group in_progress",
  "campaigns exist for brand-lead with market and brand filters",
  "request is unauthenticated",
  "partners exist for search term ti",
  "no partners match search",
  "partners exist for paginated search",
  "search query is too short",
  "queued brand-safety jobs exist",
  "no queued brand-safety jobs",
  "queued brand-safety jobs exist for pagination",
  "queued brand-safety jobs exist with date filter",
  "brand-safety jobs list path is not exposed",
  "token lacks brand-safety read scope",
  "partner deck brand-safety enqueue succeeds",
  "queued brand-safety job exists",
  "brand-safety job already completed",
  "brand-safety jobs can expire",
  "expire already applied",
  "reference UUIDs exist for user creation",
  "invalid UUID references in user body",
  "missing required user fields",
  "user with email already exists",
  "submitter can create draft campaign",
  "valid partnerId exists for under review campaign",
  "valid partnerId exists for minimal under review campaign",
  "under review requires partners",
  "partnerId does not exist for campaign creation",
  "submitter scope excludes brand and market",
  "activation intention ids are invalid for partner",
] as const;

export type ProviderStateName = (typeof PROVIDER_STATE_NAMES)[number];

async function postProviderStateSetup(
  state: string,
  action: "setup" | "teardown",
): Promise<void> {
  const setupUrl = process.env.PROVIDER_STATES_SETUP_URL;
  if (!setupUrl) return;

  const res = await fetch(setupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, action, params: {} }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Provider state setup failed (${res.status}) for "${state}": ${body}`,
    );
  }
}

/**
 * Handlers locais para cada `given(...)` do consumer pact.
 * Se `PROVIDER_STATES_SETUP_URL` estiver definido, delega ao endpoint do backend
 * (padrão Pact: POST { state, action, params }).
 */
export function createProviderStateHandlers(): StateHandlers {
  return Object.fromEntries(
    PROVIDER_STATE_NAMES.map((state) => [
      state,
      async () => {
        console.log(`[pact:verify] provider state → ${state}`);
        await postProviderStateSetup(state, "setup");
      },
    ]),
  ) as StateHandlers;
}
