import { PAGE_SIZE, paginate } from "@/lib/pagination";
import { Blog, Category, Tag } from "@/types";
import PostListItem from "./post-list-item";
import PostListMore from "./post-list-more";

export default function PostList({
  page,
  blog,
  category,
  tag,
}: {
  page: number;
} & (
  | {
      blog: Blog;
      category?: never;
      tag?: never;
    }
  | {
      blog?: never;
      category: Category;
      tag?: never;
    }
  | {
      blog?: never;
      category?: never;
      tag: Tag;
    }
)) {
  const hero = blog ? (
    blog.ContentComponent ? (
      <blog.ContentComponent />
    ) : (
      <h1>#{blog.name}</h1>
    )
  ) : category ? (
    category.ContentComponent ? (
      <category.ContentComponent />
    ) : (
      <h1>#{category.name}</h1>
    )
  ) : (
    <h1>#{tag.name}</h1>
  );
  const title = blog
    ? "Latest Posts"
    : category
      ? `Posts in “${category.name}”`
      : `Posts in “#${tag.name}”`;
  const pageSources =
    (blog ? blog.posts : category ? category.posts : tag.posts) ?? [];
  const pageCount = Math.ceil(pageSources.length / PAGE_SIZE);
  const pageNext = page < pageCount ? page + 1 : undefined;
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

  return (
    <div>
      {hero}
      <section aria-labelledby="posts-title">
        <h2 id="posts-title">{title}</h2>
        {pageItems && pageItems.length > 0 ? (
          <ul>
            {pageItems.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
            {!!pageNext && <PostListMore />}
          </ul>
        ) : undefined}
      </section>
    </div>
  );
}
