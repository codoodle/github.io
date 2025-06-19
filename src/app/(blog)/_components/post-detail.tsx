import { Post } from "@/contents";
import PostMeta from "./post-meta";

type PostDetailProps = {
  post: Post;
};
export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <PostMeta post={post} />
        <p>{post.description}</p>
      </header>
      <section>{post.ContentComponent && <post.ContentComponent />}</section>
      <footer>
        {post.tags && post.tags.length > 0 && (
          <ul aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag.slug}>
                <a href={`/tags/${tag.slug}`}>#{tag.name}</a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    </article>
  );
}
