import { categories } from "@/lib/contentlayer";
import NavItem from "./nav-item";

export default function Nav(props: React.ComponentProps<"nav">) {
  return (
    <nav {...props}>
      {categories.length > 0 && (
        <ul>
          {categories
            .filter((f) => /^\w+$/.test(f.slug))
            .map((m) => (
              <li key={m._id}>
                <NavItem category={m} href={`/${m.slug}`} />
              </li>
            ))}
        </ul>
      )}
    </nav>
  );
}
