import { PostSimple } from "@/contents";
import Link from "next/link";
import PostMeta from "./post-meta";

type PostListItemProps = {
  post: PostSimple;
};
export default function PostListItem({ post }: PostListItemProps) {
  return (
    <li>
      <article>
        <h3>
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
        <PostMeta post={post} />
        <p>{post.description}</p>
      </article>
    </li>
  );
}
