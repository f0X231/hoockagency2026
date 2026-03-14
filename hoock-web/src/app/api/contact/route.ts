import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';

// ── Retry helper: ลอง POST ไป Strapi สูงสุด maxAttempts ครั้ง ──
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
          // ใส่ API token ถ้า Strapi ต้องการ auth
          // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ data: payload }),
        // timeout per attempt
        signal: AbortSignal.timeout(10000),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) return { ok: true, status: res.status, body };

      // 4xx ไม่มีประโยชน์ retry — หยุดทันที
      if (res.status >= 400 && res.status < 500) {
        return { ok: false, status: res.status, body };
      }

      // 5xx — เก็บไว้ retry
      lastError = { status: res.status, body };
    } catch (err) {
      lastError = err;
    }

    // รอก่อน retry: 1s, 2s
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  return { ok: false, status: 503, body: lastError };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, captchaToken } = body;

    // ── 1. Validate fields ──
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // ── 2. Verify reCAPTCHA ──
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token is missing.' }, { status: 400 });
    }

    if (!RECAPTCHA_SECRET) {
      console.error('RECAPTCHA_SECRET_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: captchaToken,
      }).toString(),
    });

    const captchaData = await captchaRes.json();

    // ตรวจทั้ง success flag และ score (reCAPTCHA v3 ต้องการ score > 0.5)
    if (!captchaData.success) {
      console.warn('reCAPTCHA failed:', captchaData['error-codes']);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // ── 3. Save to Strapi with retry ──
    const result = await postToStrapiWithRetry(
      { name, email, phone, message },
      3 // ครั้งแรก + retry อีก 2 รอบ
    );

    if (!result.ok) {
      console.error('Strapi save failed after retries:', result.body);
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