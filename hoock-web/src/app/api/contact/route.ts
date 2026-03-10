import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, captchaToken } = body;

    // Validate all fields
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Verify reCAPTCHA
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return NextResponse.json({ error: 'CAPTCHA verification failed.' }, { status: 400 });
    }

    // Save to Strapi
    const strapiRes = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { name, email, phone, message } }),
    });

    if (!strapiRes.ok) {
      const err = await strapiRes.json();
      console.error('Strapi error:', err);
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}