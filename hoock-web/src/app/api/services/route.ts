import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

export async function GET() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/services?populate=*&status=published`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ data: [] }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [] }, { status: 503 });
  }
}