/**
 * Perfex CRM web-to-lead submission.
 *
 * Perfex runs on CodeIgniter, whose CSRF protection is a matched pair: a
 * `csrf_cookie_name` cookie and a `csrf_token_name` form field carrying the
 * same value. Neither can be hardcoded — the token rotates. So every
 * submission is a two-step handshake:
 *
 *   1. GET the public form, read the token out of the HTML and the cookie out
 *      of the response headers.
 *   2. POST multipart/form-data carrying both.
 *
 * The form is also `enctype="multipart/form-data"`, so the body must be
 * FormData; a urlencoded body is rejected.
 *
 * Verified against the live form: no reCAPTCHA is enabled on it, so a
 * server-side submission is accepted. If reCAPTCHA is ever switched on in the
 * CRM, this will start failing and the lead will fall back to `crmStatus:
 * "failed"` — visible in the admin rather than silently dropped.
 */

const FORM_URL =
  process.env.PERFEX_WTL_URL ||
  "https://crm.setups.works/forms/wtl/0a48d75db8dc944eeaf03c8951696d5f";

/** The form key is the last path segment of the web-to-lead URL. */
function formKey(url: string): string {
  return url.split("/").filter(Boolean).pop() ?? "";
}

export interface PerfexLead {
  name: string;
  email: string;
  phonenumber: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  /** Perfex numeric country id, e.g. "102" for India. */
  country?: string;
  zip?: string;
  /**
   * Perfex's form has no description field by default. It is sent anyway —
   * CodeIgniter ignores unknown POST fields — so that it lands in the CRM
   * automatically if a Description field is ever added to the form.
   */
  description?: string;
}

export interface PerfexResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/** Pull the CSRF token value out of the rendered form HTML. */
function extractToken(html: string): string | null {
  const m = html.match(
    /name="csrf_token_name"[^>]*value="([^"]+)"|value="([^"]+)"[^>]*name="csrf_token_name"/,
  );
  return m ? (m[1] ?? m[2] ?? null) : null;
}

/** Collect the Set-Cookie pairs we need to echo back on the POST. */
function extractCookies(res: Response): string {
  // getSetCookie() is the only way to see multiple Set-Cookie headers; Perfex
  // sends both csrf_cookie_name and sp_session and the POST needs both.
  const raw =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : ([res.headers.get("set-cookie")].filter(Boolean) as string[]);
  return raw.map((c) => c.split(";")[0]).join("; ");
}

export async function submitToPerfex(lead: PerfexLead): Promise<PerfexResult> {
  const url = FORM_URL;

  try {
    // --- 1. Handshake: fetch a fresh token + session cookies -------------
    const pageRes = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "SetupsWorksSite/1.0" },
      cache: "no-store",
    });

    if (!pageRes.ok) {
      return { ok: false, status: pageRes.status, error: `Form fetch failed (${pageRes.status})` };
    }

    const html = await pageRes.text();
    const token = extractToken(html);
    const cookies = extractCookies(pageRes);

    if (!token) {
      return { ok: false, error: "Could not read CSRF token from the CRM form." };
    }

    // --- 2. Submit -------------------------------------------------------
    const body = new FormData();
    body.append("csrf_token_name", token);
    body.append("key", formKey(url));
    body.append("name", lead.name);
    body.append("email", lead.email);
    body.append("phonenumber", lead.phonenumber);
    body.append("company", lead.company ?? "");
    body.append("address", lead.address ?? "");
    body.append("city", lead.city ?? "");
    body.append("state", lead.state ?? "");
    body.append("country", lead.country ?? "");
    body.append("zip", lead.zip ?? "");
    if (lead.description) body.append("description", lead.description);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookies,
        Referer: url,
        "User-Agent": "SetupsWorksSite/1.0",
      },
      body,
      redirect: "manual",
      cache: "no-store",
    });

    // Verified against the live form: on success Perfex replies 200 with the
    // JSON body {"success":true}. Some configurations redirect to a thank-you
    // page instead, so both are treated as success. A 200 that re-renders the
    // form is CodeIgniter reporting validation failure.
    if (res.status >= 300 && res.status < 400) {
      return { ok: true, status: res.status };
    }

    if (res.ok) {
      const text = await res.text();

      try {
        const json = JSON.parse(text) as { success?: boolean; message?: string };
        if (typeof json.success === "boolean") {
          return json.success
            ? { ok: true, status: res.status }
            : {
                ok: false,
                status: res.status,
                error: json.message || "CRM rejected the submission.",
              };
        }
      } catch {
        // Not JSON — fall through to the HTML checks below.
      }

      if (!text.includes('name="csrf_token_name"')) {
        return { ok: true, status: res.status };
      }
      const err = text.match(/<div[^>]*class="[^"]*alert[^"]*"[^>]*>([\s\S]{0,300}?)<\/div>/i);
      return {
        ok: false,
        status: res.status,
        error: err
          ? err[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)
          : "CRM rejected the submission (validation failed).",
      };
    }

    return { ok: false, status: res.status, error: `CRM returned ${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
