import Article from "@/components/article";
import Hero from "@/components/hero";
import HeroCategory from "@/components/hero-category";
import List from "@/components/list";
import { categories, contentFromSlug, posts } from "@/lib/contentlayer";
import { PAGE_SIZE, paginate } from "@/lib/pagination";
import { toSlugArray } from "@/lib/slug";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import type {
  BlogPosting,
  CollectionPage,
  ListItem,
  Person,
  WebSite,
  WithContext,
} from "schema-dts";

const SITE_NAME = process.env.SITE_NAME!;
const SITE_URL = process.env.SITE_URL!.replace(/\/$/, "");

export function generateStaticParams() {
  return [
    {
      slug: undefined,
    },
    ...Array.from({ length: Math.ceil(posts.length / PAGE_SIZE) }, (_, i) => ({
      slug: ["page", `${i + 1}`],
    })),
    ...categories.reduce(
      (acc, m) => {
        acc.push({
          slug: toSlugArray(m.slug),
        });
        acc.push(
          ...Array.from({ length: Math.ceil(m.posts.length / PAGE_SIZE) }, (_, i) => ({
            slug: toSlugArray(m.slug).concat(["page", `${i + 1}`]),
          })),
        );
        return acc;
      },
      [] as { slug: string[] }[],
    ),
    ...posts.map((m) => ({
      slug: toSlugArray(m.slug),
    })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: slugArray } = await params;
  const isPagination =
    slugArray && slugArray.at(-2) === "page" && /^\d+$/.test(slugArray.at(-1) ?? "");
  const currentSlug = isPagination ? slugArray.slice(0, -2).join("/") : slugArray?.join("/");
  const { category: currentCategory, post: currentPost } = contentFromSlug(currentSlug);
  const metadata: Metadata = currentPost
    ? {
        metadataBase: new URL(SITE_URL),
        title: currentPost.title,
        description: currentPost.description,
        robots: {
          index: true,
          follow: true,
        },
        openGraph: {
          title: currentPost.title,
          description: currentPost.description,
          images: {
            url: `/opengraph/${currentSlug}/image`,
            alt: currentPost.title,
          },
        },
        alternates: {
          canonical: `/${currentPost.slug.replace(/\/$/, "")}`,
        },
      }
    : currentCategory
      ? {
          metadataBase: new URL(SITE_URL),
          title: `${currentCategory.name} Category | ${SITE_NAME}`,
          description: currentCategory.description,
          robots: {
            index: true,
            follow: true,
          },
          openGraph: {
            title: `${currentCategory.name} Category | ${SITE_NAME}`,
            description: currentCategory.description,
            images: {
              url: `/opengraph/${currentSlug}/image`,
              alt: `${currentCategory.name} Category | ${SITE_NAME}`,
            },
          },
          alternates: {
            canonical: `/${currentCategory.slug.replace(/\/$/, "")}`,
          },
        }
      : {
          metadataBase: new URL(SITE_URL),
          title: `${SITE_NAME}`,
          description: `Blog of ${SITE_NAME}`,
          robots: {
            index: true,
            follow: true,
          },
          openGraph: {
            title: `${SITE_NAME}`,
            images: {
              url: `/opengraph/image`,
              alt: `${SITE_NAME}`,
            },
          },
          alternates: {
            canonical: `/`,
          },
        };
  return metadata;
}

export default async function CategoryOrPost({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: slugArray } = await params;

  const isPagination =
    slugArray && slugArray.at(-2) === "page" && /^\d+$/.test(slugArray.at(-1) ?? "");
  const page = isPagination ? Number(slugArray.at(-1)) || 1 : 1;
  if (isPagination && page === 1) {
    redirect(`/${slugArray.slice(0, -2).join("/")}`, RedirectType.replace);
  }

  const currentSlug = isPagination ? slugArray.slice(0, -2).join("/") : slugArray?.join("/");
  const {
    categories: currentCategories,
    category: currentCategory,
    post: currentPost,
  } = contentFromSlug(currentSlug);
  const pageSources = currentCategory ? currentCategory.posts : posts;
  const pageCount = Math.ceil(pageSources.length / PAGE_SIZE);
  const pageNext = page < pageCount ? page + 1 : undefined;
  const pageItems = paginate(pageSources, page, PAGE_SIZE);
  const nextSlug = pageNext
    ? [...(currentSlug ? toSlugArray(currentSlug) : []), "page", `${pageNext}`].join("/")
    : undefined;

  const author = {
    "@type": "Person",
    name: "Yeongseok Yoon",
  } satisfies Person;

  const jsonLd: WithContext<BlogPosting | CollectionPage | WebSite> = currentPost
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: currentPost.title,
        description: currentPost.description,
        author,
        datePublished: new Date(currentPost.datePublished).toISOString(),
        dateModified: new Date(currentPost.dateModified).toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/${currentPost.slug}`,
        },
        url: `${SITE_URL}/${currentPost.slug}`,
        articleSection: currentCategory?.name ?? currentPost.categories.at(-1)?.name,
      }
    : currentCategory
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${currentCategory.name} Category`,
          description: currentCategory.description,
          about: {
            "@type": "Thing",
            name: currentCategory.name,
          },
          url: `${SITE_URL}/${currentCategory.slug}`,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
              ...currentCategories.map(
                (m, i): ListItem => ({
                  "@type": "ListItem",
                  position: i + 2,
                  name: m.name,
                  item: `${SITE_URL}/${m.slug}`,
                }),
              ),
            ],
          },
          hasPart: pageItems.map((m) => ({
            "@type": "BlogPosting",
            headline: m.title,
            description: m.description,
            author,
            datePublished: new Date(m.datePublished).toISOString(),
            dateModified: new Date(m.dateModified).toISOString(),
            url: `${SITE_URL}/${m.slug}`,
          })),
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description: `Blog of ${SITE_NAME}`,
          url: SITE_URL,
          hasPart: pageItems.map((m) => ({
            "@type": "BlogPosting",
            headline: m.title,
            description: m.description,
            author,
            datePublished: new Date(m.datePublished).toISOString(),
            dateModified: new Date(m.dateModified).toISOString(),
            url: `${SITE_URL}/${m.slug}`,
          })),
        };

  return currentPost ? (
    <Article item={currentPost} jsonLd={jsonLd as WithContext<BlogPosting>} />
  ) : currentCategory ? (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroCategory category={currentCategory} />
      <List items={pageItems} nextSlug={nextSlug} />
    </div>
  ) : (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <List items={pageItems} nextSlug={nextSlug} />
    </div>
  );
}
