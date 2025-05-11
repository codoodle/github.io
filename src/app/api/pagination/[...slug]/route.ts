import { categories, contentFromSlug, posts } from "@/lib/contentlayer";
import { PAGE_SIZE, paginate } from "@/lib/pagination";
import { toSlugArray } from "@/lib/slug";
import { NextRequest, NextResponse } from "next/server";

export function generateStaticParams() {
  return [
    ...Array.from({ length: Math.ceil(posts.length / PAGE_SIZE) }, (_, i) => ({
      slug: ["page", `${i + 1}`],
    })),
    ...categories.reduce(
      (acc, m) => {
        acc.push(
          ...Array.from({ length: Math.ceil(m.posts.length / PAGE_SIZE) }, (_, i) => ({
            slug: toSlugArray(m.slug).concat(["page", `${i + 1}`]),
          })),
        );
        return acc;
      },
      [] as { slug: string[] }[],
    ),
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug: slugArray } = await params;

  const isPagination =
    slugArray && slugArray.at(-2) === "page" && /^\d+$/.test(slugArray.at(-1) ?? "");
  const page = isPagination ? Number(slugArray.at(-1)) || 1 : 1;
  if (!isPagination) {
    return new Response("Not found", { status: 404 });
  }

  const currentSlug = slugArray.slice(0, -2).join("/");
  const { category: currentCategory } = contentFromSlug(currentSlug);
  const pageSources = currentCategory ? currentCategory.posts : posts;
  const pageCount = Math.ceil(pageSources.length / PAGE_SIZE);
  const pageNext = page < pageCount ? page + 1 : undefined;
  const pageItems = paginate(pageSources, page, PAGE_SIZE).map((m) => ({
    ...m,
    categories: m.categories.map((m) => ({ ...m, posts: [] })),
  }));
  const nextSlug = pageNext
    ? [...(currentSlug ? toSlugArray(currentSlug) : []), "page", `${pageNext}`].join("/")
    : undefined;

  return NextResponse.json({
    items: pageItems,
    nextSlug,
  });
}
