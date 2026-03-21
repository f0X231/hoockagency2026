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
): Promise<{ ok: boolean; status: number; body: any; errorText?: string }> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (process.env.STRAPI_API_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
      }

      const res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: payload }),
        signal: createTimeoutSignal(10000),
      });

      const text = await res.text();
      let body = {};
      try { body = JSON.parse(text); } catch {}

      if (res.ok) return { ok: true, status: res.status, body };
      if (res.status >= 400 && res.status < 500) return { ok: false, status: res.status, body, errorText: text };
      lastError = { status: res.status, body, errorText: text };
    } catch (err) {
      lastError = err;
      console.error(`Strapi attempt ${attempt} failed:`, err);
    }
  }

  return { ok: false, status: 503, body: lastError };
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, phone, message } = body;

  // ── Validate fields ──
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  // ── Save to Strapi ──
  const result = await postToStrapiWithRetry({ name, email, phone, message }, 3);

  if (!result.ok) {
    console.error('Strapi save failed:', result.status, result.body, result.errorText);
    return NextResponse.json(
      { error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}