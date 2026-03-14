import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

async function postToStrapiWithRetry(
  payload: object,
  maxAttempts = 3
): Promise<{ ok: boolean; status: number; body: any }> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: payload }),
        signal: AbortSignal.timeout(10000),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) return { ok: true, status: res.status, body };
      if (res.status >= 400 && res.status < 500) return { ok: false, status: res.status, body };
      lastError = { status: res.status, body };
    } catch (err) {
      lastError = err;
    }

    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  return { ok: false, status: 503, body: lastError };
}

export async function POST(req: NextRequest) {
  // ✅ อ่าน env — ทำงานได้ทั้ง Node.js และ Cloudflare edge runtime
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? '';

  // ── debug log ชั่วคราว (ลบออกหลังแก้ได้) ──
  console.log('ENV CHECK:', {
    hasSecret: !!RECAPTCHA_SECRET,
    secretLength: RECAPTCHA_SECRET.length,
    hasStrapiUrl: !!process.env.URI_STRAPI,
  });

  if (!RECAPTCHA_SECRET) {
    return NextResponse.json(
      { error: 'Server misconfiguration: RECAPTCHA_SECRET_KEY is not set.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, message, captchaToken } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token is missing.' }, { status: 400 });
    }

    // ── Verify reCAPTCHA ──
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: captchaToken,
      }).toString(),
    });

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      console.warn('reCAPTCHA failed:', captchaData['error-codes']);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
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
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}