import { resolveContentBySlug, toSlugArray } from "@/contents";
import { PAGE_SIZE, paginate } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug: slugArray } = await params;
  const page = Number(slugArray!.at(-1)) || 1;
  const slugWithoutPagination = slugArray!.slice(0, -2).join("/");
  const { blog, category, tag } = resolveContentBySlug(slugWithoutPagination);

  const pageSources =
    (blog ? blog.posts : category ? category.posts : tag?.posts) ?? [];
  const pageCount = Math.ceil(pageSources.length / PAGE_SIZE);
  const pageNext = page < pageCount ? page + 1 : undefined;
  const pageNextSlug = pageNext
    ? [
        ...(slugWithoutPagination ? toSlugArray(slugWithoutPagination) : []),
        "page",
        `${pageNext}`,
      ].join("/")
    : undefined;
  const pageItems = paginate(pageSources, page, PAGE_SIZE).map(
    ({
      title,
      description,
      datePublished,
      dateModified,
      slug,
      categories,
    }) => ({
      title,
      description,
      datePublished,
      dateModified,
      slug,
      categories: categories?.map(({ name, description, slug }) => ({
        name,
        description,
        slug,
      })),
    }),
  );

  return NextResponse.json({
    pageItems,
    pageNext,
    pageNextSlug,
  });
}
