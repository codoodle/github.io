import { hero } from "@/lib/contentlayer";

export default function Hero({ ...props }: React.ComponentProps<"section">) {
  return <section {...props} dangerouslySetInnerHTML={{ __html: hero.body.html }}></section>;
}
