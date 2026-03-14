import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function postToStrapiWithRetry(
  payload: object,
  maxAttempts = 3
): Promise<{ ok: boolean; status: number; body: any }> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
        signal: createTimeoutSignal(10000),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) return { ok: true, status: res.status, body };
      if (res.status >= 400 && res.status < 500) return { ok: false, status: res.status, body };
      lastError = { status: res.status, body };
    } catch (err) {
      lastError = err;
      console.error(`Strapi attempt ${attempt} failed:`, err);
    }
  }

  return { ok: false, status: 503, body: lastError };
}

export async function POST(req: NextRequest) {
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? '';

  if (!RECAPTCHA_SECRET) {
    console.error('RECAPTCHA_SECRET_KEY is not set');
    return NextResponse.json(
      { error: 'Server misconfiguration.' },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, phone, message, captchaToken } = body;

  // ── Validate fields ──
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (!captchaToken) {
    return NextResponse.json({ error: 'CAPTCHA token is missing.' }, { status: 400 });
  }

  // ── Verify reCAPTCHA ──
  try {
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: captchaToken,
      }).toString(),
      signal: createTimeoutSignal(8000),
    });

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      console.warn('reCAPTCHA failed:', captchaData['error-codes']);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('reCAPTCHA verify error:', err);
    return NextResponse.json(
      { error: 'CAPTCHA verification error. Please try again.' },
      { status: 500 }
    );
  }

  // ── Save to Strapi ──
  const result = await postToStrapiWithRetry({ name, email, phone, message }, 3);

  if (!result.ok) {
    console.error('Strapi save failed:', result.body);
    return NextResponse.json(
      { error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}