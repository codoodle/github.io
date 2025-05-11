import { Post } from "@/lib/contentlayer";
import ListItem from "./list-item";
import ListMore from "./list-more";

export default function List({
  items,
  nextSlug,
  ...props
}: React.ComponentProps<"section"> & { items: Post[]; nextSlug?: string }) {
  return (
    <section {...props}>
      {items.length > 0 && (
        <>
          <ul>
            {items.map((m) => (
              <ListItem key={m._id} item={m} />
            ))}
          </ul>
          {nextSlug && <ListMore nextSlug={nextSlug} />}
        </>
      )}
    </section>
  );
}
