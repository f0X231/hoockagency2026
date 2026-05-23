import { MetadataRoute } from "next";

const STRAPI_URL =
  process.env.URI_STRAPI || "https://strong-art-a39006d263.strapiapp.com";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hoockagency.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?fields[0]=documentId&fields[1]=updatedAt&status=published&pagination[limit]=200`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      articleRoutes = (json.data || []).map((article: { documentId: string; updatedAt: string }) => ({
        url: `${SITE_URL}/article/${article.documentId}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {}

  let workRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/works?fields[0]=title&fields[1]=updatedAt&status=published&pagination[limit]=200`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      workRoutes = (json.data || []).map((work: { title: string; documentId: string; updatedAt: string }) => {
        const slug = work.title
          ? work.title.trim().toLowerCase().replace(/\s+/g, "-")
          : work.documentId;
        return {
          url: `${SITE_URL}/work/${encodeURIComponent(slug)}`,
          lastModified: new Date(work.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      });
    }
  } catch {}

  return [...staticRoutes, ...articleRoutes, ...workRoutes];
}
