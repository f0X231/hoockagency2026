import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

export async function GET() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/banners?populate=*&status=published`,
      { next: { revalidate: 7200 } }
    );
    if (!res.ok) return NextResponse.json({ data: [] }, { status: res.status });

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json({ data: [] }, { status: 503 });
  }
}