import { Post } from "@/lib/contentlayer";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Fragment } from "react";

export default function ListItem({ item, ...props }: React.ComponentProps<"li"> & { item: Post }) {
  return (
    <li {...props}>
      <h3>
        <Link href={`/${item.slug}`}>{item.title}</Link>
      </h3>
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
      <p>{item.description}</p>
      <Link href={`/${item.slug}`} aria-label={`${item.title} - Read more`}>
        Read more
      </Link>
    </li>
  );
}
