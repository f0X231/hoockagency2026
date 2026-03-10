import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start') || '0';
  const limit = searchParams.get('limit') || '3';

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?populate=*&status=published&sort=updatedAt:desc&pagination[start]=${start}&pagination[limit]=${limit}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json({ data: [], meta: {} }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [], meta: {} }, { status: 503 });
  }
}