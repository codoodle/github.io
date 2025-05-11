import { Category } from "@/lib/contentlayer";

export default function HeroCategory({
  category,
  ...props
}: React.ComponentProps<"section"> & { category: Category }) {
  return <section {...props} dangerouslySetInnerHTML={{ __html: category.body.html }}></section>;
}
