import { PostSimple } from "@/contents";
import { format } from "date-fns";
import Link from "next/link";

type PostMetaProps = {
  post: PostSimple;
};
export default function PostMeta({
  post: { datePublished, dateModified, categories },
}: PostMetaProps) {
  return (
    <div className="text-xs">
      <time dateTime={datePublished}>
        Published: {format(new Date(datePublished), "LLL d, yyyy")}
      </time>
      {dateModified !== datePublished && (
        <time dateTime={dateModified}>
          {" · "}Updated: {format(new Date(dateModified), "LLL d, yyyy")}
        </time>
      )}
      {categories && categories.length > 0 && (
        <>
          {" · "}in{" "}
          {categories.map((category, i) => (
            <span key={category.slug}>
              <Link href={`/${category.slug}`}>{category.name}</Link>
              {i < categories.length - 1 && ", "}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
