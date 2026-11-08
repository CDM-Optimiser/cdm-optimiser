import type {Page, Route} from '@playwright/test';

// A stand-in for Supabase, so end-to-end tests can sign in and see patients
// without a real project. Every request to another origin is answered here
// or refused: nothing leaves the machine, whatever URL the build contains.
// The patients are synthetic.

type Status = 'accepted' | 'refused' | 'pending';

const PATIENT_COUNT = 300;

/** Patient `id`'s status: a mix of all three, so every row colour shows. */
function statusOf(id: number): Status {
  return (['pending', 'accepted', 'refused'] as const)[id % 3];
}

function patientRow(id: number, status: Status = statusOf(id)) {
  const n = String(id).padStart(4, '0');

  return {
    id,
    name: `Test Patient ${n}`,
    dob: '01/01/1970',
    gms: `TEST${n}`,
    gender: null,
    address: `${id} Example Street`,
    home_phone: '01 000 0000',
    mobile_phone: null,
    email: null,
    regdate: null,
    type: null,
    hcp: null,
    expdate: null,
    asthma: id % 2,
    dm: 1,
    cvd: 0,
    copd: id % 4 === 0 ? 1 : 0,
    cdm_condition_count: 1,
    potential_income: 150,
    accepted: status === 'accepted' ? 1 : 0,
    refused: status === 'refused' ? 1 : 0,
    updated_at: '2026-01-01T00:00:00Z',
  };
}

const PATIENTS = Array.from({length: PATIENT_COUNT}, (_, index) =>
  patientRow(index + 1)
);

const USER = {
  id: '00000000-0000-4000-8000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test.user@example.com',
  app_metadata: {provider: 'email'},
  user_metadata: {},
  created_at: '2026-01-01T00:00:00Z',
};

function base64Url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

/** A session shaped like Supabase's. The token is never verified here. */
function session() {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const claims = {sub: USER.id, role: 'authenticated', exp: expiresAt};

  return {
    access_token: `${base64Url({alg: 'ES256', typ: 'JWT'})}.${base64Url(claims)}.fake`,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: expiresAt,
    user: USER,
  };
}

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    headers: CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

interface FakeSupabaseOptions {
  /** Refuse the password, as Supabase does for a wrong one. */
  rejectLogin?: boolean;
}

/**
 * Answers Supabase's auth and database calls for `page`. Returns the
 * requests it refused, which a test should expect to be empty.
 */
export async function useFakeSupabase(
  page: Page,
  {rejectLogin = false}: FakeSupabaseOptions = {}
): Promise<string[]> {
  const refused: string[] = [];

  await page.route(
    (url) => url.hostname !== 'localhost',
    (route) => {
      const request = route.request();
      const {pathname} = new URL(request.url());

      if (request.method() === 'OPTIONS') {
        return route.fulfill({status: 204, headers: CORS_HEADERS});
      }

      if (pathname === '/auth/v1/token') {
        return rejectLogin
          ? json(
              route,
              {
                code: 400,
                error_code: 'invalid_credentials',
                msg: 'Invalid login credentials',
              },
              400
            )
          : json(route, session());
      }

      if (pathname === '/auth/v1/logout') {
        return route.fulfill({status: 204, headers: CORS_HEADERS});
      }

      if (pathname === '/rest/v1/rpc/list_patients') {
        const {p_status, p_limit, p_offset} = request.postDataJSON();
        const matches = PATIENTS.filter(
          (row) => p_status === 'all' || statusOf(row.id) === p_status
        );

        return json(route, {
          total: matches.length,
          patients: matches.slice(p_offset, p_offset + p_limit),
        });
      }

      if (pathname === '/rest/v1/rpc/get_patient_counts') {
        const count = (status: Status) =>
          PATIENTS.filter((row) => statusOf(row.id) === status).length;

        return json(route, {
          total: PATIENTS.length,
          accepted: count('accepted'),
          refused: count('refused'),
          pending: count('pending'),
        });
      }

      if (pathname === '/rest/v1/rpc/update_patient_status') {
        const {p_id, p_status} = request.postDataJSON();

        return json(route, patientRow(p_id, p_status));
      }

      refused.push(`${request.method()} ${pathname}`);

      return route.abort('blockedbyclient');
    }
  );

  return refused;
}

/** Signs in through the login form, against the fake. */
export async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(USER.email);
  await page.getByLabel('Password').fill('not-a-real-password');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.waitForURL((url) => url.pathname === '/');
}
