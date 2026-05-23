import { Metadata } from 'next';
import WorkPageClient from '@/components/work/WorkPageClient';

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoockagency.com';

interface WorkData {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  tags?: string;
  thumbnail?: { url: string }[] | { url: string } | null;
}

const getImageUrl = (thumbnail: WorkData['thumbnail']): string => {
  if (!thumbnail) return `${SITE_URL}/logo.png`;
  if (Array.isArray(thumbnail)) {
    const url = thumbnail[0]?.url;
    if (!url) return `${SITE_URL}/logo.png`;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in thumbnail && thumbnail.url) {
    return thumbnail.url.startsWith('http') ? thumbnail.url : `${STRAPI_URL}${thumbnail.url}`;
  }
  return `${SITE_URL}/logo.png`;
};

async function findWork(slug: string): Promise<WorkData | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/works?fields[0]=title&fields[1]=description&fields[2]=tags&populate[thumbnail]=*&status=published&pagination[limit]=100`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const works: WorkData[] = json.data || [];
    const decodedSlug = decodeURIComponent(slug);
    return works.find(w => {
      const generatedSlug = w.title
        ? w.title.trim().toLowerCase().replace(/\s+/g, '-')
        : w.documentId || `${w.id}`;
      return generatedSlug === decodedSlug || generatedSlug === slug || encodeURIComponent(generatedSlug) === slug;
    }) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await findWork(slug);

  if (!work) {
    return {
      title: 'Work Not Found',
      description: 'The project you are looking for does not exist.',
    };
  }

  const imgUrl = getImageUrl(work.thumbnail);
  const description =
    work.description ||
    `${work.title} — ผลงานของ HOOCK Agency เอเจนซี่โฆษณาครบวงจร`;

  return {
    title: work.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/work/${encodeURIComponent(slug)}`,
    },
    openGraph: {
      title: `${work.title} | HOOCK Agency`,
      description,
      type: 'website',
      url: `${SITE_URL}/work/${encodeURIComponent(slug)}`,
      siteName: 'HOOCK Agency',
      locale: 'th_TH',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} | HOOCK Agency`,
      description,
      images: [imgUrl],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WorkPageClient slug={slug} />;
}
