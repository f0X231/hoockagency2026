import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 21600; // CDN/ISR revalidate ทุก 6 ชั่วโมง

const STRAPI_URL = process.env.URI_STRAPI || 'https://strong-art-a39006d263.strapiapp.com';

interface StrapiImage {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
}

interface ArticleDetail {
  id: number;
  documentId?: string;
  title: string;
  updatedAt: string;
  publishedAt: string;
  content?: string;
  description?: string;
  detail?: string;
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
  image?: StrapiImage[] | StrapiImage | { url: string } | null;
  cover?: StrapiImage[] | StrapiImage | { url: string } | null;
}

const getImageUrl = (
  imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined
): string => {
  if (!imageProp) return 'https://picsum.photos/1200/600';
  if (Array.isArray(imageProp)) {
    if (!imageProp.length) return 'https://picsum.photos/1200/600';
    const url = imageProp[0].url;
    if (!url) return 'https://picsum.photos/1200/600';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }
  if ((imageProp as any).data?.attributes?.url) {
    const url = (imageProp as any).data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return 'https://picsum.photos/1200/600';
};

// ✅ แก้ไข: fetch ด้วย documentId โดยตรง — ไม่ต้อง fetch ทั้งหมดแล้วกรอง
async function getArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?filters[documentId][$eq]=${slug}&populate=*&status=published`,
      { next: { revalidate: 21600 } } // ✅ 6 ชั่วโมง
    );

    if (!res.ok) {
      console.error('Failed to fetch article:', res.statusText);
      return null;
    }

    const json = await res.json();
    return (json.data as ArticleDetail[])?.[0] ?? null;
  } catch (error) {
    console.error('Error fetching article detail:', error);
    return null;
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ✅ generateMetadata — SEO: title, description, og:image, twitter card
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    };
  }

  const mainImage = getImageUrl(article.cover ?? article.image ?? article.thumbnail);
  const description =
    article.description ||
    article.detail?.slice(0, 160) ||
    article.content?.slice(0, 160) ||
    '';

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [mainImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-[#1C2329] pt-32">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/#article"
          className="px-6 py-3 bg-[#1C2329] text-white font-semibold rounded hover:bg-[#D9A384] transition-colors"
        >
          Return to Articles
        </Link>
      </div>
    );
  }

  const mainImage = getImageUrl(article.cover ?? article.image ?? article.thumbnail);
  const mainContent =
    article.detail || article.content || article.description || 'No content provided for this article.';

  return (
    <article className="min-h-screen bg-white pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Link */}
        <Link
          href="/#article"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D9A384] mb-8 transition-colors uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Articles
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1C2329] leading-tight mb-4">
          {article.title}
        </h1>

        {/* Published Date */}
        <div className="text-gray-500 text-sm md:text-base mb-10">
          Published on {formatDate(article.publishedAt || article.updatedAt)}
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden mb-16 bg-gray-100">
          <Image
            src={mainImage}
            alt={article.title || 'Article Cover'}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-700">
          <div className="whitespace-pre-wrap leading-relaxed">
            {mainContent}
          </div>
        </div>

      </div>
    </article>
  );
}