import { resolveContentBySlug } from "@/contents";
import PostDetail from "../_components/post-detail";
import PostList from "../_components/post-list";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug: slugArray } = await params;
  const isPagination =
    slugArray &&
    slugArray.at(-2) === "page" &&
    /^\d+$/.test(slugArray.at(-1) ?? "");
  const page = isPagination ? Number(slugArray.at(-1)) || 1 : 1;
  const slugWithoutPagination = isPagination
    ? slugArray.slice(0, -2).join("/")
    : slugArray?.join("/");
  const { blog, category, post, tag } = resolveContentBySlug(
    slugWithoutPagination,
  );

  return (
    <div>
      {blog ? (
        <PostList page={page} blog={blog} />
      ) : category ? (
        <PostList page={page} category={category} />
      ) : tag ? (
        <PostList page={page} tag={tag} />
      ) : post ? (
        <PostDetail post={post} />
      ) : undefined}
    </div>
  );
}
