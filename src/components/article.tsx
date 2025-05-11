import { Post } from "@/lib/contentlayer";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Fragment } from "react";
import { BlogPosting, WithContext } from "schema-dts";

export default function Article({
  item,
  jsonLd,
  ...props
}: React.ComponentProps<"article"> & {
  item: Post;
  jsonLd: WithContext<BlogPosting>;
}) {
  return (
    <article {...props}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2>{item.title}</h2>
      <footer>
        <time dateTime={item.datePublished}>
          {format(parseISO(item.datePublished), "LLLL d, yyyy")}
        </time>
        {item.categories.length > 0 && (
          <span aria-label="Categories">
            {" in "}
            {item.categories.map((m, i) => (
              <Fragment key={m._id}>
                <Link href={`/${m.slug}`}>{m.name}</Link>
                {i < item.categories.length - 1 && ", "}
              </Fragment>
            ))}
          </span>
        )}
      </footer>
      {item.tags && item.tags.length > 0 && (
        <ul>
          {item.tags.map((tag) => (
            <li key={tag.slug}>
              <Link href={`/tags/${tag.slug}`}>#{tag.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <div dangerouslySetInnerHTML={{ __html: item.body.html }} />
    </article>
  );
}
