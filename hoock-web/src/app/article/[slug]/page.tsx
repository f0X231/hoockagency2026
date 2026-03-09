import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60; // Revalidate cache occasionally if using static generation

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
  // Handle common image field names
  thumbnail?: StrapiImage[] | StrapiImage | { url: string } | null;
  image?: StrapiImage[] | StrapiImage | { url: string } | null;
  cover?: StrapiImage[] | StrapiImage | { url: string } | null;
}

const getImageUrl = (imageProp: StrapiImage[] | StrapiImage | { url: string } | null | undefined): string => {
  if (!imageProp) return "https://picsum.photos/1200/600";
  
  const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';

  if (Array.isArray(imageProp)) {
    if (imageProp.length === 0) return "https://picsum.photos/1200/600";
    const url = imageProp[0].url;
    if (!url) return "https://picsum.photos/1200/600";
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  if ('url' in imageProp && imageProp.url) {
    return imageProp.url.startsWith('http') ? imageProp.url : `${STRAPI_URL}${imageProp.url}`;
  }

  // Fallback for nested Strapi v4 format
  if ((imageProp as any).data?.attributes?.url) {
    const url = (imageProp as any).data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  return "https://picsum.photos/1200/600";
};

async function getArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    const STRAPI_URL = process.env.URI_STRAPI || 'http://localhost:1337';
    
    // Instead of fetching directly by ID, fetch all articles and filter manually to handle the slug conversion
    // Since Strapi allows filtering, we fetch matching articles
    // Note: We're doing fetch everything and find the match. Since we don't have a reliable regex or native slug generator in Strapi for this exact transformation dynamically, 
    // it's safer to fetch the article if we assume the slug was derived from the title as `title.toLowerCase().replace(/\s+/g, '-')`

    const decodedSlug = decodeURIComponent(slug);
    
    // Fetch all articles with a high limit to ensure we can find the matching slug
    const res = await fetch(`${STRAPI_URL}/api/articles?populate=*&status=published&pagination[limit]=100`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error(`Failed to fetch articles:`, res.statusText);
      return null;
    }

    const json = await res.json();
    const articles: ArticleDetail[] = json.data || [];

    // Find the one whose generated slug matches the URL
    const matchedArticle = articles.find(article => {
      const generatedSlug = article.title 
        ? article.title.trim().toLowerCase().replace(/\s+/g, '-') 
        : article.documentId || `${article.id}`;
        
      return generatedSlug === decodedSlug || generatedSlug === slug || encodeURIComponent(generatedSlug) === slug;
    });

    return matchedArticle || null;
  } catch (error) {
    console.error('Error fetching article detail:', error);
    return null;
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-[#1C2329] pt-32">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link 
          href="/#article" 
          className="px-6 py-3 bg-[#1C2329] text-white font-semibold rounded hover:bg-[#D9A384] transition-colors"
        >
          Return to Articles
        </Link>
      </div>
    );
  }

  const mainImage = getImageUrl(article.cover || article.image || article.thumbnail);
  
  // Try to use common content field names. E.g., article.detail, article.content, article.description
  const mainContent = article.detail || article.content || article.description || "No content provided for this article.";

  return (
    <article className="min-h-screen bg-white pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb / Back Link */}
        <Link 
          href="/#article" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D9A384] mb-8 transition-colors uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Articles
        </Link>

        {/* 1. Title as H1 */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1C2329] leading-tight mb-4">
          {article.title}
        </h1>
        
        {/* Published Date */}
        <div className="text-gray-500 text-sm md:text-base mb-10">
          Published on {formatDate(article.publishedAt || article.updatedAt)}
        </div>

        {/* 2. Cover Full Width (constrained to max-w-7xl like section) */}
        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden mb-16 bg-gray-100">
          <Image 
            src={mainImage} 
            alt={article.title || 'Article Cover'} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* 3. Detail Section */}
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-700">
           {/* If Strapi returns Rich Text (markdown or blocks) it would need a markdown parser / BlocksRenderer. 
               For now we render it as text, preserving line breaks. */}
           <div className="whitespace-pre-wrap leading-relaxed">
             {mainContent}
           </div>
        </div>
      </div>
    </article>
  );
}
