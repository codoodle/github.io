import { blog } from "@/contents";
import Link from "next/link";
import Nav from "./nav";
import NavItem from "./nav-item";

const categories = blog.categories.filter((category) => !category.categories);

export default function Header(props: React.ComponentProps<"header">) {
  return (
    <header {...props}>
      <div className="h-full flex items-center gap-4">
        <Link href="/">{blog.name}</Link>
        {categories.length > 0 && (
          <Nav className="flex gap-2 text-sm">
            {categories.map((category) => (
              <NavItem key={category.slug} href={`/${category.slug}`}>
                {category.name}
              </NavItem>
            ))}
          </Nav>
        )}
      </div>
    </header>
  );
}
